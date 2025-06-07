import express from 'express';
import {bookAppointment, cancelAppointment, getProfile, getYourAppointments, loginUser, registerUser, updateProfile} from '../controllers/user.controller.js'
import upload from '../middlewares/multer.js';
import verifyJWT from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/role.middleware.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/get-profile', verifyJWT, checkRole(['user']), getProfile);
userRouter.patch('/update-profile', verifyJWT, upload.single('image'), checkRole(['user']), updateProfile);
userRouter.post('/book-appointment', verifyJWT, checkRole(['user']), bookAppointment);
userRouter.get('/appointments', verifyJWT, checkRole(['user']), getYourAppointments);
userRouter.patch('/cancel-appointment', verifyJWT, checkRole(['user']), cancelAppointment);

export default userRouter;