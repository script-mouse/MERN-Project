import mongoose from 'mongoose';
import crypto from 'crypto';

// Generate a random class code.
function generateClassCode() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

const classSchema = new mongoose.Schema(
  {
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    instructors: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    decks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Deck'
    }]
  },
  {
    collection: 'classes',
    versionKey: false
  }
);

const Class = mongoose.model('Class', classSchema);
export default Class;