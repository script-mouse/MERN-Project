"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_js_1 = __importDefault(require("../models/User.js"));
const express_1 = require("express");
require('dotenv').config();
// Set up the router
const router = (0, express_1.Router)();
// Registers a new user
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the request
        const { email, login, password } = req.body;
        if (!email || !login || !password) {
            res
                .status(400)
                .json({ message: "Missing one or more required fields" });
            return;
        }
        // Check if a user with this email or username already exists
        const by_email = yield User_js_1.default.findOne({ email });
        if (by_email) {
            res
                .status(403)
                .json({ message: "Email is already in use" });
            return;
        }
        const by_login = yield User_js_1.default.findOne({ login });
        if (by_login) {
            res
                .status(403)
                .json({ message: "Username is already in use" });
            return;
        }
        // Create the new user and authenticate
        const user = yield User_js_1.default.create({ email, login, password });
        // Respond (duh)
        res
            .status(201)
            .json({ message: "User successfully created" });
    }
    catch (err) {
        // Uh oh!
        console.error(err);
        res
            .status(500)
            .json({ message: "Internal server error" });
    }
}));
// Logs a user in
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { login, password } = req.body;
        // Validate the request
        if (!login || !password) {
            res.status(400).json({
                message: "Username and password are required"
            });
            return;
        }
        // Find the user
        const user = yield User_js_1.default.findOne({ login });
        if (!user) {
            res.status(401).json({
                message: "User does not exist"
            });
            return;
        }
        // Check the password
        const auth = password == user.password;
        if (!auth) {
            res.status(401).json({
                message: "Invalid password"
            });
            return;
        }
        // Return the user record without exposing the password
        const userRecord = user.toObject();
        delete userRecord.password;
        res.status(200).json(userRecord);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}));
// Logs a user out
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res
        .status(200)
        .json({ message: "User successfully logged out" });
});
exports.default = router;
//# sourceMappingURL=auth.js.map