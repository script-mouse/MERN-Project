import "./ClassCard.css";

function ClassCard({ classItem, selected, onClick }) {
  return (
    <button
      className={`class-card ${selected ? "selected" : ""}`}
      onClick={() => onClick(classItem)}
    >
      <span className="class-card-name">
        {classItem.name}
      </span>

      {classItem.description && (
        <span className="class-card-description">
          {classItem.description}
        </span>
      )}
    </button>
  );
}

export default ClassCard;