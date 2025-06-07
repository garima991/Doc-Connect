import { Doctor } from '../models/doctor.model.js';
import { Appointment } from '../models/appointment.model.js';
import { User } from '../models/user.model.js';
import { hashPassword, generateToken } from '../utils/auth.js';
import validator from 'validator'
import { v2 as cloudinary } from "cloudinary";


/**
 * @desc login admin
 * @route /admin/login
 */

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const accessToken = await generateToken(email + password, process.env.ACCESS_TOKEN_SECRET_KEY);
            res.status(200).json({ success: true, message : "Logged in successfully", accessToken })
        }
        else {
            res.status(401).json({ success: false, message: "Invalid Credentials" });
        }

    }
    catch (error) {
        res.status(500).json({ message: "Error while logging in", error: error.message })
    }
}




/**
 * @desc add doctor
 * @route /admin/add-doctor
 */

export const addDoctor = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            speciality,
            degree,
            experience,
            about,
            fees,
            address,
        } = req.body;
        const imageFile = req.file;

        if (
            !name ||
            !email ||
            !password ||
            !speciality ||
            !degree ||
            !experience ||
            !about ||
            !fees ||
            !address
        ) {
            return res.status(400).json({ success: false, message: "Please fill all the details" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        if (!validator.isStrongPassword(password)) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        const hashedPassword = await hashPassword(password);
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: 'image',
        });
        const imageUrl = imageUpload.secure_url

        const doctorData = await Doctor.create({
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now(),
        });

        res.status(201).json({ success: true, message: "Doctor Added", doctorData});

    }

    catch (error) {
        res.status(500).json({ success: false, message: "Error while adding Doctor", error : error.message });
    }

}




/**
 * @desc all doctors
 * @route /admin/all-doctors
 */

export const allDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({}).select("-password");
        res.status(200).json({ success: true, doctors });
    } catch (error) {
        res.json({ success: false, message: "Error while fetching doctors", error: error.message });
    }
}




/**
 * @desc all appointments
 * @route /admin/appointments
 */

export const allAppointments = async () => {
    try {
        const appointments = await Appointment.find({});
        res.status(200).json({ success: true, message: "", appointments });
    } catch (error) {
        res.json({ success: false, message: "Error while fetching appointments", error: error.message });
    }
}




/**
 * @desc cancel appointments
 * @route /admin/cancel-appointment
 */

export const cancelAppointment = async () => {
    try {
        const { appointmentId } = req.body;

        const appointmentData = await Appointment.findById(appointmentId);

        await Appointment.findByIdAndUpdate(appointmentId, {
            cancelled: true,
        });

        // make that particular slot free for others
        const doctorData = await Doctor.findById(docId);

        let slots_booked = doctorData.slots_booked;

        slots_booked[slotDate] = slots_booked[slotDate].filter(
            (e) => e !== slotTime
        );

        await Doctor.findByIdAndUpdate(docId, { slots_booked });

        res.status(200).json({ success: true, message: "Appointment Cancelled Successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error while cancelling appointment", error: error.message });
    }
}




/**
 * @desc admin dashboard
 * @route /admin/dashboard
 */

export const adminDashboard = async () => {
    try {
        const doctors = await Doctor.find({});
        const users = await User.find({});
        const appointments = await Appointment.find({});

        const dashboardData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0, 10),
        };

        res.status(200).json({ success: true, dashboardData });
    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
    }
}