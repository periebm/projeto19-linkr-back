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
        `SELECT id AS "userId", password AS "hashedPassword", picture_url FROM users WHERE $1 = users.email`,
        [email]
      )
    )?.rows[0] || null
  );
}
