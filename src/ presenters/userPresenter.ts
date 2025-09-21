import { DbUser } from "../models/userModel";

/*This function takes a user object from the database
and "presents" it in a clean way to send back to clients.
 For example: hides the password and renames columns to standard format.
*/
export const presentUser = (user: Partial<DbUser>) => {
    if (!user) return null; // If no user, return nothing
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at, 
        updatedAt: user.updated_at
    };
};