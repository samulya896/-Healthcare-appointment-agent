import { Link } from 'react-router-dom';
import Icon from '../common/Icon.jsx';
import { AppointmentMini } from '../appointments/AppointmentCard.jsx';
import { LoadingBlock } from '../common/States.jsx';

export default function UpcomingList({ appointments, loading }) {
  return (
    <section className="card">
      <div className="card-head">
        <h2><Icon name="clock" size={18} /> Upcoming</h2>
        <Link to="/appointments" className="link-sm">See all</Link>
      </div>
      <div className="card-body">
        {loading ? (
          <LoadingBlock lines={3} />
        ) : appointments.length === 0 ? (
          <p className="muted">No upcoming appointments.</p>
        ) : (
          <ul>{appointments.slice(0, 4).map((a) => <AppointmentMini key={a.bookingId} appointment={a} />)}</ul>
        )}
      </div>
    </section>
  );
}
