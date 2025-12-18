import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import errorHandler from "./middleware/error.middleware.js";

const app = express();
// Middleware
app.use(cors()); 
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use(errorHandler);

export default app;