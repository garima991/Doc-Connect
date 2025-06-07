import express from 'express';
import { loginAdmin, allAppointments, addDoctor, allDoctors, adminDashboard, cancelAppointment } from '../controllers/admin.controller.js';
import { changeAvailability} from '../controllers/doctor.controller.js';
import upload from '../middlewares/multer.js';
import verifyJWT from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/role.middleware.js';

const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin)
adminRouter.post("/add-doctor", verifyJWT, checkRole(['admin']), upload.single('image'), addDoctor)
adminRouter.get("/appointments", verifyJWT, checkRole(['admin']), allAppointments)
adminRouter.patch("/cancel-appointment", verifyJWT,checkRole(['admin']), cancelAppointment)
adminRouter.get("/all-doctors", verifyJWT, checkRole(['admin']),  allDoctors)
adminRouter.patch("/change-availability", verifyJWT, checkRole(['admin']), changeAvailability)
adminRouter.get("/dashboard", verifyJWT, checkRole(['admin']), adminDashboard)

export default adminRouter;