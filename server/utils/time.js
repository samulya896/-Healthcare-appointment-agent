const TZ = "Asia/Karachi"; // clinic timezone (+05:00)

const todayKarachi = () => new Date().toLocaleDateString("en-CA", { timeZone: TZ });

const nowMinutesKarachi = () => {
  const [h, m] = new Date()
    .toLocaleTimeString("en-GB", { timeZone: TZ, hour12: false, hour: "2-digit", minute: "2-digit" })
    .split(":")
    .map(Number);
  return h * 60 + m;
};

/** Slots still bookable for a date (hides dates and times that already passed). */
function bookableSlots(doctor, date) {
  const slots = doctor.availableSlots[date] || [];
  const today = todayKarachi();
  if (date < today) return [];
  if (date > today) return slots;
  const now = nowMinutesKarachi();
  return slots.filter((t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m > now;
  });
}

module.exports = { TZ, todayKarachi, bookableSlots };
