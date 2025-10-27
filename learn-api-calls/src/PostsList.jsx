// PostsList.jsx
import PostItem from "./PostItem";

export default function PostsList({ posts }) {
  if (!posts?.length) return <p>No posts.</p>;

  return (
    <div className="list-group">
      {posts.map((p) => (
        <PostItem key={p.id} post={p} />
      ))}
    </div>
  );
}
