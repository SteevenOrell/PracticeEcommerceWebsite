import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Tooltip, Tabs, Tab } from "@nextui-org/react";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { Toast } from "./ui/Toast";
import { getUsers, createUser, deleteUser } from "../api/users";

const ADD_USER_FIELDS = ["Name", "Email", "Password", "User-Role"];

const INITIAL_USER = {
    createdAt: new Date(),
    name: "",
    avatar: "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/142.jpg",
    password: "",
    email: "",
    "user-role": "",
};

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
        getUsers().then(res => {
            if (res.data !== null) setUsers(res.data);
        });
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

        const res = await getUsers();
        const duplicate = res.data.find(u =>
            u.name === userToAdd.name && u.email === userToAdd.email
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
    }

    function handleDataChange(e) {
        setUserToAdd(prev => ({ ...prev, [e.target.id]: e.target.value }));
    }

    async function handleDelete(id) {
        if (!id) return;
        const res = await deleteUser(id);
        if (res.status === 200) {
            setDisplayedMessage("Successfully Deleted");
        } else {
            setDisplayedMessage("Operation Failed — unable to delete");
        }
        setNotif(true);
        refreshData();
    }

    return (
        <>
            <div className="flex w-full flex-col">
                <Tabs id="ManagerUserTab" aria-label="Options">
                    <Tab key="ViewUsers" title="View Users">
                        <div id="DivTableUsers">
                            <h1 id="TitleUserList">List of Users</h1>
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
                                                    avatarProps={{ radius: "lg", src: item.avatar }}
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
                                                        <input
                                                            type={["email", "password"].includes(field.toLowerCase()) ? field.toLowerCase() : "text"}
                                                            name={field.toLowerCase()}
                                                            id={field.toLowerCase()}
                                                            onChange={handleDataChange}
                                                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-white-900 placeholder:text-white-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                            required
                                                        />
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
            </div>

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
