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
// Set up the Express router
const router = (0, express_1.Router)();
// Add a student to a class using their MongoDB IDs
router.post('/:userId/classes/:classId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, classId } = req.params;
        // Validate MongoDB IDs
        if (!mongoose_1.default.Types.ObjectId.isValid(userId) ||
            !mongoose_1.default.Types.ObjectId.isValid(classId)) {
            res.status(400).json({
                error: 'Invalid user ID or class ID'
            });
            return;
        }
        // Find the student
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({
                error: 'Student not found'
            });
            return;
        }
        // Find the class
        const classroom = yield Class_1.default.findById(classId);
        if (!classroom) {
            res.status(404).json({
                error: 'Class not found'
            });
            return;
        }
        // Add class ID to user's classes array
        yield User_1.default.findByIdAndUpdate(userId, {
            $addToSet: { classes: classId }
        });
        // Add user ID to class's members array
        yield Class_1.default.findByIdAndUpdate(classId, {
            $addToSet: { members: userId }
        });
        // Retrieve updated user
        const updatedUser = yield User_1.default.findById(userId)
            .select('-password');
        res.status(200).json({
            message: 'Student successfully added to class',
            user: updatedUser
        });
    }
    catch (error) {
        console.error('Error adding student to class:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
}));
exports.default = router;
//# sourceMappingURL=users.js.map