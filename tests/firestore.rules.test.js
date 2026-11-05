// Firestore security-rules tests. Run with `npm run test:rules` (starts the Firestore emulator).
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import { assertFails, assertSucceeds, initializeTestEnvironment } from "@firebase/rules-unit-testing";
import { deleteDoc, doc, getDoc, getDocs, collection, setDoc, updateDoc } from "firebase/firestore";

const product = {
    "article-name": "Test Runner", price: 120, quantity: 5, size: 9.5,
    category: "shoes", color: "Black", "image-folder-name": "TestRunner", id: "1",
};
const user = { name: "Jane Doe", email: "jane@example.com", "user-role": "user", createdAt: "2024-01-01T00:00:00.000Z" };

let env;
const guest = () => env.unauthenticatedContext().firestore();
const member = () => env.authenticatedContext("member-uid", { email: "member@example.com" }).firestore();
const admin = () => env.authenticatedContext("admin-uid", { email: "admin@example.com", admin: true }).firestore();

beforeAll(async () => {
    env = await initializeTestEnvironment({
        projectId: "demo-ecommerce",
        firestore: { rules: readFileSync("firestore.rules", "utf8") },
    });
});
afterAll(() => env?.cleanup());
beforeEach(async () => {
    await env.clearFirestore();
    await env.withSecurityRulesDisabled(async (ctx) => {
        await setDoc(doc(ctx.firestore(), "products/1"), product);
        await setDoc(doc(ctx.firestore(), "users/1"), user);
    });
});

describe("products", () => {
    it("anyone can read", async () => {
        await assertSucceeds(getDoc(doc(guest(), "products/1")));
        await assertSucceeds(getDocs(collection(guest(), "products")));
    });
    it("guests and members cannot create, edit or delete", async () => {
        for (const db of [guest(), member()]) {
            await assertFails(setDoc(doc(db, "products/2"), { ...product, id: "2" }));
            await assertFails(updateDoc(doc(db, "products/1"), { price: 1 }));
            await assertFails(deleteDoc(doc(db, "products/1")));
        }
    });
    it("a forged non-boolean admin claim is rejected", async () => {
        const db = env.authenticatedContext("x", { admin: "true" }).firestore();
        await assertFails(updateDoc(doc(db, "products/1"), { price: 1 }));
    });
    it("admins can write valid products", async () => {
        await assertSucceeds(updateDoc(doc(admin(), "products/1"), { price: 99 }));
        await assertSucceeds(deleteDoc(doc(admin(), "products/1")));
    });
    it("even admins cannot write malformed products", async () => {
        await assertFails(updateDoc(doc(admin(), "products/1"), { price: "free" }));
        await assertFails(updateDoc(doc(admin(), "products/1"), { "image-folder-name": "../../x" }));
        await assertFails(updateDoc(doc(admin(), "products/1"), { extra: "<script>" }));
    });
});

describe("users", () => {
    it("guests and members cannot read or write", async () => {
        for (const db of [guest(), member()]) {
            await assertFails(getDoc(doc(db, "users/1")));
            await assertFails(getDocs(collection(db, "users")));
            await assertFails(setDoc(doc(db, "users/2"), user));
            await assertFails(deleteDoc(doc(db, "users/1")));
        }
    });
    it("admins can read and write valid users", async () => {
        await assertSucceeds(getDocs(collection(admin(), "users")));
        await assertSucceeds(setDoc(doc(admin(), "users/2"), { ...user, email: "john@example.com" }));
        await assertSucceeds(deleteDoc(doc(admin(), "users/1")));
    });
    it("rejects passwords, bad emails, bad roles and non-https avatars", async () => {
        await assertFails(setDoc(doc(admin(), "users/3"), { ...user, password: "x" }));
        await assertFails(setDoc(doc(admin(), "users/3"), { ...user, email: "not-an-email" }));
        await assertFails(setDoc(doc(admin(), "users/3"), { ...user, "user-role": "root" }));
        await assertFails(setDoc(doc(admin(), "users/3"), { ...user, avatar: "javascript:alert(1)" }));
    });
});

describe("other collections", () => {
    it("are closed to everyone", async () => {
        await assertFails(setDoc(doc(admin(), "orders/1"), { total: 1 }));
        await assertFails(getDoc(doc(guest(), "secrets/1")));
    });
});
