import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { auth } from "../lib/firebase";

const UserContext = createContext({ user: null, setUser: () => {}, logout: () => {} });

/**
 * Resolve the UI role for a signed-in user.
 *
 * SECURITY NOTE: this only decides what the UI shows. Anything enforced in the browser
 * can be bypassed, so admin data/operations MUST be authorised by a backend that verifies
 * the Firebase ID token (see SECURITY.md). Preferred source is a Firebase custom claim
 * (`admin: true` or `role: "admin"`) set server-side with the Admin SDK. The admin-email
 * fallback is kept only for backwards compatibility and requires a verified email.
 */
async function resolveRole(firebaseUser) {
    try {
        const { claims } = await firebaseUser.getIdTokenResult();
        if (claims.admin === true || claims.role === "admin") return "admin";
    } catch {
        // fall through to the legacy check
    }
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    if (adminEmail && firebaseUser.emailVerified &&
        firebaseUser.email?.toLowerCase() === adminEmail.toLowerCase()) {
        return "admin";
    }
    return "user";
}

function UserContextComponent({ children }) {
    const [user, setDataUser] = useState(null);
    const [loading, setLoading] = useState(Boolean(auth));

    useEffect(() => {
        if (!auth) return undefined;
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const role = await resolveRole(firebaseUser);
                setDataUser({
                    id: firebaseUser.uid,
                    name: firebaseUser.displayName || firebaseUser.email?.split("@")[0],
                    email: firebaseUser.email,
                    avatar: firebaseUser.photoURL,
                    "user-role": role,
                });
            } else {
                setDataUser(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    // Only display fields are updatable from the client; the role is never taken from input.
    const setUser = (userData) => {
        if (!userData) { setDataUser(null); return; }
        setDataUser(prev => prev ? { ...prev, name: userData.name, avatar: userData.avatar } : prev);
        if (auth?.currentUser) {
            updateProfile(auth.currentUser, {
                displayName: userData.name,
                photoURL: userData.avatar || null,
            }).catch(() => {});
        }
    };

    const logout = () => (auth ? signOut(auth) : Promise.resolve());

    if (loading) return null;

    return (
        <UserContext.Provider value={{ user, setUser, logout, authEnabled: Boolean(auth) }}>
            {children}
        </UserContext.Provider>
    );
}

export { UserContextComponent, UserContext };
