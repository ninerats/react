// UserCard.jsx
function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0].toUpperCase())
    .join("");
}

function Address({ address }) {
  if (!address) return null;
  const { street, suite, city, zipcode } = address;
  return (
    <div className="small text-body-secondary">
      {street}{suite ? `, ${suite}` : ""}<br />
      {city}, {zipcode}
    </div>
  );
}

function Company({ company }) {
  if (!company) return null;
  return (
    <div className="small mt-1">
      <div className="fw-semibold">{company.name}</div>
      <div className="text-body-secondary">{company.catchPhrase}</div>
    </div>
  );
}

export default function UserCard({ user }) {
  const { name, username, email, phone, website, address, company } = user;

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body d-flex gap-3">
        {/* Avatar / initials */}
        <div
          className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
          style={{ width: 56, height: 56, background: "#f1f3f5", fontWeight: 700 }}
          aria-hidden="true"
        >
          {initials(name)}
        </div>

        <div className="w-100">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <div className="fw-bold">{name}</div>
              <div className="text-body-secondary">@{username}</div>
            </div>
            <span className="badge text-bg-light">ID {user.id}</span>
          </div>

          <Address address={address} />
          <Company company={company} />

          <div className="mt-2 d-flex flex-wrap gap-2">
            {email && (
              <a className="btn btn-sm btn-outline-primary" href={`mailto:${email}`}>
                Email
              </a>
            )}
            {phone && (
              <a className="btn btn-sm btn-outline-secondary" href={`tel:${phone}`}>
                Call
              </a>
            )}
            {website && (
              <a
                className="btn btn-sm btn-outline-dark"
                href={`http://${website.replace(/^https?:\/\//, "")}`}
                target="_blank"
                rel="noreferrer"
              >
                Website
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
