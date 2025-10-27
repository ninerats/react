// PostItem.jsx
import { useState } from "react";

function excerpt(text, n = 140) {
  if (!text) return "";
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > n ? t.slice(0, n) + "…" : t;
}

export default function PostItem({ post }) {
  const [open, setOpen] = useState(false);
  const { id, title, body, userId } = post;

  return (
    <div className="list-group-item list-group-item-action py-3">
      <div className="d-flex w-100 justify-content-between">
        <h5 className="mb-1">{title}</h5>
        <span className="badge text-bg-secondary align-self-start">User {userId}</span>
      </div>

      <p className="mb-2" style={{ whiteSpace: open ? "pre-line" : "normal" }}>
        {open ? body : excerpt(body)}
      </p>

      <div className="d-flex gap-2">
        <button className="btn btn-sm btn-outline-primary" onClick={() => setOpen((v) => !v)}>
          {open ? "Show less" : "Read more"}
        </button>
        <span className="text-body-secondary small ms-auto">Post ID: {id}</span>
      </div>
    </div>
  );
}
