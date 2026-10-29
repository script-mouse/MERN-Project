"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const deckSchema = new mongoose_1.default.Schema({
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
}, {
    collection: 'decks',
    versionKey: false
});
const Deck = mongoose_1.default.model('Deck', deckSchema);
exports.default = Deck;
//# sourceMappingURL=Deck.js.map