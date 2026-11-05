import { toUserPayload, toPublicUser } from "./users";

describe("users API sanitisers", () => {
    it("never forwards passwords or unknown fields", () => {
        const payload = toUserPayload({ name: " Jane Doe ", email: "jane@example.com", password: "x", isAdmin: true });
        expect(payload).toEqual({ name: "Jane Doe", email: "jane@example.com" });
    });

    it("only forwards an allow-listed role when explicitly allowed", () => {
        expect(toUserPayload({ "user-role": "admin" })).toEqual({});
        expect(toUserPayload({ "user-role": "admin" }, { allowRole: true })).toEqual({ "user-role": "admin" });
        expect(toUserPayload({ "user-role": "root" }, { allowRole: true })).toEqual({});
    });

    it("strips password from API responses", () => {
        expect(toPublicUser({ id: "1", email: "test@example.com", password: "secret" })).toEqual({ id: "1", email: "test@example.com" });
    });
});
