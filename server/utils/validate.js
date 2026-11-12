const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d\s-]{7,20}$/;

const isEmail = (v) => typeof v === "string" && v.length <= 254 && EMAIL_RE.test(v.trim());
const isPhone = (v) => typeof v === "string" && PHONE_RE.test(v.trim());
const isStr = (v, max = 200) => typeof v === "string" && v.length <= max;

/** Array of non-empty strings, trimmed and de-duplicated. Returns null if invalid. */
function cleanList(v, { maxItems = 50, maxLen = 200 } = {}) {
  if (!Array.isArray(v) || v.length > maxItems) return null;
  if (!v.every((x) => typeof x === "string" && x.length <= maxLen)) return null;
  const seen = new Set();
  return v
    .map((x) => x.trim())
    .filter((x) => x && !seen.has(x.toLowerCase()) && seen.add(x.toLowerCase()));
}

const ageFromDob = (dob) => {
  const t = new Date(dob).getTime();
  return Number.isNaN(t) ? null : Math.floor((Date.now() - t) / 31557600000);
};

module.exports = { isEmail, isPhone, isStr, cleanList, ageFromDob };
