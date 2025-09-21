import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json()); // middleware to parse JSON bodies

app.use("/api/users", userRoutes); // attach all user-related routes under /api/users

// Simple healthcheck route
app.get("/", (_req, res) => res.json({ ok: true, message: "API is running" }));

// Start HTTP server
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});