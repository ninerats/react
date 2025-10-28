import "./ToggleSwitch.css";

export default function ToggleSwitch({ id, label, checked, onChange }) {
  return (
    <label htmlFor={id} className="toggle">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="toggle-label">{label}</span>
      <span className="slider" aria-hidden="true" />

    </label>
  );
}
