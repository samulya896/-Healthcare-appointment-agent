/** Patient record without credentials. */
function toProfile(patient) {
  const { password: _password, ...profile } = patient;
  return profile;
}

module.exports = { toProfile };
