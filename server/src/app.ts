import path from 'path';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import auth from './routes/auth.js';
import users from './routes/users.js';

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const PORT = process.env.PORT || 5050;
const app = express();

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/FlashcardsDB';
mongoose
  .connect(url)
  .then(() => console.log('MongoDB connected successfully via Mongoose'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());
app.use('/auth', auth);
app.use('/users', users);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
