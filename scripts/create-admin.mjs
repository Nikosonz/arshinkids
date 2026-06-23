// Generate the SQL INSERT for an admin user, with a scrypt password hash that
// matches lib/server/password.ts. Run locally (works offline), paste the
// printed SQL into the Neon SQL console. CLAUDE.md §1/§11.
//
//   node scripts/create-admin.mjs <email> <password> [name]
//
import { scryptSync, randomBytes, randomUUID } from "node:crypto";

const [, , email, password, name] = process.argv;
if (!email || !password) {
  console.error("Usage: node scripts/create-admin.mjs <email> <password> [name]");
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64).toString("hex");
const passwordHash = `${salt}:${hash}`;
const id = randomUUID();

const esc = (s) => s.replace(/'/g, "''");
const nameVal = name ? `'${esc(name)}'` : "NULL";

console.log(`
-- Paste into the Neon SQL console:
INSERT INTO "admin_users" ("id", "email", "passwordHash", "name", "createdAt")
VALUES ('${id}', '${esc(email)}', '${passwordHash}', ${nameVal}, CURRENT_TIMESTAMP);
`);
