const test = require("node:test");
const assert = require("node:assert");
process.env.GEMINI_API_KEY = "";
const app = require("../app");

let server, base;
test.before(async () => {
  await new Promise((r) => { server = app.listen(0, r); });
  base = `http://127.0.0.1:${server.address().port}`;
});
test.after(() => server.close());

async function call(path, { method = "GET", body, token } = {}) {
  const res = await fetch(base + path, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, body: await res.json(), headers: res.headers };
}

async function signIn(email) {
  const r = await call("/api/auth/login", { method: "POST", body: { email, password: "password123" } });
  assert.equal(r.status, 200);
  return { token: r.body.token, patient: r.body.patient };
}

test("health + security headers", async () => {
  const r = await call("/api/health");
  assert.equal(r.status, 200);
  assert.equal(r.body.status, "ok");
  assert.equal(r.headers.get("x-content-type-options"), "nosniff");
  assert.equal(r.headers.get("x-powered-by"), null);
});

test("unknown route returns JSON 404", async () => {
  const r = await call("/api/nope");
  assert.equal(r.status, 404);
  assert.ok(r.body.error);
});

test("login: ok returns token and no password, bad password rejected", async () => {
  const { token, patient } = await signIn("john@example.com");
  assert.ok(token);
  assert.ok(!("password" in patient));
  const r = await call("/api/auth/login", { method: "POST", body: { email: "john@example.com", password: "nope" } });
  assert.equal(r.status, 401);
});

test("registration validates input and rejects duplicates", async () => {
  const email = `t${Date.now()}@example.com`;
  const body = { name: "T User", email, password: "secret1", phone: "+92 311 0000000" };
  let r = await call("/api/auth/register", { method: "POST", body: { ...body, password: "123" } });
  assert.equal(r.status, 400);
  r = await call("/api/auth/register", { method: "POST", body: { ...body, email: "not-an-email" } });
  assert.equal(r.status, 400);
  r = await call("/api/auth/register", { method: "POST", body });
  assert.equal(r.status, 201);
  assert.ok(r.body.token);
  r = await call("/api/auth/register", { method: "POST", body });
  assert.equal(r.status, 409);
  r = await call("/api/auth/login", { method: "POST", body: { email, password: "secret1" } });
  assert.equal(r.status, 200);
});

test("patient routes require auth and enforce ownership", async () => {
  const john = await signIn("john@example.com");
  let r = await call("/api/patient/pat_001");
  assert.equal(r.status, 401);
  r = await call("/api/patient/pat_001", { token: "garbage.token" });
  assert.equal(r.status, 401);
  r = await call("/api/patient/pat_002", { token: john.token });
  assert.equal(r.status, 403);
  r = await call("/api/patient/pat_001", { token: john.token });
  assert.equal(r.status, 200);
});

test("profile update validates and persists", async () => {
  const ayesha = await signIn("ayesha@example.com");
  let r = await call("/api/patient/pat_002", { method: "PUT", token: ayesha.token, body: { allergies: "nope" } });
  assert.equal(r.status, 400);
  r = await call("/api/patient/pat_002", { method: "PUT", token: ayesha.token, body: { phone: "abc" } });
  assert.equal(r.status, 400);
  const symptoms = ["Mild headache", "mild headache", "  Cough  "];
  r = await call("/api/patient/pat_002", { method: "PUT", token: ayesha.token, body: { commonSymptoms: symptoms } });
  assert.equal(r.status, 200);
  assert.deepEqual(r.body.patient.commonSymptoms, ["Mild headache", "Cough"]);
});

test("doctors list, filter, details", async () => {
  let r = await call("/api/doctors");
  assert.equal(r.body.doctors.length, 16);
  assert.ok(r.body.doctors[0].consultationFee > 0);
  assert.ok(!("availableSlots" in r.body.doctors[0]));
  r = await call("/api/doctors?specialty=cardiologist");
  assert.equal(r.body.doctors.length, 2);
  r = await call("/api/doctors/nope");
  assert.equal(r.status, 404);
});

test("book -> listed -> double booking rejected -> cancel restores slot", async () => {
  const ayesha = await signIn("ayesha@example.com");
  const john = await signIn("john@example.com");
  const doc = (await call("/api/doctors/prov_601")).body.doctor;
  const date = doc.availableDates[doc.availableDates.length - 1];
  const slot = (await call(`/api/doctors/prov_601/availability?date=${date}`)).body.availableSlots[0];
  const req = { providerId: "prov_601", date, timeSlot: slot, reason: "Test visit" };

  let r = await call("/api/appointments", { method: "POST", body: req });
  assert.equal(r.status, 401);
  r = await call("/api/appointments", { method: "POST", token: ayesha.token, body: { ...req, patientId: "pat_001" } });
  assert.equal(r.status, 403);
  r = await call("/api/appointments", { method: "POST", token: ayesha.token, body: req });
  assert.equal(r.status, 201);
  const id = r.body.appointment.bookingId;
  r = await call("/api/appointments", { method: "POST", token: ayesha.token, body: req });
  assert.equal(r.status, 409);
  r = await call("/api/patient/pat_002/appointments", { token: ayesha.token });
  assert.ok(r.body.appointments.some((a) => a.bookingId === id));

  r = await call(`/api/appointments/${id}?patientId=pat_002`, { method: "DELETE", token: john.token });
  assert.equal(r.status, 403);
  r = await call(`/api/appointments/${id}?patientId=pat_002`, { method: "DELETE", token: ayesha.token });
  assert.equal(r.status, 200);
  const after = (await call(`/api/doctors/prov_601/availability?date=${date}`)).body.availableSlots;
  assert.ok(after.includes(slot));
});

test("chat works without a Gemini key via clinical fallback and validates input", async () => {
  let r = await call("/api/chat", { method: "POST", body: { sessionId: "s1", message: "Find a cardiologist" } });
  assert.equal(r.status, 200);
  assert.ok(r.body.reply.length > 10);
  r = await call("/api/chat", { method: "POST", body: { sessionId: "s1", message: "x".repeat(1001) } });
  assert.equal(r.status, 400);
  r = await call("/api/chat", { method: "POST", body: {} });
  assert.equal(r.status, 400);
});
