const mongoose = require('mongoose');

const deckSchema = new mongoose.Schema(
  {
    deckName: {
      type: String,
      default: '',
      trim: true
    },
    numCards: {
      type: Number,
      default: 0
    },
    difficulty: {
      type: Number,
      default: 0
    },
    helpfulness: {
      type: Number,
      default: 0
    },
    userId: {
      type: String,
      required: [true, 'userId is required'],
      trim: true
    }
  },
  {
    collection: 'decks',
    versionKey: false
  }
);

module.exports = mongoose.model('Deck', deckSchema);
