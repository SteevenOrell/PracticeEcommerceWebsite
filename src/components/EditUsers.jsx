import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Toast } from "./ui/Toast";
import { UserForm } from "./ui/UserForm";
import { getUsers, getUser, updateUser } from "../api/users";

const ID_RE = /^[A-Za-z0-9_-]{1,64}$/;

function EditUsers() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [status, setStatus] = useState("loading");
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (!ID_RE.test(id || "")) { setStatus("notfound"); return; }
        getUser(id)
            .then(res => { if (res.data) { setUser(res.data); setStatus("ready"); } else setStatus("notfound"); })
            .catch(() => setStatus("error"));
    }, [id]);

    async function handleSave(values) {
        try {
            const { data } = await getUsers();
            if (data.some(u => u.id !== user.id && u.email?.toLowerCase() === values.email)) {
                return "Another user already uses this email.";
            }
            await updateUser(user.id, values);
            setUser(prev => ({ ...prev, ...values }));
            setToast({ title: "Saved", message: `${values.name}'s details were updated.` });
        } catch {
            setToast({ title: "Couldn't save", message: "Admin access is required." });
        }
    }

    return (
        <>
            <main id="main" className="admin-shell">
                <nav aria-label="Breadcrumb" className="mb-6 text-sm">
                    <Link to="/manage-users" className="link-underline muted hover:text-white">← All users</Link>
                </nav>
                <p className="eyebrow">Admin</p>
                <h1 className="display-lg mt-2">Edit user</h1>

                <section className="admin-panel mt-8">
                    {status === "loading" && <p className="muted py-10 text-center">Loading…</p>}
                    {status === "notfound" && <p className="notice" role="alert">This user doesn't exist. <Link to="/manage-users" className="link-underline">Back to all users</Link></p>}
                    {status === "error" && <p className="notice" role="alert">Couldn't load this user. Your account needs admin access.</p>}
                    {status === "ready" && (
                        <UserForm key={user.id} mode="edit" initial={{ name: user.name || "", email: user.email || "", avatar: user.avatar || "", "user-role": user["user-role"] || "user" }}
                            onSubmit={handleSave} cancelTo="/manage-users" />
                    )}
                </section>
            </main>
            {toast && <Toast title={toast.title} message={toast.message} onClose={() => setToast(null)} />}
        </>
    );
}

export default EditUsers;
