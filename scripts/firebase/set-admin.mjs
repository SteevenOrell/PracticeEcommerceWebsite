// Grant or revoke admin access for an existing Firebase Auth account.
//
//   npm run firebase:set-admin -- someone@example.com            # grant
//   npm run firebase:set-admin -- someone@example.com --revoke   # revoke
//   npm run firebase:set-admin -- --list                         # show current admins
//
// The person must have signed in at least once (e.g. with Google) so the account exists.
// They need to sign out and back in (or wait up to an hour) for the change to apply.
const args = process.argv.slice(2);

async function listAdmins(auth, target) {
    let pageToken;
    const admins = [];
    do {
        const page = await auth.listUsers(1000, pageToken);
        admins.push(...page.users.filter(u => u.customClaims?.admin === true).map(u => u.email || u.uid));
        pageToken = page.pageToken;
    } while (pageToken);
    console.log(admins.length ? `Admins on ${target}:\n  ${admins.join("\n  ")}` : `No admins on ${target}.`);
}

async function main() {
    const email = args.find(a => !a.startsWith("--"));
    if (!args.includes("--list") && !email) {
        console.error("Usage: npm run firebase:set-admin -- <email> [--revoke] | --list");
        process.exitCode = 1;
        return;
    }

    const { auth, target } = await import("./admin-app.mjs");
    if (args.includes("--list")) return listAdmins(auth, target);

    const revoke = args.includes("--revoke");
    const user = await auth.getUserByEmail(email);
    const claims = { ...(user.customClaims || {}) };
    if (revoke) delete claims.admin; else claims.admin = true;
    await auth.setCustomUserClaims(user.uid, claims);
    console.log(`${revoke ? "Revoked" : "Granted"} admin for ${email} on ${target}. They must sign out and back in.`);
}

// Avoid process.exit(): on Windows it can abort while gRPC/HTTP handles are closing.
main().catch(err => { console.error(err.message || err); process.exitCode = 1; });
