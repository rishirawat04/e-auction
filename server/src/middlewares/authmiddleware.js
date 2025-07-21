import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const sendUnauthorized = (res, message = 'Unauthorized') => {
    res.status(401).json({message});
};

export const authenticate = async(req, res, next) => {
    try {
        const token = req.cookies.token;
     
        if( !token ) return sendUnauthorized(res, 'Access token missing.');

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
       
        const user =await userModel.findById(decoded.id);
        
        if (!user) return sendUnauthorized(res, 'User not found.');

        req.user = user;
        next();
    } catch (error) {
      console.error('Auth Error:', error);
      return sendUnauthorized(res, 'Invalid or expired token.');  
    }
} 