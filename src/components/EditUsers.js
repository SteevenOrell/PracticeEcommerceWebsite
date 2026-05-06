import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Toast } from "./ui/Toast";
import { getUsers, getUser, updateUser } from "../api/users";

const PROFILE_FIELDS = [["User-Role", ""], ["Name", ""], ["Email", "@"], ["Password", "*"]];

function EditUsers() {
    const { id } = useParams();
    const [otherUser, setDataOtherUser] = useState(null);
    const [isNotifDisplayed, setNotif] = useState(false);
    const [displayedMessage, setDisplayedMessage] = useState("Successful");
    const navigate = useNavigate();

    useEffect(() => {
        if (id.length > 0) {
            getUser(id)
                .then(res => {
                    if (res.data !== null) setDataOtherUser(res.data);
                })
                .catch(() => navigate("/"));
        }
    }, [id, navigate]);

    async function handleProfileUpdate(e) {
        e.preventDefault();

        for (let i = 1; i < PROFILE_FIELDS.length; i++) {
            const key = PROFILE_FIELDS[i][0].toLowerCase();
            if (!otherUser || otherUser[key].replace(" ", "").trim().length === 0) {
                setDisplayedMessage(`Unsuccessful — ${PROFILE_FIELDS[i][0]} is empty`);
                setNotif(true);
                return;
            }
        }

        const res = await getUsers();
        const duplicate = res.data.find(u =>
            u.name === otherUser.name &&
            u.email === otherUser.email &&
            u.password === otherUser.password &&
            u.id !== otherUser.id
        );
        if (duplicate) {
            setDisplayedMessage("Unsuccessful — user already exists with the same credentials");
            setNotif(true);
            return;
        }

        const updated = await updateUser(otherUser.id, otherUser);
        if (updated.status === 200) {
            setDisplayedMessage("Successful");
        }
        setNotif(true);
    }

    function handleDataChange(e) {
        setDataOtherUser(prev => ({ ...prev, [e.target.id]: e.target.value }));
    }

    return (
        <>
            {isNotifDisplayed && (
                <Toast
                    title="Update user"
                    message={displayedMessage}
                    onClose={() => setNotif(false)}
                />
            )}
            <form id="EditSingleUserForm">
                <div className="space-y-12">
                    <div className="border-b border-white-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-white-900">Edit User</h2>
                        <p className="mt-1 text-sm leading-6 text-white-600">
                            This information will be displayed publicly so be careful what you share.
                        </p>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            {PROFILE_FIELDS.map((field) => (
                                <div key={field[0]} className="sm:col-span-4">
                                    <label htmlFor={field[0].toLowerCase()} className="block text-sm font-medium leading-6 text-white-900">
                                        {field[0]}
                                    </label>
                                    <div className="mt-2">
                                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-white-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-500 sm:max-w-md">
                                            <span className="flex select-none items-center pl-3 text-white-500 sm:text-sm">{field[1]}</span>
                                            <input
                                                type={["email", "password"].includes(field[0].toLowerCase()) ? field[0].toLowerCase() : "text"}
                                                name={field[0].toLowerCase()}
                                                id={field[0].toLowerCase()}
                                                onChange={handleDataChange}
                                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-white-900 placeholder:text-white-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                defaultValue={otherUser ? otherUser[field[0].toLowerCase()] : ""}
                                                readOnly={field[0] === "User-Role"}
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
                    <Link to="/manage-users" className="text-sm font-semibold leading-6 text-white-900">Cancel</Link>
                    <button
                        type="submit"
                        className="rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
                        onClick={handleProfileUpdate}
                    >
                        Save
                    </button>
                </div>
            </form>
        </>
    );
}

export default EditUsers;
