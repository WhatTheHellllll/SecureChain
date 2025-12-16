import express from "express";
import cors from "cors";
import productRoutes from "./routes/product.route.js";

const app = express();
// Middleware
app.use(cors()); 
app.use(express.json());

app.use("/api/v1/products", productRoutes);

export default app;