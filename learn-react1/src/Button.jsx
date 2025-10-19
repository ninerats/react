import { useState } from "react";

export default function Button({ onGlobalClick }) {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    onGlobalClick?.();
  };
  return (
    <button className="btn btn-primary" onClick={handleClick}>
      Count is {count}
    </button>
  );
}
