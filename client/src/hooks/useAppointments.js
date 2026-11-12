import { useMemo } from 'react';
import useAsync from './useAsync.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getPatientAppointments, getDoctors } from '../services/api.js';
import { isUpcoming, sortByTime } from '../utils/format.js';

/** Patient appointments from the backend, enriched with doctor details, split into upcoming / past. */
export default function useAppointments() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useAsync(async () => {
    const [appointments, doctors] = await Promise.all([
      getPatientAppointments(user.id),
      getDoctors().catch(() => []),
    ]);
    return { appointments, doctors };
  }, [user.id]);

  const { upcoming, past } = useMemo(() => {
    if (!data) return { upcoming: [], past: [] };
    const enriched = data.appointments.map((a) => {
      const doctor = data.doctors.find((d) => d.id === a.providerId);
      return { ...a, specialty: a.specialty || doctor?.specialty, doctor };
    });
    const sorted = sortByTime(enriched);
    return {
      upcoming: sorted.filter(isUpcoming),
      past: sorted.filter((a) => !isUpcoming(a)).reverse(),
    };
  }, [data]);

  return { upcoming, past, loading, error, reload };
}
