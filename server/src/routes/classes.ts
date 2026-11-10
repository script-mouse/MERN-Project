
import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

import User from '../models/User';
import Class from '../models/Class';

const router = Router();

// Create a class
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, ownerId } = req.body;

    if (!name || !ownerId) {
      res.status(400).json({
        error: 'Class name and owner ID are required'
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      res.status(400).json({ error: 'Invalid owner ID' });
      return;
    }

    const owner = await User.findById(ownerId);

    if (!owner) {
      res.status(404).json({ error: 'Owner not found' });
      return;
    }

    // Create the class.
    const classroom = await Class.create({
      name: name.trim(),
      description: description || '',
      owner: ownerId,
      members: [ownerId],
      instructors: [],
      decks: []
    });

    // Add the class ID to the owner's classes array.
    await User.findByIdAndUpdate(
      ownerId,
      {
        $addToSet: { classes: classroom._id }
      },
      { new: true }
    );

    // Verify that the class was added.
    const updatedUser = await User.findById(ownerId);

    console.log('User classes after creation:', updatedUser?.classes);

    res.status(201).json({
      message: 'Class created successfully',
      class: classroom
    });
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ error: 'Unable to create class' });
  }
});

// Join a class using its class code
router.post('/join', async (req: Request, res: Response): Promise<void> => {
  try {
    const { classCode, userId } = req.body;

    if (!classCode || !userId) {
      res.status(400).json({
        error: 'Class code and user ID are required'
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const classroom = await Class.findOne({
      classCode: classCode.trim().toUpperCase()
    });

    if (!classroom) {
      res.status(404).json({ error: 'Invalid class code' });
      return;
    }

    await User.findByIdAndUpdate(userId, {
      $addToSet: { classes: classroom._id }
    });

    await Class.findByIdAndUpdate(classroom._id, {
      $addToSet: { members: userId }
    });

    const updatedClass = await Class.findById(classroom._id)
      .populate('decks');

    res.status(200).json({
      message: 'Successfully joined class',
      class: updatedClass
    });
  } catch (error) {
    console.error('Error joining class:', error);
    res.status(500).json({ error: 'Unable to join class' });
  }
});

// Get all classes belonging to a user
router.get('/user/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    const user = await User.findById(userId).populate({
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
  } catch (error) {
    console.error('Error retrieving classes:', error);
    res.status(500).json({ error: 'Unable to retrieve classes' });
  }
});

// Get one class
router.get('/:classId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(classId)) {
      res.status(400).json({ error: 'Invalid class ID' });
      return;
    }

    const classroom = await Class.findById(classId).populate('decks');

    if (!classroom) {
      res.status(404).json({ error: 'Class not found' });
      return;
    }

    res.status(200).json({ class: classroom });
  } catch (error) {
    console.error('Error retrieving class:', error);
    res.status(500).json({ error: 'Unable to retrieve class' });
  }
});

export default router;
