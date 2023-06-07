import { db } from "../database/db.connection.js";

class CommentRepository {
    create(reqParams) {
        const { content, userId, postId } = reqParams;

        const query = `
        WITH inserted_comment AS (
            INSERT INTO comments (content, user_id, post_id)
            VALUES ($1, $2, $3)
            RETURNING *
          )
          SELECT ic.*, 
                 EXISTS (
                   SELECT 1 
                   FROM followers f 
                   WHERE f.follower_id = $2
                   AND f.following_id = ic.user_id
                 ) as is_following,
                 (
                    SELECT jsonb_build_object('username', username, 'picture', picture_url) 
                    FROM users 
                    WHERE ic.user_id = users.id
                ) AS author
          FROM inserted_comment ic
          JOIN users u ON u.id = ic.user_id
          ORDER BY ic.createdat DESC;
        `;
        return db.query(query, [content, userId, postId]);
    }

    listCommentsById({ userId, id }) {
        const query = `
        SELECT c.*, 
        EXISTS (
            SELECT 1 
            FROM followers f 
            WHERE f.follower_id = $1
            AND f.following_id = c.user_id
        ) as is_following,
        (
            SELECT jsonb_build_object('username', username, 'picture', picture_url) 
            FROM users 
            WHERE c.user_id = users.id
        ) AS author,
        c.user_id = p.user_id as is_owner
        FROM comments c
        JOIN users u ON u.id = c.user_id
        JOIN posts p ON p.id = c.post_id
        WHERE post_id = $2
        ORDER BY c.createdat DESC; 
        `;
        return db.query(query, [userId, id]);
    }
}

export default new CommentRepository();