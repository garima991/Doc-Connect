import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log(process.env.MONGODB_URL, process.env.DB_NAME);
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
        console.log(`MongoDB connected !  DB HOST : ${connectionInstance.connection.host}`);

    }
    catch (error){
        console.error("error connecting to database" , error);
    }
}

export default connectDB;