import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Toast } from "./ui/Toast";
import { UserForm, UserAvatar, ROLE_OPTIONS } from "./ui/UserForm";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { getUsers, createUser, deleteUser } from "../api/users";

const roleLabel = (r) => ROLE_OPTIONS.find(o => o.value === r)?.label ?? "Member";

function ManageUsers() {
    const [view, setView] = useState("list");
    const [users, setUsers] = useState([]);
    const [status, setStatus] = useState("loading");
    const [query, setQuery] = useState("");
    const [confirmId, setConfirmId] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => { refresh(); }, []);

    async function refresh() {
        try {
            const res = await getUsers();
            setUsers([...res.data].sort((a, b) => (a.name || "").localeCompare(b.name || "")));
            setStatus("ready");
        } catch {
            setStatus("error");
        }
    }

    async function handleAdd(values) {
        try {
            const { data } = await getUsers();
            if (data.some(u => u.email?.toLowerCase() === values.email)) return "A user with this email already exists.";
            await createUser(values);
            setToast({ title: "User added", message: `${values.name} was added.` });
            await refresh();
            setView("list");
        } catch {
            setToast({ title: "Couldn't add user", message: "Admin access is required." });
        }
    }

    async function handleDelete(user) {
        try {
            await deleteUser(user.id);
            setToast({ title: "User deleted", message: `${user.name || "The user"} was removed.` });
            await refresh();
        } catch {
            setToast({ title: "Couldn't delete user", message: "Admin access is required." });
        } finally {
            setConfirmId(null);
        }
    }

    const q = query.trim().toLowerCase();
    const shown = q ? users.filter(u => `${u.name} ${u.email}`.toLowerCase().includes(q)) : users;
    const adminCount = users.filter(u => u["user-role"] === "admin").length;

    return (
        <>
            <main id="main" className="admin-shell">
                <header className="admin-header">
                    <div>
                        <p className="eyebrow">Admin</p>
                        <h1 className="display-lg mt-2">Manage users</h1>
                        <p className="muted mt-3 max-w-xl text-sm">Fake demo records stored in Firestore. Only accounts with admin access can read or change them; the database rules enforce this, not just this screen.</p>
                    </div>
                    <div className="segmented admin-tabs" role="tablist" aria-label="Manage users">
                        <button type="button" role="tab" aria-selected={view === "list"} className={`segmented-option ${view === "list" ? "is-active" : ""}`} onClick={() => setView("list")}>
                            All users <span className="muted">({users.length})</span>
                        </button>
                        <button type="button" role="tab" aria-selected={view === "add"} className={`segmented-option ${view === "add" ? "is-active" : ""}`} onClick={() => setView("add")}>
                            + Add user
                        </button>
                    </div>
                </header>

                {view === "add" ? (
                    <section aria-labelledby="add-title" className="admin-panel">
                        <h2 id="add-title" className="admin-panel-title">Add a user</h2>
                        <UserForm mode="add" initial={{}} onSubmit={handleAdd} cancelTo="/manage-users" />
                    </section>
                ) : (
                    <section aria-label="Users" className="admin-panel">
                        <div className="admin-toolbar">
                            <div className="field flex-1">
                                <label htmlFor="user-search" className="sr-only">Search users</label>
                                <input id="user-search" type="search" placeholder="Search by name or email" value={query} onChange={e => setQuery(e.target.value)} />
                            </div>
                            <p className="muted text-sm">{users.length} users · {adminCount} admin{adminCount === 1 ? "" : "s"}</p>
                        </div>

                        {status === "loading" && <p className="muted py-10 text-center">Loading users…</p>}
                        {status === "error" && (
                            <p className="notice my-6" role="alert">Couldn't load users. Your account needs admin access. <button type="button" className="link-underline" onClick={refresh}>Try again</button></p>
                        )}
                        {status === "ready" && shown.length === 0 && <p className="muted py-10 text-center">No users match “{query}”.</p>}

                        {status === "ready" && shown.length > 0 && (
                            <ul className="user-list">
                                {shown.map(u => (
                                    <li key={u.id} className="user-row">
                                        <UserAvatar name={u.name} avatar={u.avatar} size={44} />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-semibold">{u.name}</p>
                                            <p className="muted truncate text-sm">{u.email}</p>
                                        </div>
                                        <span className={`role-pill ${u["user-role"] === "admin" ? "is-admin" : ""}`}>{roleLabel(u["user-role"])}</span>
                                        {confirmId === u.id ? (
                                            <div className="user-row-actions" role="group" aria-label={`Confirm delete ${u.name}`}>
                                                <span className="hidden text-sm sm:inline">Delete?</span>
                                                <button type="button" className="btn btn-danger !min-h-[36px] !px-4 text-sm" onClick={() => handleDelete(u)}>Delete</button>
                                                <button type="button" className="btn btn-ghost !min-h-[36px] !px-4 text-sm" onClick={() => setConfirmId(null)}>Keep</button>
                                            </div>
                                        ) : (
                                            <div className="user-row-actions">
                                                <Link to={`/edit-users/${encodeURIComponent(u.id)}`} className="icon-btn" aria-label={`Edit ${u.name}`} title="Edit"><EditIcon /></Link>
                                                <button type="button" className="icon-btn text-[#ff6b6b]" aria-label={`Delete ${u.name}`} title="Delete" onClick={() => setConfirmId(u.id)}><DeleteIcon /></button>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                )}
            </main>

            {toast && <Toast title={toast.title} message={toast.message} onClose={() => setToast(null)} />}
        </>
    );
}

export default ManageUsers;
