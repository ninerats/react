// ResultLimitSelector.jsx

export default function ResultLimitSelector({ value, onChange }) {
  const presetOptions = [10, 25, 50, 100];

  return (
    <label style={{ display: "block", margin: "1rem 1" }}>
      <span style={{ marginRight: 8, color: "white" }}>Show:</span>
      <select
        style={{ padding: "0.3rem 0.5rem" }}
        value={value}
          onChange={(e) => onChange(e.target.value)}
      >
        {presetOptions.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
    
      </select>
    </label>
  );
}
