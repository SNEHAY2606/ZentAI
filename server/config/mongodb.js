import mongoose from "mongoose";

const connectDB = async () => {

    //event to check the db connected
    mongoose.connection.on('connected', () => {
        console.log("Database Connected")
    })

    //event to check the db connection error
    mongoose.connection.on('error', (err) => {
        console.error("Database Connection Error:", err)
    })

    try {
        if (!process.env.MONGODB_URL) {
            throw new Error("MONGODB_URL is not defined in environment variables")
        }
        await mongoose.connect(process.env.MONGODB_URL)
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message)
        throw error
    }
}

export default connectDB;