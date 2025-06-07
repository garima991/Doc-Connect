import express from 'express';
import { loginAdmin, allAppointments, addDoctor, allDoctors, adminDashboard, cancelAppointment } from '../controllers/admin.controller.js';
import { changeAvailability} from '../controllers/doctor.controller.js';
import authAdmin from '../middlewares/authAdmin.js';
import upload from '../middlewares/multer.js';

const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin)
adminRouter.post("/add-doctor", authAdmin, upload.single('image'), addDoctor)
adminRouter.get("/appointments", authAdmin, allAppointments)
adminRouter.post("/cancel-appointment", authAdmin, cancelAppointment)
adminRouter.get("/all-doctors", authAdmin, allDoctors)
adminRouter.post("/change-availability", authAdmin, changeAvailability)
adminRouter.get("/dashboard", authAdmin, adminDashboard)

export default adminRouter;