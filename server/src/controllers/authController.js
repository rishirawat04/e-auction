import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import userModel from '../models/userModel.js';
import { sendToken } from '../helpers/sendToken.js';


const createToken = (userId, expiresIn = '1d') => jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn });

export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, role  } = req.body;
     
    console.log(role);
    
    const existingUser = await userModel.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists with this email' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
      role
    });

  
    res.status(201).json({success:true, message: 'User created successfully', newUser });

  } catch (err) {
  console.error('Signup Error:', err);
  res.status(500).json({ message: 'Server error during singup' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    sendToken(user, res, 'Login successful');
  } catch (err) {
  console.error('Login Error:', err);
  res.status(500).json({ message: 'Server error during login' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logged out successfully' });
};


