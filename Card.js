const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema(
  {
    front: {
      type: String,
      default: '',
      trim: true
    },
    back: {
      type: String,
      default: '',
      trim: true
    },
    index: {
      type: Number,
      default: 0
    },
    deckId: {
      type: String,
      required: [true, 'deckId is required'],
      trim: true
    }
  },
  {
    collection: 'cards',
    versionKey: false
  }
);

module.exports = mongoose.model('Card', cardSchema);
