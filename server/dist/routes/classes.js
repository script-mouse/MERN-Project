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
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const Class_1 = __importDefault(require("../models/Class"));
const router = (0, express_1.Router)();
// Create a class
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, ownerId } = req.body;
        if (!name || !ownerId) {
            res.status(400).json({
                error: 'Class name and owner ID are required'
            });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(ownerId)) {
            res.status(400).json({ error: 'Invalid owner ID' });
            return;
        }
        const owner = yield User_1.default.findById(ownerId);
        if (!owner) {
            res.status(404).json({ error: 'Owner not found' });
            return;
        }
        // Create the class.
        const classroom = yield Class_1.default.create({
            name: name.trim(),
            description: description || '',
            owner: ownerId,
            members: [ownerId],
            instructors: [],
            decks: []
        });
        // Add the class ID to the owner's classes array.
        yield User_1.default.findByIdAndUpdate(ownerId, {
            $addToSet: { classes: classroom._id }
        }, { new: true });
        // Verify that the class was added.
        const updatedUser = yield User_1.default.findById(ownerId);
        console.log('User classes after creation:', updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.classes);
        res.status(201).json({
            message: 'Class created successfully',
            class: classroom
        });
    }
    catch (error) {
        console.error('Error creating class:', error);
        res.status(500).json({ error: 'Unable to create class' });
    }
}));
// Join a class using its class code
router.post('/join', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { classCode, userId } = req.body;
        if (!classCode || !userId) {
            res.status(400).json({
                error: 'Class code and user ID are required'
            });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ error: 'Invalid user ID' });
            return;
        }
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const classroom = yield Class_1.default.findOne({
            classCode: classCode.trim().toUpperCase()
        });
        if (!classroom) {
            res.status(404).json({ error: 'Invalid class code' });
            return;
        }
        yield User_1.default.findByIdAndUpdate(userId, {
            $addToSet: { classes: classroom._id }
        });
        yield Class_1.default.findByIdAndUpdate(classroom._id, {
            $addToSet: { members: userId }
        });
        const updatedClass = yield Class_1.default.findById(classroom._id)
            .populate('decks');
        res.status(200).json({
            message: 'Successfully joined class',
            class: updatedClass
        });
    }
    catch (error) {
        console.error('Error joining class:', error);
        res.status(500).json({ error: 'Unable to join class' });
    }
}));
// Get all classes belonging to a user
router.get('/user/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ error: 'Invalid user ID' });
            return;
        }
        const user = yield User_1.default.findById(userId).populate({
            path: 'classes',
            populate: { path: 'decks' }
        });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json({
            classes: user.classes
        });
    }
    catch (error) {
        console.error('Error retrieving classes:', error);
        res.status(500).json({ error: 'Unable to retrieve classes' });
    }
}));
// Get one class
router.get('/:classId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { classId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(classId)) {
            res.status(400).json({ error: 'Invalid class ID' });
            return;
        }
        const classroom = yield Class_1.default.findById(classId).populate('decks');
        if (!classroom) {
            res.status(404).json({ error: 'Class not found' });
            return;
        }
        res.status(200).json({ class: classroom });
    }
    catch (error) {
        console.error('Error retrieving class:', error);
        res.status(500).json({ error: 'Unable to retrieve class' });
    }
}));
exports.default = router;
//# sourceMappingURL=classes.js.map