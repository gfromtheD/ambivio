import { authRedirectOrigin, passwordValidationError, safeAuthNext } from "../../../lib/auth-flow.ts";
function assert(value: unknown) { if (!value) throw new Error("Assertion failed"); }
Deno.test("callback only permits the three internal destinations", () => {
  for (const candidate of [null, "https://attacker.test", "//attacker.test", "/\\attacker.test", "%2F%2Fattacker.test", "/settings?next=https://attacker.test", "/reset-password/../../evil"]) assert(safeAuthNext(candidate) === "/properties");
  assert(safeAuthNext("/reset-password") === "/reset-password");
  assert(safeAuthNext("/settings") === "/settings");
});
Deno.test("production redirects use configured origin, not caller-controlled headers", () => {
  assert(authRedirectOrigin("https://ambivio.example", "https://attacker.test", false) === "https://ambivio.example");
  assert(authRedirectOrigin("https://ambivio.example", "http://127.0.0.1:3002", true) === "http://127.0.0.1:3002");
});
Deno.test("invalid production origins fail closed", () => {
  for (const candidate of [undefined, "javascript:alert(1)", "https://user:secret@ambivio.example", "https://ambivio.example/path", "http://ambivio.example"]) {
    let failed=false; try { authRedirectOrigin(candidate,"https://attacker.test",false); } catch { failed=true; }
    assert(failed);
  }
});
Deno.test("password validation handles length, confirmation and UTF8 byte limits", () => {
  assert(passwordValidationError("short") !== null);
  assert(passwordValidationError("Valid-password-2026!", "different") !== null);
  assert(passwordValidationError("é".repeat(37)) !== null);
  assert(passwordValidationError("Valid-password-2026!", "Valid-password-2026!") === null);
});
