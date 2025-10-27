// UsersGrid.jsx
import UserCard from "./UserCard";

export default function UsersGrid({ users }) {
  if (!users?.length) return <p>No users.</p>;

  return (
    <div className="container px-0">
      <div className="row g-3">
        {users.map((u) => (
          <div key={u.id} className="col-12 col-sm-6 col-lg-4">
            <UserCard user={u} />
          </div>
        ))}
      </div>
    </div>
  );
}
