import { db } from "../database/db.connection.js";

class PostRepository {
    getPosts() {
        const query = `SELECT posts.*, users.username, users.picture_url
        FROM posts
        INNER JOIN users ON posts.user_id = users.id
        ORDER BY posts.createdAt DESC
        LIMIT 20;`;
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
        SELECT p.* 
        FROM posts p 
        JOIN trending_posts tr ON p.id = tr.post_id 
        JOIN trendings t ON t.id = tr.trending_id 
        WHERE t.name ILIKE $1`;

        return db.query(query, [
            hashTag
        ]);
    }
}

export default new PostRepository;