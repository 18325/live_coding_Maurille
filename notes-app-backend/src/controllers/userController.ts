// src/controllers/userController.ts
import { Request, Response } from 'express';
import User, { IUser } from '../models/User';

export const login = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }
    
    // Find user or create if doesn't exist
    let user = await User.findOne({ username });
    
    if (!user) {
      user = await User.create({ username });
    }
    
    res.status(200).json({ 
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-__v');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};