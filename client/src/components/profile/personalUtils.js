export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

/** Backend placeholder strings ("Not specified", etc.) are shown as empty in forms. */
export const val = (v) => (v && v !== 'Not specified' && v !== 'Not provided' && v !== 'Unknown' ? v : '');

export const toDraft = (u) => ({
  name: u.name || '',
  phone: u.phone || '',
  dob: /^\d{4}-\d{2}-\d{2}$/.test(u.dob || '') ? u.dob : '',
  gender: val(u.gender),
  bloodGroup: val(u.bloodGroup),
  address: val(u.address),
  emergencyContact: {
    name: val(u.emergencyContact?.name),
    relation: val(u.emergencyContact?.relation),
    phone: val(u.emergencyContact?.phone),
  },
});
