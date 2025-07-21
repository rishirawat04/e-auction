import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
        })
        console.log("MongoDB connected successfully");
    } catch (err) {
        throw new Error("MongoDB connection failed", err.message);
    }
}

export default connectDb;