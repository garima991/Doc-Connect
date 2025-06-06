import dotenv from 'dotenv';
import connectDB from './src/config/database.js';
import connectCloudinary from './src/config/cloudinary.js';
import app from './app.js'

dotenv.config(); // load env variables

const startServer = async () => {
    try {
        await connectDB();  // connect DB
        connectCloudinary()  // configure cloudinary

        // start server
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        })
    }
    catch(error){
        console.error("Failed to start server",error);
        process.exit(1);  // exit on failure
    }
};

startServer();