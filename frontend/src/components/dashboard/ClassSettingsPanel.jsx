
import { useEffect, useState } from "react";
import "./ClassSettingsPanel.css";

const API_BASE = import.meta.env.VITE_API_URL || "";

function ClassSettingsPanel({
  classItem,
  user,
  onBack,
  onClassUpdated
}) {
  const [classData, setClassData] = useState(classItem);
  const [name, setName] = useState(classItem.name || "");
  const [description, setDescription] = useState(
    classItem.description || ""
  );
  const [classCode, setClassCode] = useState(classItem.classCode || "");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removingMember, setRemovingMember] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadClass() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE}/classes/${classItem._id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load class");
        }

        setClassData(data.class);
        setName(data.class.name || "");
        setDescription(data.class.description || "");
        setClassCode(data.class.classCode || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadClass();
  }, [classItem._id]);

  async function handleSave(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_BASE}/classes/${classItem._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            description,
            classCode,
            ownerId: user._id
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to update class");
      }

      setClassData(data.class);
      setName(data.class.name || "");
      setDescription(data.class.description || "");
      setClassCode(data.class.classCode || "");
      setMessage("Class updated successfully.");

      onClassUpdated(data.class);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveMember(member) {
    const memberName =
      `${member.firstName || ""} ${member.lastName || ""}`.trim() ||
      member.login;

    if (!window.confirm(`Remove ${memberName} from this class?`)) {
      return;
    }

    try {
      setRemovingMember(member._id);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_BASE}/classes/${classItem._id}/members/${member._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ownerId: user._id
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to remove member");
      }

      setClassData(data.class);
      setMessage("Member removed successfully.");

      onClassUpdated(data.class);
    } catch (err) {
      setError(err.message);
    } finally {
      setRemovingMember("");
    }
  }

  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText(classCode);
      setMessage("Class code copied.");
      setError("");
    } catch {
      setError("Unable to copy class code.");
    }
  }

  if (loading) {
    return (
      <section className="dashboard-panel class-settings-panel">
        <p>Loading class settings...</p>
      </section>
    );
  }

  const members = classData.members || [];

  return (
    <section className="dashboard-panel class-settings-panel">
      <div className="panel-heading">
        <div>
          <h2>Class Settings</h2>
          <p>Manage your class information and members.</p>
        </div>
      </div>

      {error && <p className="class-settings-error">{error}</p>}
      {message && <p className="class-settings-message">{message}</p>}

      <form onSubmit={handleSave}>
        <div className="class-settings-section">
          <h3>Class Information</h3>

          <label htmlFor="class-name">Class Name</label>
          <input
            id="class-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <label htmlFor="class-description">Description</label>
          <textarea
            id="class-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Enter a class description..."
            rows={4}
          />

          <label htmlFor="class-code">Class Code</label>
          <div className="class-code-input">
            <input
              id="class-code"
              type="text"
              value={classCode}
              onChange={(event) => setClassCode(event.target.value)}
              required
            />

            <button
              type="button"
              className="panel-secondary-button"
              onClick={handleCopyCode}
            >
              Copy
            </button>
          </div>

          <button
            type="submit"
            className="panel-primary-button"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      <div className="class-settings-section">
        <div className="class-settings-members-heading">
          <h3>Members</h3>
          <span>{members.length} members</span>
        </div>

        {members.length === 0 ? (
          <p className="class-settings-empty">No members found.</p>
        ) : (
          <div className="class-settings-members">
            {members.map((member) => {
              const memberName =
                `${member.firstName || ""} ${member.lastName || ""}`.trim() ||
                member.login;

              const isOwner =
                String(member._id) === String(classData.owner);

              return (
                <div className="class-settings-member" key={member._id}>
                  <div>
                    <strong>{memberName}</strong>
                    <span>{member.login}</span>
                  </div>

                  {isOwner ? (
                    <span className="class-settings-owner">Owner</span>
                  ) : (
                    <button
                      type="button"
                      className="class-settings-remove"
                      disabled={removingMember === member._id}
                      onClick={() => handleRemoveMember(member)}
                    >
                      {removingMember === member._id
                        ? "Removing..."
                        : "Remove"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button
        type="button"
        className="panel-secondary-button"
        onClick={onBack}
      >
        Back to Decks
      </button>
    </section>
  );
}

export default ClassSettingsPanel;
