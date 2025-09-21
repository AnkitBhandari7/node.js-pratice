import { Request, Response } from "express";
import * as userService from "../services/userService";
import * as userModel from "../models/userModel";
import { presentUser } from "../ presenters/userPresenter"

// Handle: User registration (signup)
export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        // Basic request validation: check if all required fields exist
        if (!username || !email || !password)
            return res.status(400).json({ message: "username, email and password are required" });

        // Call service layer to create user
        const user = await userService.registerUser(username, email, password);
        return res.status(201).json({ user: presentUser(user) }); // Send back safe presented user
    } catch (err: any) {
        return res.status(400).json({ message: err.message || "Could not register" });
    }
};

// Handle: User login
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "email and password are required" });

        // Service validates credentials and returns token + user
        const { token, user } = await userService.loginUser(email, password);
        return res.json({ token, user: presentUser(user) });
    } catch (err: any) {
        return res.status(401).json({ message: err.message || "Invalid credentials" });
    }
};

// Handle: Get logged-in user's own profile
export const getProfile = async (req: Request, res: Response) => {
    const userId = (req as any).userId; // already set by authMiddleware
    const user = await userModel.findUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user: presentUser(user) });
};

// Handle: Admin → get list of all users
export const listAll = async (_req: Request, res: Response) => {
    const users = await userModel.listUsers();
    return res.json({ users: users.map(presentUser) });
};

// Handle: Update user data (username/email/password)
export const update = async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const { username, email, password } = req.body;

    // If updating password, hash it before storing
    let hashed: string | undefined;
    if (password) {
        const bcrypt = require("bcryptjs");
        const salt = await bcrypt.genSalt(10);
        hashed = await bcrypt.hash(password, salt);
    }

    const updated = await userModel.updateUser(userId, {
        username,
        email,
        ...(hashed ? { password: hashed } : {}) // only include password if changed
    });
    return res.json({ user: presentUser(updated) });
};

// Handle: Delete user
export const remove = async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const ok = await userModel.deleteUser(userId);
    if (!ok) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "Deleted" });
};