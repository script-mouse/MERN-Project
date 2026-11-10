
import { useState } from "react";

import DeckCard from "./DeckCard";

import "./DeckPanel.css";

function DeckPanel({
  selectedClass,
  decks = [],
  onSelectDeck,
}) {
  const [search, setSearch] = useState("");

  const filteredDecks = decks.filter((deck) =>
    (deck.deckName || "").toLowerCase().includes(search.toLowerCase())
  );

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
