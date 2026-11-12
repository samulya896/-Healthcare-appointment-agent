const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d\s-]{7,20}$/;

export const isEmail = (v) => EMAIL_RE.test((v || '').trim());
export const isPhone = (v) => PHONE_RE.test((v || '').trim());

export function validateLogin({ email, password }) {
  const errors = {};
  if (!email.trim()) errors.email = 'Email is required.';
  else if (!isEmail(email)) errors.email = 'Enter a valid email address.';
  if (!password) errors.password = 'Password is required.';
  return errors;
}

export function validateRegister({ name, email, phone, password, confirm, dob }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Full name is required.';
  if (!email.trim()) errors.email = 'Email is required.';
  else if (!isEmail(email)) errors.email = 'Enter a valid email address.';
  if (!phone.trim()) errors.phone = 'Phone number is required.';
  else if (!isPhone(phone)) errors.phone = 'Enter a valid phone number.';
  if (!password) errors.password = 'Password is required.';
  else if (password.length < 6) errors.password = 'Use at least 6 characters.';
  if (confirm !== password) errors.confirm = 'Passwords do not match.';
  if (dob && new Date(dob) > new Date()) errors.dob = 'Date of birth cannot be in the future.';
  return errors;
}

export function validatePersonal({ name, phone, dob, emergencyContact }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Name is required.';
  if (!phone.trim()) errors.phone = 'Phone is required.';
  else if (!isPhone(phone)) errors.phone = 'Enter a valid phone number.';
  if (dob && new Date(dob) > new Date()) errors.dob = 'Date of birth cannot be in the future.';
  if (emergencyContact.phone && !isPhone(emergencyContact.phone)) {
    errors.emergencyPhone = 'Enter a valid phone number.';
  }
  return errors;
}
