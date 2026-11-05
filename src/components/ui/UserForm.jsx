import { useState } from "react";
import { Link } from "react-router-dom";

// Shared add/edit form for the admin user screens. Passwords are owned by Firebase Auth
// and are never collected here. Firestore rules re-validate everything server-side.
export const ROLE_OPTIONS = [
    { value: "user", label: "Member", hint: "Can browse and shop" },
    { value: "admin", label: "Admin", hint: "Shown as an admin in this list" },
];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function safeHttpsUrl(url) {
    try { const u = new URL(url); return u.protocol === "https:" ? u.href : undefined; } catch { return undefined; }
}

export function validateUser(v) {
    const errors = {};
    if (!v.name?.trim()) errors.name = "Enter a name.";
    else if (v.name.trim().length > 120) errors.name = "Keep it under 120 characters.";
    if (!v.email?.trim()) errors.email = "Enter an email address.";
    else if (!EMAIL_RE.test(v.email.trim())) errors.email = "That doesn't look like a valid email.";
    if (v.avatar?.trim() && !safeHttpsUrl(v.avatar.trim())) errors.avatar = "Use an https:// image link, or leave it empty.";
    if (!ROLE_OPTIONS.some(r => r.value === v["user-role"])) errors["user-role"] = "Choose a role.";
    return errors;
}

function initials(name) {
    return (name || "?").trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join("") || "?";
}

export function UserAvatar({ name, avatar, size = 56 }) {
    const [broken, setBroken] = useState(false);
    const src = safeHttpsUrl(avatar);
    return (
        <span className="user-avatar" style={{ width: size, height: size, fontSize: size * 0.36 }} aria-hidden="true">
            {src && !broken ? <img src={src} alt="" onError={() => setBroken(true)} /> : initials(name)}
        </span>
    );
}

/**
 * @param {{ mode: "add"|"edit", initial: object, onSubmit: (values) => Promise<string|void>, cancelTo: string }} props
 * onSubmit may resolve to an error message to show on the email field (e.g. duplicates).
 */
export function UserForm({ mode, initial, onSubmit, cancelTo }) {
    const [values, setValues] = useState({ name: "", email: "", avatar: "", "user-role": "user", ...initial });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [busy, setBusy] = useState(false);

    const set = (key) => (e) => {
        const next = { ...values, [key]: e.target.value };
        setValues(next);
        if (touched[key]) setErrors(validateUser(next));
    };
    const blur = (key) => () => { setTouched(t => ({ ...t, [key]: true })); setErrors(validateUser(values)); };

    async function submit(e) {
        e.preventDefault();
        const found = validateUser(values);
        setErrors(found);
        setTouched({ name: true, email: true, avatar: true, "user-role": true });
        if (Object.keys(found).length) {
            document.getElementById(`uf-${Object.keys(found)[0]}`)?.focus();
            return;
        }
        setBusy(true);
        try {
            const clean = { ...values, name: values.name.trim(), email: values.email.trim().toLowerCase(), avatar: values.avatar?.trim() || "" };
            const problem = await onSubmit(clean);
            if (problem) { setErrors({ email: problem }); document.getElementById("uf-email")?.focus(); }
            else if (mode === "add") { setValues({ name: "", email: "", avatar: "", "user-role": "user" }); setTouched({}); setErrors({}); }
        } finally {
            setBusy(false);
        }
    }

    const err = (key) => touched[key] && errors[key];
    const describedBy = (key, hint) => [hint && `uf-${key}-hint`, err(key) && `uf-${key}-error`].filter(Boolean).join(" ") || undefined;

    return (
        <form className="user-form" onSubmit={submit} noValidate aria-label={mode === "add" ? "Add user" : "Edit user"}>
            <aside className="user-form-preview" aria-label="Preview">
                <UserAvatar name={values.name} avatar={values.avatar} size={88} />
                <p className="mt-4 text-lg font-semibold break-words">{values.name.trim() || "New user"}</p>
                <p className="muted text-sm break-all">{values.email.trim() || "email@example.com"}</p>
                <span className={`role-pill ${values["user-role"] === "admin" ? "is-admin" : ""}`}>
                    {ROLE_OPTIONS.find(r => r.value === values["user-role"])?.label ?? "Member"}
                </span>
            </aside>

            <div className="user-form-fields">
                <div className="field">
                    <label htmlFor="uf-name">Full name</label>
                    <input id="uf-name" type="text" autoComplete="off" maxLength={120} value={values.name}
                        onChange={set("name")} onBlur={blur("name")} aria-invalid={Boolean(err("name"))} aria-describedby={describedBy("name")} />
                    {err("name") && <p id="uf-name-error" className="field-error">{errors.name}</p>}
                </div>

                <div className="field">
                    <label htmlFor="uf-email">Email address</label>
                    <input id="uf-email" type="email" autoComplete="off" maxLength={254} value={values.email}
                        onChange={set("email")} onBlur={blur("email")} aria-invalid={Boolean(err("email"))} aria-describedby={describedBy("email")} />
                    {err("email") && <p id="uf-email-error" className="field-error">{errors.email}</p>}
                </div>

                <div className="field">
                    <label htmlFor="uf-avatar">Avatar image URL <span className="muted font-normal">(optional)</span></label>
                    <input id="uf-avatar" type="url" inputMode="url" autoComplete="off" maxLength={2048} placeholder="https://…" value={values.avatar}
                        onChange={set("avatar")} onBlur={blur("avatar")} aria-invalid={Boolean(err("avatar"))} aria-describedby={describedBy("avatar", true)} />
                    <p id="uf-avatar-hint" className="field-help">Leave empty to show initials.</p>
                    {err("avatar") && <p id="uf-avatar-error" className="field-error">{errors.avatar}</p>}
                </div>

                <fieldset className="field">
                    <legend className="mb-2 text-[.8rem] font-semibold tracking-[.04em]">Role</legend>
                    <div className="segmented" role="radiogroup" aria-label="Role">
                        {ROLE_OPTIONS.map(r => (
                            <label key={r.value} className={`segmented-option ${values["user-role"] === r.value ? "is-active" : ""}`}>
                                <input type="radio" name="user-role" value={r.value} checked={values["user-role"] === r.value} onChange={set("user-role")} className="sr-only" />
                                <span className="font-semibold">{r.label}</span>
                                <span className="muted text-xs">{r.hint}</span>
                            </label>
                        ))}
                    </div>
                    <p className="field-help mt-2">This label is display data only. Real admin access is granted with <code>npm run firebase:set-admin</code>.</p>
                </fieldset>

                <div className="user-form-actions">
                    <Link to={cancelTo} className="btn btn-ghost">Cancel</Link>
                    <button type="submit" className="btn btn-primary" disabled={busy}>
                        {busy ? "Saving…" : mode === "add" ? "Add user" : "Save changes"}
                    </button>
                </div>
            </div>
        </form>
    );
}
