import { db } from "../database/db.connection.js";
import { getUserByIdDB } from "../repositories/users.repositories.js";

export async function validateFollows(req, res, next) {
    const { following_id } = req.body;
    
    try {
        const existUser = await getUserByIdDB(following_id);

        if(!existUser.rowCount) return res.sendStatus(404);
        if(res.locals.userId == following_id) return res.sendStatus(401);
        
        next();
    } catch (err) {
        res.status(500).send(err.message)
    }
  }