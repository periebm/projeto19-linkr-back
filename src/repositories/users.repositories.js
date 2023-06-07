import { db } from "../database/db.connection.js";

export async function createUser(email, username, hashedPassword, pictureUrl) {
  return await db.query(
    `INSERT INTO users (email, username, password, picture_url) VALUES ($1, $2, $3, $4)`,
    [email, username, hashedPassword, pictureUrl]
  );
}

export async function findUserForLogin(email) {
  return (
    (
      await db.query(
        `SELECT id AS "userId", password AS "hashedPassword", picture_url, username FROM users WHERE $1 = users.email`,
        [email]
      )
    )?.rows[0] || null
  );
}

export async function getUsersDB() {
  return db.query(`
        SELECT * FROM users
      `)
}

export async function getUserByIdDB(id) {
  return db.query(`
  SELECT * FROM users WHERE id=$1
`,[id])
}

export async function getAlreadyFollowingUserDB(follower, following) {
  return db.query(`
    SELECT EXISTS (
    SELECT 1 
    FROM followers 
    WHERE follower_id = $1 
    AND following_id = $2
) AS is_following;`,[follower, following])
}

export async function unfollowDB(follower, following) {
  return db.query(`
  DELETE FROM followers 
  WHERE follower_id = $1 
  AND following_id = $2;
  `,[follower, following])
}

export async function followUserDB(follower, following) {
  return db.query(`
  INSERT INTO
  followers (follower_id, following_id)
  VALUES ($1, $2)
  `,[follower, following])
}

export async function getFollowsDB() {
  return db.query(`
  SELECT * FROM followers
  `)
}