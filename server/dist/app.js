"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_js_1 = __importDefault(require("./routes/auth.js"));
const users_js_1 = __importDefault(require("./routes/users.js"));
require('dotenv').config({ path: path_1.default.resolve(__dirname, '../.env') });
const PORT = process.env.PORT || 5050;
const app = (0, express_1.default)();
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/FlashcardsDB';
mongoose_1.default
    .connect(url)
    .then(() => console.log('MongoDB connected successfully via Mongoose'))
    .catch((err) => console.error('MongoDB connection error:', err));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/auth', auth_js_1.default);
app.use('/users', users_js_1.default);
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
//# sourceMappingURL=app.js.map