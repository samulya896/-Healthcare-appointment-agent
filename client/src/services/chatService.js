import { request } from './http.js';

let sessionId = crypto.randomUUID();

export const resetChatSession = () => {
  sessionId = crypto.randomUUID();
};

export async function sendChatMessage(message, patientContext) {
  const data = await request('/api/chat', {
    method: 'POST',
    body: { sessionId, message, patientContext },
    timeout: 90000,
    auth: false,
  });
  return data?.response || data?.reply || 'No response received.';
}
