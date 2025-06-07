import { Doctor } from '../models/doctor.model.js';
import { Appointment } from '../models/appointment.model.js';
import { comparePassword, generateToken } from '../utils/auth.js';

/**
 * @desc login user
 * @route /doctor/login
 */

export const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email && !password) {
            return res.status(400).json({ message: "Email or password is required" });
        }

        const doctor = await Doctor.findOne({ email });
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" })
        }

        const isPasswordValid = await comparePassword(password, doctor.password);

        if (isPasswordValid) {
            const accessToken = await generateToken(doctor);
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
 * @desc get profile
 * @route /doctor/profile
 */

export const doctorProfile = async (req, res) => {
    try {
        const { docId } = req.body;
        const profileData = await Doctor.findById(docId).select("-password");
        res.json({ success: true, profileData });
    } catch (error) {
        res.json({ success: false, message: "Something went wrong", error: error.message });
    }
};




/**
 * @desc update profile
 * @route /doctor/update-profile
 */

export const updateDoctorProfile = async (req, res) => {
    try {
        const { docId, fees, address, available } = req.body;
        await Doctor.findByIdAndUpdate(docId, { fees, address, available });
        res.json({ success: true, message: "Profile Updated" });
    } catch (error) {
        res.json({ success: false, message: "Error while updating Doctor details", error: error.message });
    }
};




/**
 * @desc all appointments
 * @route /doctor/appointments
 */

export const doctorAppointments = async (req, res) => {
    try {
        const { docId } = req.body;
        const appointments = await Appointment.find({ docId });
        res.status(200).json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: error.message });
    }
};




/**
 * @desc cancel appointment
 * @route /doctor/cancel-appointment
 */

export const cancelAppointment = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body;
        const appointmentData = await Appointment.findById(appointmentId);

        if (appointmentData && appointmentData.docId === docId) {
            await Appointment.findByIdAndUpdate(appointmentId, {
                cancelled: true,
            });
            return res.json({ success: true, message: "Appointment Cancelled" });
        }
        else {
            return res.json({ success: false, message: "Cancellation Failed" });
        }
    } catch (error) {
        res.json({ success: false, message: "Error while cancelling appointment", error: error.message });
    }
};



/**
 * @desc complete appointment
 * @route /doctor/complete-appointment
 */

export const appointmentComplete = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body;
        const appointmentData = await Appointment.findById(appointmentId);

        if (appointmentData && appointmentData.docId === docId) {
            await Appointment.findByIdAndUpdate(appointmentId, {
                isCompleted: true,
            });
            return res.json({ success: true, message: "Appointment Completed" });
        }
        else {
            return res.json({ success: false, message: "Mark Failed" });
        }
    } catch (error) {
        res.json({ success: false, message: "Error while marking completion", error: error.message });
    }
};



/**
 * @desc change availability
 * @route /doctor/change-availability
 */

export const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body;
        const docData = await Doctor.findById(docId);
        await Doctor.findByIdAndUpdate(docId, {
            available: !docData.available,
        });
        res.status(200).json({ success: true, message: "Availability changed" });
    } catch (error) {
        res.json({ success: false, message: "Error while changing availability", error: error.message });
    }
};




/**
 * @desc all doctors
 * @route /doctor/all-doctors
 */

export const doctorList = async (req, res) => {
    try {
        const doctors = await Doctor.find({}).select(["-password", "-email"]);
        res.status(200).json({ success: true, doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error while fetching doctos", error: error.message });
    }
};




/**
 * @desc doctor dashboard
 * @route /doctor/dashboard
 */

export const doctorDashboard = async (req, res) => {
    try {
        const { docId } = req.body;
        const appointments = await Appointment.find({ docId });

        let earnings = 0;

        appointments.map((appointment) => {
            if (appointment.isCompleted || appointment.payment) {
                earnings += appointment.amount;
            }
        });

        let patients = [];

        appointments.map((appointment) => {
            if (!patients.includes(appointment.userId)) {
                patients.push(appointment.userId);
            }
        });

        const dashboardData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 10),
        };

        res.json({ success: true, dashboardData });
    } catch (error) {
        res.json({ success: false, message: "Something went wrong", error: error.message });
    }
}

