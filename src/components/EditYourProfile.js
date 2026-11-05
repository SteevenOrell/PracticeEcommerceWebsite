import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { UserContext } from "./UserContextComponent";
import { Toast } from "./ui/Toast";
import { auth } from "../lib/firebase";

/**
 * Profile page. Only the display name is editable from the browser and it is written to
 * the signed-in user's own Firebase profile. Email, role and password are not editable
 * here: the role is assigned server-side, and password changes go through Firebase's
 * reset-email flow so the password never passes through app code or the public API.
 */
function EditYourProfile() {
    const { user, setUser } = useContext(UserContext);
    const [name, setName] = useState(user?.name || "");
    const [toast, setToast] = useState(null);

    function handleSave(e) {
        e.preventDefault();
        const trimmed = name.trim();
        if (trimmed.length < 2 || trimmed.length > 60) {
            setToast({ title: "Profile update", message: "Name must be between 2 and 60 characters." });
            return;
        }
        setUser({ ...user, name: trimmed });
        setToast({ title: "Profile update", message: "Saved." });
    }

    async function handlePasswordReset() {
        if (!auth || !user?.email) return;
        try {
            await sendPasswordResetEmail(auth, user.email);
            setToast({ title: "Password", message: "We sent a reset link to your email." });
        } catch {
            setToast({ title: "Password", message: "Could not send the reset email. Try again later." });
        }
    }

    return (
        <main id="main" className="page-shell max-w-2xl">
            {toast && <Toast title={toast.title} message={toast.message} onClose={() => setToast(null)} />}
            <p className="eyebrow">Account</p>
            <h1 className="display-lg mt-2">Your profile</h1>

            <form className="mt-10 space-y-6" onSubmit={handleSave} noValidate>
                <div className="field">
                    <label htmlFor="profile-name">Display name</label>
                    <input id="profile-name" value={name} onChange={e => setName(e.target.value)} maxLength={60} autoComplete="name" required />
                </div>
                <div className="field">
                    <label htmlFor="profile-email">Email</label>
                    <input id="profile-email" value={user?.email || ""} readOnly aria-describedby="profile-email-help" />
                    <p id="profile-email-help" className="field-help">Email changes require re-verification and are not available in this demo.</p>
                </div>
                <div className="field">
                    <label htmlFor="profile-role">Role</label>
                    <input id="profile-role" value={user?.["user-role"] || "user"} readOnly />
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4">
                    <button type="submit" className="btn btn-primary">Save changes</button>
                    <button type="button" className="btn btn-ghost" onClick={handlePasswordReset}>Send password reset email</button>
                    <Link to="/" className="link-underline text-sm">Cancel</Link>
                </div>
            </form>
        </main>
    );
}

export default EditYourProfile;
