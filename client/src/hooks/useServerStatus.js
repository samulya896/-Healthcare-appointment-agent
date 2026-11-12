import { useCallback, useEffect, useState } from 'react';
import { checkHealth } from '../services/api.js';

/** Pings /api/health. status: 'checking' | 'online' | 'offline' */
export default function useServerStatus() {
  const [status, setStatus] = useState('checking');
  const [info, setInfo] = useState(null);

  const check = useCallback(() => {
    setStatus('checking');
    checkHealth()
      .then((d) => {
        setInfo(d);
        setStatus('online');
      })
      .catch(() => setStatus('offline'));
  }, []);

  useEffect(check, [check]);
  return { status, info, recheck: check };
}
