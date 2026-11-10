"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
// Generate a random class code.
function generateClassCode() {
    return crypto_1.default.randomBytes(4).toString('hex').toUpperCase();
}
const classSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Class name is required'],
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    classCode: {
        type: String,
        unique: true,
        sparse: true,
        default: generateClassCode
    },
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    instructors: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User'
        }],
    members: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User'
        }],
    decks: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Deck'
        }]
}, {
    collection: 'classes',
    versionKey: false
});
const Class = mongoose_1.default.model('Class', classSchema);
exports.default = Class;
//# sourceMappingURL=Class.js.map