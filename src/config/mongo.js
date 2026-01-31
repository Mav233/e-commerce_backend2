import mongoose from "mongoose";
import "dotenv/config";

export const connectMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("🟢 Conectado a MongoDB Atlas");
    } catch (error) {
        console.error("🔴 Error MongoDB", error);
    }
};