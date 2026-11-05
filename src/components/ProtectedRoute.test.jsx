import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { UserContext } from "./UserContextComponent";

function renderAt(user, path, requireAdmin = false) {
    return render(
        <UserContext.Provider value={{ user, setUser: () => {}, logout: () => {} }}>
            <MemoryRouter initialEntries={[path]}>
                <Routes>
                    <Route path="/" element={<p>home</p>} />
                    <Route path="/login" element={<p>login</p>} />
                    <Route element={<ProtectedRoute requireAdmin={requireAdmin} />}>
                        <Route path="/secret" element={<p>secret</p>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        </UserContext.Provider>
    );
}

describe("ProtectedRoute", () => {
    it("redirects anonymous users to login", () => {
        renderAt(null, "/secret");
        expect(screen.getByText("login")).toBeInTheDocument();
    });

    it("redirects non-admins away from admin routes", () => {
        renderAt({ id: "u1", "user-role": "user" }, "/secret", true);
        expect(screen.getByText("home")).toBeInTheDocument();
    });

    it("renders admin routes for admins", () => {
        renderAt({ id: "u1", "user-role": "admin" }, "/secret", true);
        expect(screen.getByText("secret")).toBeInTheDocument();
    });
});
