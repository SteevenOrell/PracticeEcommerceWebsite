import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { Toast } from "./ui/Toast";
import { AcmeLogo } from "./AcmeLogo";
import sideImg from "../assets/cd68aa257b0310cc65237e3e3b5b1a27.jpg";

const AUTH_DISABLED_MSG = "Sign-in is not configured in this environment.";

function getFirebaseError(code) {
    switch (code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":    return "Invalid email or password.";
        case "auth/too-many-requests":     return "Too many attempts. Try again later.";
        case "auth/invalid-email":         return "Invalid email address.";
        case "auth/popup-closed-by-user":  return "Google sign-in was cancelled.";
        case "auth/operation-not-allowed": return "This sign-in method is not enabled.";
        case "auth/network-request-failed":return "Network error. Check your connection.";
        case "auth/user-disabled":         return "This account has been disabled.";
        default:                           return "Something went wrong. Please try again.";
    }
}

function Login() {
    const navigate = useNavigate();
    const [view, setView] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [forgotEmail, setForgotEmail] = useState("");
    const [resetSent, setResetSent] = useState(false);
    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (title, message) => setToast({ title, message });

    async function run(fn) {
        if (!auth) return showToast("Unavailable", AUTH_DISABLED_MSG);
        setBusy(true);
        try { await fn(); } finally { setBusy(false); }
    }

    function handleSignIn(e) {
        e.preventDefault();
        run(async () => {
            try { await signInWithEmailAndPassword(auth, email, password); navigate("/"); }
            catch (err) { showToast("Sign in failed", getFirebaseError(err.code)); }
        });
    }

    function handleGoogleSignIn() {
        run(async () => {
            try {
                const provider = new GoogleAuthProvider();
                provider.setCustomParameters({ prompt: "select_account" });
                await signInWithPopup(auth, provider);
                navigate("/");
            } catch (err) { showToast("Google sign in failed", getFirebaseError(err.code)); }
        });
    }

    function handleForgotPassword(e) {
        e.preventDefault();
        run(async () => {
            try { await sendPasswordResetEmail(auth, forgotEmail); setResetSent(true); }
            catch (err) { showToast("Error", getFirebaseError(err.code)); }
        });
    }

    return (
        <main id="main" className="grid min-h-screen lg:grid-cols-2">
            {toast && <Toast title={toast.title} message={toast.message} onClose={() => setToast(null)} />}

            <div className="relative hidden overflow-hidden lg:block">
                <img src={sideImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <p className="display-xl absolute bottom-10 left-10 max-w-[8ch] text-white">Members move first</p>
            </div>

            <div className="flex flex-col px-6 py-10 sm:px-12">
                <Link to="/" className="self-start" aria-label="Clodio Vendem home"><AcmeLogo /></Link>

                <div className="mx-auto my-auto w-full max-w-md py-12">
                    {!auth && (
                        <p className="notice mb-8" role="note">Sign-in is disabled because Firebase is not configured in this environment. You can still browse and check out as a guest.</p>
                    )}

                    {view === "forgot" ? (
                        <>
                            <p className="eyebrow">Account</p>
                            <h1 className="display-lg mt-3">Reset password</h1>
                            {resetSent ? (
                                <div className="mt-8 space-y-6">
                                    <p className="muted" role="status">If an account exists for that email, a reset link is on its way. Check your inbox.</p>
                                    <button type="button" className="btn btn-ghost" onClick={() => { setView("login"); setResetSent(false); setForgotEmail(""); }}>Back to sign in</button>
                                </div>
                            ) : (
                                <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
                                    <div className="field">
                                        <label htmlFor="forgot-email">Email address</label>
                                        <input id="forgot-email" type="email" autoComplete="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required />
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-block" disabled={busy}>Send reset link</button>
                                    <button type="button" className="link-underline block w-full text-center text-sm" onClick={() => setView("login")}>Back to sign in</button>
                                </form>
                            )}
                        </>
                    ) : (
                        <>
                            <p className="eyebrow">Welcome back</p>
                            <h1 className="display-lg mt-3">Sign in</h1>
                            <form className="mt-8 space-y-5" onSubmit={handleSignIn}>
                                <div className="field">
                                    <label htmlFor="email">Email address</label>
                                    <input id="email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required />
                                </div>
                                <div className="field">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password">Password</label>
                                        <button type="button" className="link-underline text-xs muted hover:text-white" onClick={() => setView("forgot")}>Forgot password?</button>
                                    </div>
                                    <input id="password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required />
                                </div>
                                <button type="submit" className="btn btn-primary btn-block !min-h-[52px]" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
                            </form>

                            <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-widest muted">
                                <span className="h-px flex-1 bg-white/15" />or<span className="h-px flex-1 bg-white/15" />
                            </div>

                            <button type="button" onClick={handleGoogleSignIn} disabled={busy} className="btn btn-ghost btn-block !min-h-[52px]">
                                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Continue with Google
                            </button>
                        </>
                    )}
                </div>

                <Link to="/" className="link-underline self-center text-sm muted hover:text-white">← Back to the store</Link>
            </div>
        </main>
    );
}

export default Login;
