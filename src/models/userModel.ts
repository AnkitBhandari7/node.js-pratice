import pool from "../config/db";

// Shape of a User in DB
export type DbUser = {
    id?: number;
    username: string;
    email: string;
    password: string;
    created_at?: string;
    updated_at?: string;
};

// Find user by email (for login + registration check)
export const findUserByEmail = async (email: string) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
    return (rows as any[])[0] || null;
};

// Find user by ID 
export const findUserById = async (id: number) => {
    const [rows] = await pool.query("SELECT id, username, email, created_at, updated_at FROM users WHERE id = ? LIMIT 1", [id]);
    return (rows as any[])[0] || null;
};

// Create new user
export const createUser = async (user: DbUser) => {
    const [result] = await pool.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [
        user.username,
        user.email,
        user.password
    ]);
    const insertId = (result as any).insertId;
    return findUserById(insertId);
};

// Update user by ID 
export const updateUser = async (id: number, user: Partial<DbUser>) => {
    const fields: string[] = [];
    const values: any[] = [];

    if (user.username !== undefined) { fields.push("username = ?"); values.push(user.username); }
    if (user.email !== undefined) { fields.push("email = ?"); values.push(user.email); }
    if (user.password !== undefined) { fields.push("password = ?"); values.push(user.password); }

    if (fields.length === 0) return findUserById(id);

    values.push(id);
    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    await pool.query(sql, values);
    return findUserById(id);
};

// Delete user by ID
export const deleteUser = async (id: number) => {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    return (result as any).affectedRows > 0;
};

// Return all users
export const listUsers = async () => {
    const [rows] = await pool.query("SELECT id, username, email, created_at, updated_at FROM users");
    return rows as any[];
};