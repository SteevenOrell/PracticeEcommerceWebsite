import api from "./client";

// SECURITY: the mock users API is public and unauthenticated. Passwords are owned by
// Firebase Auth and must never be written here; roles must only be assigned server-side.
const WRITABLE_FIELDS = ["name", "email", "avatar", "createdAt"];
const ROLE_VALUES = ["user", "admin"];

export function toUserPayload(data, { allowRole = false } = {}) {
    const out = {};
    for (const key of WRITABLE_FIELDS) {
        if (data?.[key] !== undefined) out[key] = typeof data[key] === "string" ? data[key].trim() : data[key];
    }
    if (allowRole && ROLE_VALUES.includes(data?.["user-role"])) out["user-role"] = data["user-role"];
    return out;
}

/** Drop sensitive fields from API responses before they reach component state. */
export function toPublicUser(u) {
    if (!u) return u;
    const { password, ...rest } = u; // eslint-disable-line no-unused-vars
    return rest;
}

const safeId = (id) => encodeURIComponent(String(id));

export const getUsers = () => api.get("/users").then(res => ({ ...res, data: (res.data || []).map(toPublicUser) }));
export const getUser = (id) => api.get(`/users/${safeId(id)}`).then(res => ({ ...res, data: toPublicUser(res.data) }));
// Admin-only operations. The client-side admin check is UX only — see SECURITY.md.
export const createUser = (data) => api.post("/users", toUserPayload(data, { allowRole: true }));
export const updateUser = (id, data) => api.put(`/users/${safeId(id)}`, toUserPayload(data, { allowRole: true }));
export const deleteUser = (id) => api.delete(`/users/${safeId(id)}`);
