import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

// Middleware: ensures every protected route request has a valid JWT
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Missing Authorization header" });

    // Expect format: Bearer TOKEN
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer")
        return res.status(401).json({ message: "Malformed Authorization header" });

    const token = parts[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET) as any;
        (req as any).userId = payload.id; // store id in request for later use
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};