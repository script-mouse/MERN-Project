
import { useState } from "react";

import DeckCard from "./DeckCard";

import "./DeckPanel.css";

function DeckPanel({
  selectedClass,
  decks = [],
  onSelectDeck,
  onAddDeck,
}) {
  const [search, setSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deckName, setDeckName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const filteredDecks = decks.filter((deck) =>
    (deck.deckName || "").toLowerCase().includes(search.toLowerCase())
  );

  async function handleSubmit(event) {
    event.preventDefault();

    if (!deckName.trim()) return;

    setCreating(true);
    setError("");

    try {
      await onAddDeck({
        deckName: deckName.trim(),
        description: description.trim(),
      });

      setDeckName("");
      setDescription("");
      setShowCreateForm(false);
    } catch (err) {
      setError(err.message || "Unable to create deck.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <section className="dashboard-panel deck-panel">
      <div className="panel-heading">
        <div>
          <h2>
            {selectedClass
              ? `${selectedClass.name} Decks`
              : "Class Decks"}
          </h2>

          <p>
            {selectedClass
              ? "Choose a deck to start studying."
              : "Select a class to view its decks."}
          </p>
        </div>

        <span className="panel-count">
          {selectedClass ? decks.length : 0}
        </span>
      </div>

      <input
        className="panel-search"
        type="search"
        placeholder="Search decks..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        disabled={!selectedClass}
      />

      {selectedClass && (
        <button
          type="button"
          className="create-deck-button"
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setError("");
          }}
        >
          + Create Deck
        </button>
      )}

      {showCreateForm && (
        <form className="create-deck-form" onSubmit={handleSubmit}>
          <h3>Create a Deck</h3>

          <input
            type="text"
            placeholder="Deck name"
            value={deckName}
            onChange={(event) => setDeckName(event.target.value)}
            required
            disabled={creating}
          />

          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            disabled={creating}
          />

          {error && (
            <p className="create-deck-error">{error}</p>
          )}

          <div className="create-deck-actions">
            <button type="submit" disabled={creating}>
              {creating ? "Creating..." : "Create"}
            </button>

            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              disabled={creating}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {!selectedClass ? (
        <p className="deck-panel-empty">
          Select a class on the left to see its decks.
        </p>
      ) : (
        <div className="deck-list">
          {filteredDecks.map((deck) => (
            <DeckCard
              key={deck._id}
              deck={deck}
              onClick={onSelectDeck}
            />
          ))}

          {filteredDecks.length === 0 && (
            <p className="deck-panel-empty">
              No decks found in this class.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

export default DeckPanel;
