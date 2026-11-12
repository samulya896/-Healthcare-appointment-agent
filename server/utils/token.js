const crypto = require("crypto");
const { sessionSecret, sessionTtlMs } = require("../config");

const b64 = (s) => Buffer.from(s).toString("base64url");
const sign = (body) => crypto.createHmac("sha256", sessionSecret).update(body).digest("base64url");

/** Stateless signed session token: base64url(payload).signature */
function issueToken(patientId) {
  const body = b64(JSON.stringify({ sub: patientId, exp: Date.now() + sessionTtlMs }));
  return `${body}.${sign(body)}`;
}

/** Returns the patient id, or null if the token is invalid / expired. */
function verifyToken(token) {
  const [body, sig] = (token || "").split(".");
  if (!body || !sig) return null;
  const expected = Buffer.from(sign(body));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) return null;
  try {
    const { sub, exp } = JSON.parse(Buffer.from(body, "base64url").toString());
    return exp > Date.now() ? sub : null;
  } catch {
    return null;
  }
}

module.exports = { issueToken, verifyToken };
