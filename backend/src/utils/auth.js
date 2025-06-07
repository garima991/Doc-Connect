import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Hash password
export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Compare password
export const comparePassword = async (enteredPassword, hashedPassword) => {
    return await bcrypt.compare(enteredPassword, hashedPassword);
};

// Generate JWT Token
export const generateToken = (payload) => {
    return jwt.sign({
        _id : payload._id,
        name: payload.name,
        email: payload.email,
        role: payload.role,
    }, 
    process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME });
};