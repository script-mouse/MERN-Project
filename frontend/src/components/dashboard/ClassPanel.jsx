import { useState } from "react";

import ClassCard from "./ClassCard";
import AddClass from "./AddClass";
import JoinClass from "./JoinClass";

import "./ClassPanel.css";

function ClassPanel({
  classes = [],
  selectedClass,
  onSelectClass,
  onAddClass,
  onJoinClass,
}) {
  const [search, setSearch] = useState("");
  const [showAddClass, setShowAddClass] = useState(false);
  const [showJoinClass, setShowJoinClass] = useState(false);

  const filteredClasses = classes.filter((classItem) =>
    classItem.name.toLowerCase().includes(search.toLowerCase())
  );

  function toggleAddClass() {
    setShowAddClass(!showAddClass);
    setShowJoinClass(false);
  }

  function toggleJoinClass() {
    setShowJoinClass(!showJoinClass);
    setShowAddClass(false);
  }

  return (
    <section className="dashboard-panel class-panel">
      <div className="panel-heading">
        <div>
          <h2>Your Classes</h2>
          <p>Select a class to view its decks.</p>
        </div>

        <span className="panel-count">{classes.length}</span>
      </div>

      <input
        className="panel-search"
        type="search"
        placeholder="Search classes..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className="class-grid">
        {filteredClasses.map((classItem) => (
          <ClassCard
            key={classItem._id}
            classItem={classItem}
            selected={selectedClass?._id === classItem._id}
            onClick={onSelectClass}
          />
        ))}

        {filteredClasses.length === 0 && (
          <p className="panel-empty">No classes found.</p>
        )}
      </div>

      <div className="class-panel-actions">
        <button
          className="panel-primary-button"
          onClick={toggleAddClass}
        >
          + Add Class
        </button>

        <button
          className="panel-secondary-button"
          onClick={toggleJoinClass}
        >
          Join Class
        </button>
      </div>

      {showAddClass && (
        <AddClass
          onSubmit={onAddClass}
          onCancel={() => setShowAddClass(false)}
        />
      )}

      {showJoinClass && (
        <JoinClass
          onSubmit={onJoinClass}
          onCancel={() => setShowJoinClass(false)}
        />
      )}
    </section>
  );
}

export default ClassPanel;