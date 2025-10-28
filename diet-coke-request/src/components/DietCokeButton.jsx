import "./DietCokeButton.css";

export default function DietCokeButton({ onClick }) {
  return (
    <button className="dc-button" onClick={onClick}>
      🥤 Diet Coke
    </button>
  );
}
