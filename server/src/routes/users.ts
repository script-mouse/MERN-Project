
import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

import User from '../models/User';
import Class from '../models/Class';

// Set up the Express router
const router = Router();

// Add a student to a class using their MongoDB IDs
router.post(
  '/:userId/classes/:classId',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, classId } = req.params;

      // Validate MongoDB IDs
      if (
        !mongoose.Types.ObjectId.isValid(userId) ||
        !mongoose.Types.ObjectId.isValid(classId)
      ) {
        res.status(400).json({
          error: 'Invalid user ID or class ID'
        });
        return;
      }

      // Find the student
      const user = await User.findById(userId);

      if (!user) {
        res.status(404).json({
          error: 'Student not found'
        });
        return;
      }

      // Find the class
      const classroom = await Class.findById(classId);

      if (!classroom) {
        res.status(404).json({
          error: 'Class not found'
        });
        return;
      }

      // Add class ID to user's classes array
      await User.findByIdAndUpdate(userId, {
        $addToSet: { classes: classId }
      });

      // Add user ID to class's members array
      await Class.findByIdAndUpdate(classId, {
        $addToSet: { members: userId }
      });

      // Retrieve updated user
      const updatedUser = await User.findById(userId)
        .select('-password');

      res.status(200).json({
        message: 'Student successfully added to class',
        user: updatedUser
      });

    } catch (error) {
      console.error('Error adding student to class:', error);

      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
);

export default router;
