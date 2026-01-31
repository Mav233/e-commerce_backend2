import dotenv from "dotenv";

dotenv.config();

export default {
    PORT: process.env.PORT || 8080,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV || "development"
};