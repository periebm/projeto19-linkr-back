import { followUserDB, getAlreadyFollowingUserDB, getFollowsDB, getUsersDB, unfollowDB } from "../repositories/users.repositories.js";

export async function getUsers(req, res) {

    try {
        const users = await getUsersDB(res.locals.userId);
        res.send(users.rows);
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function followUser(req, res) {
    const { following_id } = req.body

    try {       
        const alreadyFollow = await getAlreadyFollowingUserDB(res.locals.userId, following_id)
        
        if (alreadyFollow.rows[0].is_following) {
            await unfollowDB(res.locals.userId, following_id);

            return res.sendStatus(201);
        }

        await followUserDB(res.locals.userId, following_id)

        res.sendStatus(201);
    } 
    
    catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getFollows(req, res) {

    try {
        const follows = await getFollowsDB();
        res.send(follows.rows);
    } catch (err) {
        res.status(500).send(err.message)
    }
}