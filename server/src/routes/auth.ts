import User from '../models/User.js';
import { Router, Request, Response } from 'express';

require('dotenv').config();

// Set up the router
const router = Router();

// Registers a new user
router.post('/register', async (req: Request, res: Response) => {
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
        const by_email = await User.findOne({ email });
        if (by_email) {
            res
                .status(403)
                .json({ message: "Email is already in use" });
            return;
        }
        const by_login = await User.findOne({ login });
        if (by_login) {
            res
                .status(403)
                .json({ message: "Username is already in use" });
            return;
        }

        // Create the new user and authenticate
        const user = await User.create({ email, login, password });

        // Respond (duh)
        res
            .status(201)
            .json({ message: "User successfully created" });
    } catch (err) {
        // Uh oh!
        console.error(err);
        res
            .status(500)
            .json({ message: "Internal server error" });
    }
});

// Logs a user in

router.post('/login', async (req: Request, res: Response) => {
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
        const user = await User.findOne({ login });

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

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

// Logs a user out
router.post('/logout', (req: Request, res: Response) => {
    res.clearCookie('token');
    res
        .status(200)
        .json({ message: "User successfully logged out" });
});

export default router;