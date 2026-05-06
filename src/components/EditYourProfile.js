import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { UserContext } from "./UserContextComponent";
import { Toast } from "./ui/Toast";
import { getUsers, updateUser } from "../api/users";

const PROFILE_FIELDS = [["User-Role", ""], ["Name", ""], ["Email", "@"], ["Password", "*"]];

function EditYourProfile() {
    const { user, setUser } = useContext(UserContext);
    const [userUpdated, setUpdatedUser] = useState(user);
    const [isNotifDisplayed, setNotif] = useState(false);
    const [displayedMessage, setDisplayedMessage] = useState("Successful");

    async function handleProfileUpdate(e) {
        e.preventDefault();

        for (let i = 1; i < PROFILE_FIELDS.length; i++) {
            const key = PROFILE_FIELDS[i][0].toLowerCase();
            if (!userUpdated || userUpdated[key].replace(" ", "").trim().length === 0) {
                setDisplayedMessage(`Unsuccessful — ${PROFILE_FIELDS[i][0]} is empty`);
                setNotif(true);
                return;
            }
        }

        const res = await getUsers();
        const duplicate = res.data.find(u =>
            u.name === userUpdated.name &&
            u.email === userUpdated.email &&
            u.password === userUpdated.password
        );
        if (duplicate) {
            setDisplayedMessage("Unsuccessful — user already exists with the same credentials");
            setNotif(true);
            return;
        }

        const updated = await updateUser(user.id, userUpdated);
        if (updated.status === 200) {
            setUser(userUpdated);
            setDisplayedMessage("Successful");
        }
        setNotif(true);
    }

    function handleDataChange(e) {
        setUpdatedUser(prev => ({ ...prev, [e.target.id]: e.target.value }));
    }

    return (
        <>
            {isNotifDisplayed && (
                <Toast
                    title="Profile update"
                    message={displayedMessage}
                    onClose={() => setNotif(false)}
                />
            )}
            <form id="ProfileForm">
                <div className="space-y-12">
                    <div className="border-b border-white-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-white-900">Profile</h2>
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
                                                defaultValue={userUpdated ? userUpdated[field[0].toLowerCase()] : ""}
                                                readOnly={field[0] === "User-Role"}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="col-span-full">
                                <label htmlFor="photo" className="block text-sm font-medium leading-6 text-white-900">Photo</label>
                                <div className="mt-2 flex items-center gap-x-3">
                                    <UserCircleIcon className="h-12 w-12 text-white-300" aria-hidden="true" />
                                    <button type="button" className="rounded-md bg-gray-700 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-500 hover:bg-gray-600">
                                        Change
                                    </button>
                                </div>
                            </div>

                            <div className="col-span-full">
                                <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-white-900">Cover photo</label>
                                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white-900/25 px-6 py-10">
                                    <div className="text-center">
                                        <PhotoIcon className="mx-auto h-12 w-12 text-white-300" aria-hidden="true" />
                                        <div className="mt-4 flex text-sm leading-6 text-white-600">
                                            <label htmlFor="file-upload" className="rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500">
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                            </div>
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
                        Save
                    </button>
                </div>
            </form>
        </>
    );
}

export default EditYourProfile;
