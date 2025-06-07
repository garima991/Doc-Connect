import jwt from 'jsonwebtoken';
import { Doctor } from '../models/doctor.model.js';
import { User } from '../models/user.model.js';

const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No or malformed token provided" });
    }

    const token = authHeader.split(" ")[1].trim();

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    console.log(decoded);

    if (decoded.role === 'admin') {
      if (decoded.email !== process.env.ADMIN_EMAIL) {
        return res.status(401).json({ message: 'Invalid admin' });
      }
      req.user = { email: decoded.email, role: 'admin' };
      return next();
    }

    let currentUser;
    if (decoded.role === 'doctor') {
      currentUser = await Doctor.findById(decoded._id).select('-password');
    } else if (decoded.role === 'user') {
      currentUser = await User.findById(decoded._id).select('-password');
    }

    if (!currentUser) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token', error: err.message });
  }
};

export default verifyJWT;
