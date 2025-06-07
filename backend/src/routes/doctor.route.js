import express from 'express';
import { loginDoctor, doctorAppointments, cancelAppointment, doctorList, appointmentComplete, doctorDashboard, doctorProfile, updateDoctorProfile, changeAvailability } from '../controllers/doctor.controller.js';
import authDoctor from '../middlewares/authDoctor.js';

const doctorRouter = express.Router();

doctorRouter.post("/login", loginDoctor)
doctorRouter.get("/profile", authDoctor, doctorProfile)
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile)
doctorRouter.post("/cancel-appointment", authDoctor, cancelAppointment)
doctorRouter.get("/appointments", authDoctor, doctorAppointments)
doctorRouter.get("/all-doctors", doctorList)
doctorRouter.post("/change-availability", authDoctor, changeAvailability)
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete)
doctorRouter.get("/dashboard", authDoctor, doctorDashboard)

export default doctorRouter;