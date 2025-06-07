import express from 'express';
import { loginDoctor, doctorAppointments, cancelAppointment, doctorList, appointmentComplete, doctorDashboard, doctorProfile, updateDoctorProfile, changeAvailability } from '../controllers/doctor.controller.js';
import verifyJWT from '../middlewares/auth.middleware.js';
import {checkRole} from '../middlewares/role.middleware.js'

const doctorRouter = express.Router();

doctorRouter.post("/login", loginDoctor)
    doctorRouter.get("/profile", verifyJWT, checkRole(['doctor']),  doctorProfile)
    doctorRouter.patch("/update-profile", verifyJWT, checkRole(['doctor']), updateDoctorProfile)
    doctorRouter.patch("/cancel-appointment", verifyJWT, checkRole(['doctor']), cancelAppointment)
    doctorRouter.get("/appointments", verifyJWT, checkRole(['doctor']), doctorAppointments)
    doctorRouter.get("/all-doctors", verifyJWT, checkRole(['doctor','user']), doctorList)
    doctorRouter.patch("/change-availability", verifyJWT, checkRole(['doctor']), changeAvailability)
    doctorRouter.patch("/complete-appointment", verifyJWT, checkRole(['doctor']), appointmentComplete)
    doctorRouter.get("/dashboard", verifyJWT, checkRole(['doctor']), doctorDashboard)

export default doctorRouter;