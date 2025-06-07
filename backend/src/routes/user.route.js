import express from 'express';
import {bookAppointment, cancelAppointment, getProfile, getYourAppointments, loginUser, registerUser} from '../controllers/user.controller.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/get-profile', authUser, getProfile);
userRouter.post('/update-profile', upload.single('image'), authUser, getProfile);
userRouter.get('/book-appointment', authUser, bookAppointment);
userRouter.get('/appointments', authUser, getYourAppointments);
userRouter.post('/cancel-appointment', authUser, cancelAppointment);

export default userRouter;