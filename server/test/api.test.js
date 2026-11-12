const test = require("node:test");
const assert = require("node:assert");
process.env.GEMINI_API_KEY = "";
const app = require("../index");

let server, base;
test.before(async () => {
  await new Promise((r) => { server = app.listen(0, r); });
  base = `http://127.0.0.1:${server.address().port}`;
});
test.after(() => server.close());

const j = async (path, opts = {}) => {
  const res = await fetch(base + path, { headers: { "Content-Type": "application/json" }, ...opts });
  return { status: res.status, body: await res.json() };
};
const post = (path, data) => j(path, { method: "POST", body: JSON.stringify(data) });

test("health", async () => {
  const r = await j("/api/health");
  assert.equal(r.status, 200);
  assert.equal(r.body.status, "ok");
});

test("login ok / bad password / registration", async () => {
  let r = await post("/api/auth/login", { email: "john@example.com", password: "password123" });
  assert.equal(r.status, 200);
  assert.ok(!("password" in r.body.patient));
  r = await post("/api/auth/login", { email: "john@example.com", password: "nope" });
  assert.equal(r.status, 401);
  const email = `t${Date.now()}@example.com`;
  const body = { name: "T User", email, password: "secret1", phone: "+92 311 0000000" };
  r = await post("/api/auth/register", body);
  assert.equal(r.status, 201);
  r = await post("/api/auth/register", body);
  assert.equal(r.status, 409);
});

test("doctors list, filter, details", async () => {
  let r = await j("/api/doctors");
  assert.equal(r.body.doctors.length, 16);
  assert.ok(r.body.doctors[0].consultationFee > 0);
  assert.ok(!("availableSlots" in r.body.doctors[0]));
  r = await j("/api/doctors?specialty=cardiologist");
  assert.equal(r.body.doctors.length, 2);
  r = await j("/api/doctors/nope");
  assert.equal(r.status, 404);
});

test("book -> listed -> double booking rejected -> cancel restores slot", async () => {
  const doc = (await j("/api/doctors/prov_601")).body.doctor;
  const date = doc.availableDates[doc.availableDates.length - 1];
  const before = (await j(`/api/doctors/prov_601/availability?date=${date}`)).body.availableSlots;
  const slot = before[0];
  const req = { patientId: "pat_002", providerId: "prov_601", date, timeSlot: slot, reason: "Test visit" };
  let r = await post("/api/appointments", req);
  assert.equal(r.status, 201);
  const id = r.body.appointment.bookingId;
  r = await post("/api/appointments", req);
  assert.equal(r.status, 409);
  r = await j("/api/patient/pat_002/appointments");
  assert.ok(r.body.appointments.some((a) => a.bookingId === id));
  r = await j(`/api/appointments/${id}?patientId=pat_001`, { method: "DELETE" });
  assert.equal(r.status, 403);
  r = await j(`/api/appointments/${id}?patientId=pat_002`, { method: "DELETE" });
  assert.equal(r.status, 200);
  const after = (await j(`/api/doctors/prov_601/availability?date=${date}`)).body.availableSlots;
  assert.ok(after.includes(slot));
});

test("chat works without a Gemini key via clinical fallback", async () => {
  const r = await post("/api/chat", { sessionId: "s1", message: "Find a cardiologist" });
  assert.equal(r.status, 200);
  assert.ok(r.body.reply.length > 10);
});
