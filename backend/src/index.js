import express from "express";
import cors from 'cors';
import connectDB from './config/database.js';
import 'dotenv/config';

const app = express();
app.use(express.json());


// Middlewares
app.use(cors());
app.use(express.json());

// Sample Route


// Server logic
let server;
const gracefulShutdown = async (exitCode) => {
    try {
        console.log("Closing HTTP server...");
        if (server) {
            server.close(() => {
                console.log("HTTP server closed.");
                process.exit(exitCode);
            });
        } else {
            process.exit(exitCode);
        }
    } catch (error) {
        console.error("Error during shutdown:", error);
        process.exit(1);
    }
};
const startServer = async () => {
    try {
        await connectDB(process.env.MONGO_URI);

        const port = process.env.PORT || 8000;

        // GRACEFUL SHUTDOWN
        //#region 
        server = app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });

        server.on("error", (error) => {
            console.error("Server error:", error);
            gracefulShutdown(1);
        });

        process.on("unhandledRejection", (reason) => {
            console.error("Unhandled Rejection:", reason);
            gracefulShutdown(1);
        });

        process.on("uncaughtException", (err) => {
            console.error("Uncaught Exception:", err);
            gracefulShutdown(1);
        });

        process.on('SIGINT', () => {
            console.log('Received SIGINT. Shutting down gracefully...');
            gracefulShutdown(0);
        });
        //#endregion
    } catch (error) {
        console.error("Failed to start server:", error);
        await gracefulShutdown(1);
    }
};

startServer();

export default app;