import Avatar from '../common/Avatar.jsx';
import Button from '../common/Button.jsx';
import Icon from '../common/Icon.jsx';
import { titleCase, formatFee, formatDate } from '../../utils/format.js';

export default function DoctorCard({ doctor, onBook }) {
  const next = doctor.nextAvailableDate;
  return (
    <article className="card doctor-card">
      <div className="doctor-head">
        <Avatar name={doctor.name} size="lg" />
        <div className="doctor-id">
          <h3>{doctor.name}</h3>
          <span className="badge badge-primary">{titleCase(doctor.specialty)}</span>
        </div>
      </div>
      <dl className="doctor-facts">
        <div>
          <dt><Icon name="award" size={14} /> Qualifications</dt>
          <dd>{doctor.qualifications || '—'}</dd>
        </div>
        <div>
          <dt><Icon name="activity" size={14} /> Experience</dt>
          <dd>{doctor.experienceYears ? `${doctor.experienceYears} years` : '—'}</dd>
        </div>
        <div>
          <dt><Icon name="file" size={14} /> Consultation fee</dt>
          <dd>{formatFee(doctor.consultationFee)}</dd>
        </div>
      </dl>
      <div className="doctor-foot">
        <span className={`doctor-avail ${next ? 'is-available' : ''}`}>
          <Icon name="clock" size={14} />
          {next ? `Next available ${formatDate(next)}` : 'No availability'}
        </span>
        <Button size="sm" icon="calendar" disabled={!next} onClick={() => onBook(doctor)}>
          Book appointment
        </Button>
      </div>
    </article>
  );
}
