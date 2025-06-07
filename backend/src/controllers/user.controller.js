import validator from 'validator';
import { User } from '../models/user.model.js';
import { Appointment } from '../models/appointment.model.js';
import { Doctor } from '../models/doctor.model.js';
import { comparePassword, generateToken, hashPassword } from '../utils/auth.js';

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

        res.status(201).json({ success: true, user: userData, accessToken })

    }
    catch (error) {
        res.status(500).json({ message: "Error while registering", error: error.message })
    }
}




/**
 * @desc login user
 * @route /user/login
 */

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email && !password) {
            return res.status(400).json({ message: "Email or password is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "user not found" })
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (isPasswordValid) {
            const accessToken = await generateToken(user);
            res.status(200).json({ success: true, message: "Logged in successfully", accessToken })
        }
        else {
            res.status(401).json({ success: false, message: "Invalid Credentials" });
        }

    } catch (error) {
        res.status(500).json({ message: "Error while logging in", error: error.message })
    }
}




/**
 * @desc get user profile
 * @route /user/get-profile
 */

export const getProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const userData = await User.findById(userId).select("-password");

        res.json({ success: true, user: userData });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
}




/**
 * @desc update user profile
 * @route /user/update-profile
 */

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" });
        }

        await User.findByIdAndUpdate(userId, {
            name,
            phone,
            address: JSON.parse(address),
            dob,
            gender,
        });

        if (imageFile) {
            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: "image",
            });
            const imageURL = imageUpload.secure_url;

            await User.findByIdAndUpdate(userId, { image: imageURL });
        }

        res.json({ success: true, message: "Profile Updated" });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
}




/**
 * @desc book appointment
 * @route /user/book-appointment
 */

export const bookAppointment = async (req, res) => {
    try {
        const userId = req.user._id;
        const { docId, slotDate, slotTime } = req.body;

        const docData = await Doctor.findById(docId).select("-password");

        if (!docData.available) {
            return res.json({ success: false, message: "Doctor not available" });
        }

        let slots_booked = docData.slots_booked;

        // checking for slot availability
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: "Slot not available" });
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = [];
            slots_booked[slotDate].push(slotTime);
        }

        const userData = await User.findById(userId).select("-password");

        const newAppointment = await Appointment.create({
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now(),
        });

        // save new slots data in doctors Data
        await Doctor.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: "Appointment Booked", newAppointment });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
};




/**
 * @desc get your appointments
 * @route /user/appointments
 */

export const getYourAppointments = async (req, res) => {
    try {
        const userId = req.user._id;
        const appointments = await Appointment.find({ userId });
        res.json({ success: true, appointments });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
}




/**
 * @desc cancel appointment
 * @route 
 */

export const cancelAppointment = async (req, res) => {
    try {
        const userId = req.user._id;
        const { appointmentId } = req.body;

        const appointmentData = await Appointment.findById(appointmentId);

        // verify appointment user
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: "Unauthorized action" });
        }

        await Appointment.findByIdAndUpdate(appointmentId, {
            cancelled: true,
        });

        // releasing slot
        const { docId, slotDate, slotTime } = appointmentData;

        const doctorData = await Doctor.findById(docId);

        let slots_booked = doctorData.slots_booked;

        slots_booked[slotDate] = slots_booked[slotDate].filter(
            (e) => e !== slotTime
        );

        await Doctor.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: "Appointment Cancelled" });
    } catch (error) {
        res.json({ success: false, message: "Something went wrong", error: error.message });
    }
};




