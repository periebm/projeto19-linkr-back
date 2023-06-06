import { db } from "../database/db.connection.js";

class PostRepository {
    getPosts(user_id) {
        const query = ` 
        SELECT * 
		FROM (SELECT p.id, 
            p.user_id,
		p.description,
		  p.url,
			  p.createdat,
    COUNT(l.post_id) AS total_likes, 
	CAST(COUNT(r.post_id) AS INTEGER) AS total_reposts,
    ARRAY_AGG(u.username) AS liked_users,
    EXISTS (
        SELECT 1 
        FROM likes 
        WHERE user_id = $1
        AND post_id = p.id
        LIMIT 1
    ) AS user_liked,
    (
        SELECT jsonb_build_object('username', username, 'picture', picture_url) 
        FROM users 
        WHERE p.user_id = users.id
    ) AS author,
			  
			  NULL AS reposted_by
			  
FROM posts p
LEFT JOIN trending_posts tr ON p.id = tr.post_id
LEFT JOIN likes l ON p.id = l.post_id
LEFT JOIN users u ON l.user_id = u.id
LEFT JOIN reposts r ON r.post_id = p.id
JOIN follows f ON f.followed_id = p.user_id
WHERE f.user_id = $1
GROUP BY p.id, p.url, author

UNION

SELECT p.id,
        p.user_id,
		p.description,
		  p.url,
			  r.createdat,
    COUNT(l.post_id) AS total_likes,
	CAST(COUNT(r.post_id) AS INTEGER) AS total_reposts,
    ARRAY_AGG(u.username) AS liked_users,
    EXISTS (
        SELECT 1 
        FROM likes 
        WHERE user_id = $1
        AND post_id = p.id
        LIMIT 1
    ) AS user_liked,
    (
        SELECT jsonb_build_object('username', username, 'picture', picture_url) 
        FROM users 
        WHERE p.user_id = users.id
    ) AS author,
			  
	    (SELECT jsonb_build_object('username', username, 'id', id) 
        FROM users 
        WHERE r.user_id = users.id) AS reposted_by
			  
FROM posts p
JOIN reposts r ON r.post_id = p.id
JOIN follows f ON r.user_id = f.followed_id
LEFT JOIN likes l ON p.id = l.post_id
LEFT JOIN users u ON l.user_id = u.id
WHERE f.user_id = $1
GROUP BY p.id,r.user_id, p.url, r.createdat,author) AS subquery
ORDER BY subquery.createdat DESC 
LIMIT 20
        `;

        return db.query(query, [user_id]);
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

    likePost(user_id, post_id) {
        const query = `
        INSERT INTO
        likes (user_id, post_id)
        VALUES ($1, $2)
        `;

        return db.query(query, [
            user_id,
            post_id
        ]);
    }

    deleteLike(user_id, post_id) {
        const query = `
        DELETE 
        FROM likes 
        WHERE user_id=$1 
        AND post_id=$2
        `;
        return db.query(query, [
            user_id,
            post_id
        ]);
    }

    checkLike(user_id, post_id) {
        const query = `
        SELECT * 
        FROM likes
        WHERE user_id=$1 
        AND post_id=$2 
        `;
        return db.query(query, [
            user_id,
            post_id
        ]);
    }

    getPostsByHashTag(hashTag, user_id) {
        const query = `
        SELECT p.*, 
        COUNT(l.id) AS total_likes, 
                ARRAY(
                    SELECT unnest(array_agg(u.username)) 
                    FROM likes ll
                    JOIN users u ON ll.user_id = u.id
                    WHERE ll.post_id = p.id
                    ORDER BY RANDOM()
                    LIMIT 2
                    ) AS liked_users,
                EXISTS (
                    SELECT 1 
                    FROM likes 
                    WHERE user_id = $1
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
        WHERE t.name ILIKE $2
        GROUP BY p.id, u.username
        ORDER BY p.createdat DESC LIMIT 20`;

        return db.query(query, [
            user_id,
            hashTag
        ]);
    }

    getPostsbyIdDB(id) {
        const query = ` SELECT u.username,
        p.*,
        COUNT(l.post_id) AS total_likes, 
        ARRAY_AGG(u_liked.username) AS liked_users,
        EXISTS (
            SELECT 1 
            FROM likes 
            WHERE user_id = $1
            AND post_id = p.id
            LIMIT 1
        ) AS user_liked,
        (
            SELECT jsonb_build_object('username', username, 'picture', picture_url) 
            FROM users 
            WHERE p.user_id = users.id
        ) AS author
    FROM users u
    LEFT JOIN posts p ON u.id = p.user_id
    LEFT JOIN likes l ON p.id = l.post_id
    LEFT JOIN users u_liked ON l.user_id = u_liked.id
    LEFT JOIN trending_posts tr ON p.id = tr.post_id
    WHERE u.id = $1
    GROUP BY u.id, u.username, p.id, p.url, author
    ORDER BY p.createdat DESC 
    LIMIT 20;
        `;

        return db.query(query, [id]);
    }

    getOnePostByIdDB(id) {
        const query = `
            SELECT * FROM posts WHERE id=$1;
        `;

        return db.query(query, [id]);
    }

    deletePost(id) {
        const query = `
            DELETE FROM posts WHERE id=$1;`;

        return db.query(query, [id]);
    }

    deletePostLikes(id) {
        const query = `
            DELETE FROM likes WHERE post_id=$1;`;

        return db.query(query, [id]);
    }

    deletePostTrendings(id){
        const query = `
            DELETE FROM trending_posts WHERE post_id =$1;`;

        return db.query(query, [id]);
    }
    

    update(description, id) {
        const query = `
            UPDATE posts SET description=$1 WHERE id = $2;;
        `;
        return db.query(query, [description, id]);
    }

}

export default new PostRepository;;