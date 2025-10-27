export default function EndpointSelect({ options, value, onChange }) {
  return (
    <label style={{ display: "block", margin: "1rem 1" }}>
      <span style={{ marginRight: 8 , color : "white"}}>Endpoint:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: "0.3rem 0.5rem" }}
      >
        {options.map((o) => (
          <option key={o.key} value={o.key}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
