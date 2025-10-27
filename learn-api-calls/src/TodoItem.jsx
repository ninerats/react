// TodoItem.jsx
import { useState } from "react";

export default function TodoItem({ todo }) {
  const { id, title, completed } = todo;
 const [checked, setChecked] = useState(completed);
  return (
    <label
      className={`list-group-item d-flex justify-content-between align-items-center ${
        completed ? "list-group-item-success" : ""
      }`}
      style={{ cursor: "pointer" }}
    >
      <div className="form-check">
        <input
          className="form-check-input me-2"
          type="checkbox"
          checked={checked}
          onChange={() => setChecked(!checked)}
        />
        <span className={completed ? "text-decoration-line-through" : ""}>
          {title}
        </span>
      </div>

      <span className="badge text-bg-light">ID {id}</span>
    </label>
  );
}
