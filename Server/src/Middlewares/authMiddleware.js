import jwt from 'jsonwebtoken';
import User from '../Models/User.js';

/**
 * Middleware: Route Protection
 * Verifies the JWT session token passed in the HTTP-only cookies.
 * Decodes the user ID, retrieves the user from the database (excluding password),
 * attaches it to the request object (req.user), and allows the request to proceed.
 */
export const protect = async (req, res, next) => {
  // Step 1: Extract the token from the request's cookies
  const { token } = req.cookies;
  
  try {
    // Step 2: If no token cookie exists, deny access immediately
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' })
    }
    
    // Step 3: Verify the cryptographic integrity of the token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Step 4: Locate the user in the database using the decoded ID (excluding password)
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' })
    }
    
    // Step 5: User is valid — pass execution to the next middleware or controller
    next();
  } catch (error) {
    // Handle invalid/expired token exceptions
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' })
  }
};