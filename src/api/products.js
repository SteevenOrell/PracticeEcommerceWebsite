import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import catalog from "../data/products.json";

// Products live in the Firestore `products` collection. Security rules (firestore.rules)
// allow anyone to read them and only admins to write them. When Firebase isn't configured
// (local dev without a .env), the bundled read-only catalog snapshot is used instead.

const byId = (a, b) => Number(a.id) - Number(b.id) || String(a.id).localeCompare(String(b.id));
const fromDoc = (snap) => ({ ...snap.data(), id: snap.id });

export async function getProducts() {
    if (!db) return { data: [...catalog].sort(byId) };
    const snap = await getDocs(collection(db, "products"));
    return { data: snap.docs.map(fromDoc).sort(byId) };
}

/** Resolves `{ data: null }` when the product doesn't exist. */
export async function getProduct(id) {
    const key = String(id);
    if (!db) return { data: catalog.find(p => String(p.id) === key) ?? null };
    const snap = await getDoc(doc(db, "products", key));
    return { data: snap.exists() ? fromDoc(snap) : null };
}
