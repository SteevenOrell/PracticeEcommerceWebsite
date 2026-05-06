import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { auth } from "../lib/firebase";

const UserContext = createContext({ user: null, setUser: () => {}, logout: () => {} });

function UserContextComponent({ children }) {
    const [user, setDataUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                const isAdmin = firebaseUser.email === process.env.REACT_APP_ADMIN_EMAIL;
                setDataUser({
                    id: firebaseUser.uid,
                    name: firebaseUser.displayName || firebaseUser.email?.split("@")[0],
                    email: firebaseUser.email,
                    avatar: firebaseUser.photoURL,
                    "user-role": isAdmin ? "admin" : "user",
                });
            } else {
                setDataUser(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const setUser = (userData) => {
        setDataUser(userData);
        if (auth.currentUser && userData) {
            updateProfile(auth.currentUser, {
                displayName: userData.name,
                photoURL: userData.avatar,
            }).catch(() => {});
        }
    };

    const logout = () => signOut(auth);

    if (loading) return null;

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export { UserContextComponent, UserContext };
