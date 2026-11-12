import { formatDob } from '../../utils/format.js';
import { val } from './personalUtils.js';

function Row({ label, children }) {
  return (
    <div className="detail-row">
      <dt>{label}</dt>
      <dd>{children || <span className="faint">Not provided</span>}</dd>
    </div>
  );
}

export default function PersonalView({ user }) {
  const ec = user.emergencyContact;
  const dob = formatDob(user.dob);
  return (
    <dl className="detail-grid">
      <Row label="Full name">{user.name}</Row>
      <Row label="Email">{user.email}</Row>
      <Row label="Phone">{user.phone}</Row>
      <Row label="Date of birth">{dob !== '—' && `${dob}${user.age != null ? ` (${user.age} yrs)` : ''}`}</Row>
      <Row label="Gender">{val(user.gender)}</Row>
      <Row label="Blood group">{val(user.bloodGroup)}</Row>
      <Row label="Address">{val(user.address)}</Row>
      <Row label="Emergency contact">
        {val(ec?.name) && `${ec.name}${ec.relation ? ` (${ec.relation})` : ''}${ec.phone ? ` · ${ec.phone}` : ''}`}
      </Row>
    </dl>
  );
}
