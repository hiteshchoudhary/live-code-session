import dotenv from "dotenv"

dotenv.config()

const config = {
    PORT: process.env.PORT || 5000,
    MONGODB_URL: process.env.MONGODB_URL || "mongodb://localhost:27017/ecomm",
    JWT_SECRET: process.env.JWT_SECRET || "yoursecret",
    JWT_EXPIRY: process.env.JWT_EXPIRY || "30d"
}

export default config