import jwt from 'jsonwebtoken';
import User from '../Models/User.js';

// Protect routes
export const auth = async (req, res, next) => {
  const {token} = req.cookies;
  try{
    if(!token){
        return res.status(401).json({success: false, message: 'Not authorized, no token'})
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if(!req.user){
        return res.status(401).json({success: false, message: 'Not authorized, user not found'})
    }
    next();
  }catch(error){
    return res.status(401).json({success: false, message: 'Not authorized, token failed'})
  }
 };