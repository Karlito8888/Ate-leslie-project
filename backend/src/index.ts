import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./middleware/errorHandler";
import { swaggerSpec } from "./utils/swagger";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import eventRoutes from "./routes/eventRoutes";
import contactRoutes from './routes/contactRoutes';

// Load environment variables
dotenv.config();

// Express app configuration
const app = express();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/contact", contactRoutes);

// Error handling
app.use(errorHandler);

// Database configuration
export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error("MONGODB_URI is missing in environment variables");
    }
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Server startup
const startServer = async (): Promise<void> => {
  try {
    const PORT = process.env.PORT || 5000;
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start server only if not imported
if (require.main === module) {
  startServer();
}

export default app;
