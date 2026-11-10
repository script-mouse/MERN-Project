
import { useState } from "react";

function JoinClass({ onSubmit, onCancel }) {
  const [classCode, setClassCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!classCode.trim()) return;

    setLoading(true);
    setError("");

    try {
      await onSubmit(classCode.trim().toUpperCase());
      setClassCode("");
    } catch (err) {
      setError(err.message || "Unable to join class.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="class-form" onSubmit={handleSubmit}>
      <h3>Join a Class</h3>

      <input
        type="text"
        placeholder="Enter class code"
        value={classCode}
        onChange={(event) => setClassCode(event.target.value)}
        required
        disabled={loading}
      />

      {error && <p className="class-form-error">{error}</p>}

      <div className="class-form-buttons">
        <button type="submit" disabled={loading}>
          {loading ? "Joining..." : "Join Class"}
        </button>

        <button type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default JoinClass;
