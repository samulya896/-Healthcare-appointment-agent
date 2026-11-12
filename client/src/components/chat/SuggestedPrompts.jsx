const PROMPTS = [
  'Find a cardiologist',
  'Help me understand my symptoms',
  'Check available appointments',
  'Show my upcoming appointments',
];

export default function SuggestedPrompts({ onPick, disabled }) {
  return (
    <div className="prompt-row" aria-label="Suggested prompts">
      {PROMPTS.map((p) => (
        <button key={p} className="chip" disabled={disabled} onClick={() => onPick(p)}>{p}</button>
      ))}
    </div>
  );
}
