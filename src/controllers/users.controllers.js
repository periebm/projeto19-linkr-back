import { getUsersDB } from "../repositories/users.repositories.js";

export async function getUsers(req, res) {

    try {
        const users = await getUsersDB();
        res.send(users.rows);
    } catch (err) {
        res.stats(500).send(err.message)
    }
}