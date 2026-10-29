"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cardSchema = new mongoose_1.default.Schema({
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
}, {
    collection: 'cards',
    versionKey: false
});
const Card = mongoose_1.default.model('Card', cardSchema);
exports.default = Card;
//# sourceMappingURL=Card.js.map