db = db.getSiblingDB('FlashcardsDB');

if (!db.getCollectionNames().includes('users')) {
  db.createCollection('users');
}

if (!db.getCollectionNames().includes('decks')) {
  db.createCollection('decks');
}

if (!db.getCollectionNames().includes('cards')) {
  db.createCollection('cards');
}

let user = db.users.findOne({ login: "root" });
if (!user) {
  // This script runs in the Mongo shell, not through the User model, so the
  // password can't be hashed here automatically. The value below is the
  // bcrypt hash of "ucf123!", made with:
  //   node -e "console.log(require('bcryptjs').hashSync('ucf123!', 10))"
  const result = db.users.insertOne({
    firstName: "Test",
    lastName: "User",
    login: "root",
    password: "$2b$10$dcjsaXblFddld53QThfQAu9WLK7.I4iek3NSg8ruIzpS28Cqd0AIK",
    email: "root@application.com",
    role: "user"
  });
  user = { _id: result.insertedId };
}

const userIdStr = user._id.toString();

const elementsDeck = [
  { deckName: "Periodic Table of Elements", numCards: 8, difficulty: 2.0, helpfulness: 5.0, userId: userIdStr }
];

elementsDeck.forEach(deck => {
  if (!db.decks.findOne({ userId: userIdStr, deckName: deck.deckName })) {
    const result = db.decks.insertOne(deck);
  }
  curDeck = { _id: result.insertedId };
});

const deckIdStr = curDeck._id.toString();

const elementsCards = [
  { front: "Hydrogen", back: "H", index: 0, deckId: deckIdStr },
  { front: "Helium", back: "He", index: 1, deckId: deckIdStr },
  { front: "Lithium", back: "Li", index: 2, deckId: deckIdStr },
  { front: "Beryllium", back: "Be", index: 3, deckId: deckIdStr },
  { front: "Boron", back: "B", index: 4, deckId: deckIdStr },
  { front: "Carbon", back: "C", index: 5, deckId: deckIdStr },
  { front: "Nitrogen", back: "N", index: 6, deckId: deckIdStr },
  { front: "Oxygen", back: "O", index: 7, deckId: deckIdStr }
];

elementsCards.forEach(card => {
  if (!db.cards.findOne({ deckId: deckIdStr, index: card.index })) {
    db.cards.insertOne(card);
  }
});
