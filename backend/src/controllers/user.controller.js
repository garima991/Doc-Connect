import validator from 'validator';
import { User } from '../models/user.model.js';
import { generateToken, hashPassword } from '../utils/auth.js';

/**
 * @desc register a new user
 * @route /user/register
 */

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Missing Details" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        if (!validator.isStrongPassword(password)) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await hashPassword(password);

        const userData = await User.create({
            name,
            email,
            password: hashedPassword,
        })

        const accessToken = generateToken(userData);

        res.status(201).json({success: true, accessToken})

    }
    catch (error){
        res.status(500).json({message: "Error while registering", error: error.message})
    }
}

/**
 * @desc login user
 * @route 
 */




