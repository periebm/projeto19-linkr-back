import { db } from "../database/db.connection.js";

class PostRepository {
    getPosts() {
        const query = ` SELECT p.*, 
        COUNT(l.id) AS total_likes, 
                ARRAY(
                    SELECT unnest(array_agg(u.username)) 
                    FROM unnest(array_agg(u.username)) 
                    LIMIT 2
                ) AS liked_users,
                EXISTS (
                    SELECT 1 
                    FROM likes 
                    WHERE user_id = 1 
                    AND post_id = p.id
                ) AS user_liked,
                (
                    SELECT json_build_object('username', username, 'picture', picture_url) 
                    FROM users 
                    WHERE p.user_id = users.id
                ) AS author
        FROM posts p
        JOIN trending_posts tr ON p.id = tr.post_id
        JOIN trendings t ON t.id = tr.trending_id
        LEFT JOIN likes l ON l.post_id = p.id
        LEFT JOIN users u ON l.user_id = u.id
        ORDER BY posts.createdAt DESC
        LIMIT 20
        GROUP BY p.id, u.username;`;

        return db.query(query);
    }

    createPost(user_id, description, url) {
        const query = `
        INSERT INTO 
        posts (user_id, description, url) 
        VALUES ($1, $2, $3) RETURNING id
        `;

        return db.query(query, [
            user_id,
            description,
            url
        ]);
    }

    getPostsByHashTag(hashTag) {
        const query = `
        SELECT p.*, 
        COUNT(l.id) AS total_likes, 
                ARRAY(
                    SELECT unnest(array_agg(u.username)) 
                    FROM unnest(array_agg(u.username)) 
                    LIMIT 2
                ) AS liked_users,
                EXISTS (
                    SELECT 1 
                    FROM likes 
                    WHERE user_id = 1 
                    AND post_id = p.id
                ) AS user_liked,
                (
                    SELECT json_build_object('username', username, 'picture', picture_url) 
                    FROM users 
                    WHERE p.user_id = users.id
                ) AS author
        FROM posts p
        JOIN trending_posts tr ON p.id = tr.post_id
        JOIN trendings t ON t.id = tr.trending_id
        LEFT JOIN likes l ON l.post_id = p.id
        LEFT JOIN users u ON l.user_id = u.id
        WHERE t.name ILIKE $1
        GROUP BY p.id, u.username;`;

        return db.query(query, [
            hashTag
        ]);
    }

    getPostsbyIdDB(id) {
        const query = `
            SELECT * FROM posts WHERE id=$1;`;

        return db.query(query, [id]);
    }

    deletePost(id) {
        const query = `
            DELETE FROM posts WHERE id=$1;`;

        return db.query(query, [id]);
    }


}

export default new PostRepository;