import "./ClassCard.css";

function ClassCard({ classItem, selected, onClick, onManage }) {
  return (
    <div className={`class-card ${selected ? "selected" : ""}`}>
      <button
        className="class-card-content"
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

      {classItem.isOwner && (
        <button
          type="button"
          className="class-card-owner-icon"
          title="Manage class"
          aria-label={`Manage ${classItem.name}`}
          onClick={(event) => {
            event.stopPropagation();
            onManage(classItem);
          }}
        >
          ⚙
        </button>
      )}
    </div>
  );
}

export default ClassCard;
