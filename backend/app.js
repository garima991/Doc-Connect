import express from 'express';
import cors from 'cors';
import userRouter from './src/routes/user.route.js';
import doctorRouter from './src/routes/doctor.route.js';
import adminRouter from './src/routes/admin.route.js'

const app = express();

// middlewares
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json());

// API Endpoints
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/doctor", doctorRouter);

// Default route for testing
app.get('/api/v1', (req, res) =>{
    res.send('Welcome to the DocConnect API');
})

// Handle unknown routes
app.all(/(.*)/, (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});



export default app;