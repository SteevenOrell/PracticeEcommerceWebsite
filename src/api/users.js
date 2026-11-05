import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

// Demo user records live in the Firestore `users` collection. Security rules
// (firestore.rules) only let accounts with the `admin: true` custom claim read or write
// them, so these calls fail with `permission-denied` for everyone else, whatever the UI does.
// Passwords are owned by Firebase Auth and are never stored here.
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

/** Drop sensitive fields before records reach component state. */
export function toPublicUser(u) {
    if (!u) return u;
    const { password, ...rest } = u; // eslint-disable-line no-unused-vars
    return rest;
}

function requireDb() {
    if (!db) throw new Error("Firebase is not configured.");
    return db;
}

const fromDoc = (snap) => toPublicUser({ ...snap.data(), id: snap.id });
const usersCol = () => collection(requireDb(), "users");

export async function getUsers() {
    const snap = await getDocs(usersCol());
    return { status: 200, data: snap.docs.map(fromDoc) };
}

export async function getUser(id) {
    const snap = await getDoc(doc(usersCol(), String(id)));
    return { status: snap.exists() ? 200 : 404, data: snap.exists() ? fromDoc(snap) : null };
}

export async function createUser(data) {
    const payload = { ...toUserPayload(data, { allowRole: true }), createdAt: new Date().toISOString() };
    const ref = await addDoc(usersCol(), payload);
    return { status: 201, data: { ...payload, id: ref.id } };
}

export async function updateUser(id, data) {
    const payload = toUserPayload(data, { allowRole: true });
    await setDoc(doc(usersCol(), String(id)), payload, { merge: true });
    return { status: 200, data: { ...payload, id: String(id) } };
}

export async function deleteUser(id) {
    await deleteDoc(doc(usersCol(), String(id)));
    return { status: 200, data: { id: String(id) } };
}
