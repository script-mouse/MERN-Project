import { useState } from "react";

function AddClass({ onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim(),
    });
  }

  return (
    <form className="class-form" onSubmit={handleSubmit}>
      <h3>Create a Class</h3>

      <input
        type="text"
        placeholder="Class name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <div className="class-form-buttons">
        <button type="submit">Create Class</button>

        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default AddClass;