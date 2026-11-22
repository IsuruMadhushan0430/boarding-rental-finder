const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const imageRoutes = require("./routes/imageRoutes");
const publicPropertyRoutes = require("./routes/publicPropertyRoutes");
const propertyDetailsRoutes = require("./routes/propertyDetailsRoutes");
const inquiryRoutes = require("./routes/inquiryRoutes");
const reportRoutes = require("./routes/reportRoutes");
const adminPropertyRoutes = require("./routes/adminPropertyRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/public/properties", publicPropertyRoutes);
app.use("/api/public/property-details", propertyDetailsRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin/properties", adminPropertyRoutes);

// Test API
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BoardingHub API is running!",
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();