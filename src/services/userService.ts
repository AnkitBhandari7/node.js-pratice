import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import * as userModel from "../models/userModel";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

// Register user: check if email already used → hash password → save
export const registerUser = async (username: string, email: string, password: string) => {
    const existing = await userModel.findUserByEmail(email);
    if (existing) throw new Error("Email already registered");

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await userModel.createUser({ username, email, password: hashed });
    return user;
};

// Login user: verify email & password → return JWT + user
export const loginUser = async (email: string, password: string) => {
    const user = await userModel.findUserByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    // Create token that expires in given time
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return { token, user: await userModel.findUserById(user.id) };
};