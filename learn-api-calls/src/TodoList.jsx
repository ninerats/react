// TodoList.jsx
import TodoItem from "./TodoItem";

export default function TodoList({ todos }) {
  if (!todos?.length) return <p>No todos found.</p>;

  return (
    <div className="list-group">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
