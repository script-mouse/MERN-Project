import "./DeckCard.css";

function DeckCard({ deck, onClick }) {
  return (
    <button
      className="deck-card"
      onClick={() => onClick(deck)}
    >
      <div className="deck-card-icon">
        <span>▤</span>
      </div>

      <div className="deck-card-content">
        <span className="deck-card-name">
          {deck.deckName || "Untitled Deck"}
        </span>

        <span className="deck-card-description">
          {deck.numCards || 0} cards
        </span>
      </div>

      <span className="deck-card-arrow">›</span>
    </button>
  );
}

export default DeckCard;