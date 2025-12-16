import mongoose from "mongoose";
import 'dotenv/config';

const connectDB = async (uri) => {
    try {
        const connectionInstance = await mongoose.connect(uri, {
            dbName: "securechain_db" // <--- Force the database name here
        });
        console.log(`\nDatabase connected successfully
            ${connectionInstance.connection.host}`);
        return connectionInstance;
    }
    catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
}
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to db');
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});
export default connectDB;