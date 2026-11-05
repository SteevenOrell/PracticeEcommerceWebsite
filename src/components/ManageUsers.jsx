import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Tooltip, Tabs, Tab } from "@nextui-org/react";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { Toast } from "./ui/Toast";
import { getUsers, createUser, deleteUser } from "../api/users";

// Passwords are managed by Firebase Auth and are never collected or stored here.
const ADD_USER_FIELDS = ["Name", "Email", "User-Role"];
const ROLE_OPTIONS = ["user", "admin"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_USER = {
    createdAt: new Date(),
    name: "",
    avatar: "",
    email: "",
    "user-role": "user",
};

/** Only allow http(s) image URLs coming from the public API. */
function safeImageUrl(url) {
    try {
        const u = new URL(url);
        return ["https:", "http:"].includes(u.protocol) ? u.href : undefined;
    } catch {
        return undefined;
    }
}

const columnHeader = [
    { name: "NAME", uid: "name" },
    { name: "User Role", uid: "user-role" },
    { name: "ACTIONS", uid: "actions" },
];

function ManageUsers() {
    const [userToAdd, setUserToAdd] = useState({ ...INITIAL_USER });
    const [isNotifDisplayed, setNotif] = useState(false);
    const [usersList, setUsers] = useState([]);
    const [displayedMessage, setDisplayedMessage] = useState("Successfully Deleted");
    const addFormRef = useRef(null);

    useEffect(() => {
        refreshData();
    }, []);

    function refreshData() {
        getUsers()
            .then(res => { if (res.data !== null) setUsers(res.data); })
            .catch(() => {
                setDisplayedMessage("Unable to load users — admin access required");
                setNotif(true);
            });
    }

    async function guarded(fn) {
        try {
            await fn();
        } catch {
            setDisplayedMessage("Operation failed — admin access required");
            setNotif(true);
        }
    }

    async function handleProfileUpdate(e) {
        e.preventDefault();

        for (let i = 0; i < ADD_USER_FIELDS.length; i++) {
            const key = ADD_USER_FIELDS[i].toLowerCase();
            if (!userToAdd[key] || userToAdd[key].replace(" ", "").trim().length === 0) {
                setDisplayedMessage(`Cannot be added — ${ADD_USER_FIELDS[i]} is empty`);
                setNotif(true);
                return;
            }
        }

        if (!EMAIL_RE.test(userToAdd.email.trim()) || !ROLE_OPTIONS.includes(userToAdd["user-role"])) {
            setDisplayedMessage("Cannot be added — invalid email or role");
            setNotif(true);
            return;
        }

        await guarded(async () => {
            const res = await getUsers();
            const duplicate = res.data.find(u =>
                u.email?.toLowerCase() === userToAdd.email.trim().toLowerCase()
            );
            if (duplicate) {
                setDisplayedMessage("Cannot be added — user already exists");
                setNotif(true);
                return;
            }

            const created = await createUser(userToAdd);
            if ([200, 201].includes(created.status)) {
                setDisplayedMessage("Added Successfully");
                addFormRef.current?.reset();
                setUserToAdd({ ...INITIAL_USER, createdAt: new Date() });
                refreshData();
            }
            setNotif(true);
        });
    }

    function handleDataChange(e) {
        setUserToAdd(prev => ({ ...prev, [e.target.id]: e.target.value }));
    }

    async function handleDelete(id) {
        if (!id) return;
        await guarded(async () => {
            await deleteUser(id);
            setDisplayedMessage("Successfully Deleted");
            setNotif(true);
            refreshData();
        });
    }

    return (
        <>
            <main id="main" className="admin-shell flex w-full flex-col">
                <p className="eyebrow">Admin</p>
                <h1 className="display-lg mb-8 mt-2">Manage users</h1>
                <p className="notice mb-8" role="note">These are fake demo records stored in Firestore. Only accounts with admin access can read or change them; the database rules enforce this, not just this screen.</p>
                <Tabs id="ManagerUserTab" aria-label="Options">
                    <Tab key="ViewUsers" title="View Users">
                        <div id="DivTableUsers">
                            <h2 id="TitleUserList">List of users</h2>
                            <Table id="TableUsers" aria-label="Users table">
                                <TableHeader columns={columnHeader}>
                                    {(col) => (
                                        <TableColumn key={col.uid} align={col.uid === "actions" ? "center" : "start"}>
                                            {col.name}
                                        </TableColumn>
                                    )}
                                </TableHeader>
                                <TableBody items={usersList}>
                                    {(item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <User
                                                    avatarProps={{ radius: "lg", src: safeImageUrl(item.avatar) }}
                                                    description={item.email}
                                                    name={item.name}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-bold text-sm capitalize">{item["user-role"]}</p>
                                            </TableCell>
                                            <TableCell>
                                                <div className="relative flex items-center gap-2">
                                                    <Link to={`/edit-users/${item.id}`}>
                                                        <Tooltip content="Edit user">
                                                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                                                <EditIcon />
                                                            </span>
                                                        </Tooltip>
                                                    </Link>
                                                    <div className="UsersDeleteBtn">
                                                        <Tooltip color="danger" content="Delete user">
                                                            <span
                                                                className="text-lg text-danger cursor-pointer active:opacity-50"
                                                                onClick={() => handleDelete(item.id)}
                                                            >
                                                                <DeleteIcon />
                                                            </span>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Tab>

                    <Tab key="AddUser" title="Add User">
                        <form id="AddUserForm" ref={addFormRef}>
                            <div className="space-y-12">
                                <div className="border-b border-white-900/10 pb-12">
                                    <h2 className="text-base font-semibold leading-7 text-white-900">Profile</h2>
                                    <p className="mt-1 text-sm leading-6 text-white-600">Add a user</p>

                                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                        {ADD_USER_FIELDS.map((field) => (
                                            <div key={field} className="sm:col-span-4">
                                                <label htmlFor={field.toLowerCase()} className="block text-sm font-medium leading-6 text-white-900">
                                                    {field}
                                                </label>
                                                <div className="mt-2">
                                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-white-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-500 sm:max-w-md">
                                                        {field === "User-Role" ? (
                                                            <select
                                                                name="user-role"
                                                                id="user-role"
                                                                value={userToAdd["user-role"]}
                                                                onChange={handleDataChange}
                                                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 sm:text-sm sm:leading-6"
                                                            >
                                                                {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                                            </select>
                                                        ) : (
                                                            <input
                                                                type={field === "Email" ? "email" : "text"}
                                                                name={field.toLowerCase()}
                                                                id={field.toLowerCase()}
                                                                onChange={handleDataChange}
                                                                maxLength={120}
                                                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-white-900 placeholder:text-white-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                                required
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-x-6">
                                <Link to="/" className="text-sm font-semibold leading-6 text-white-900">Cancel</Link>
                                <button
                                    type="submit"
                                    className="rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
                                    onClick={handleProfileUpdate}
                                >
                                    Add User
                                </button>
                            </div>
                        </form>
                    </Tab>
                </Tabs>
            </main>

            {isNotifDisplayed && (
                <Toast
                    title="User"
                    message={displayedMessage}
                    onClose={() => setNotif(false)}
                />
            )}
        </>
    );
}

export default ManageUsers;
