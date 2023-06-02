import { db } from "../database/db.connection.js";

class TrendingsRepository {
    async createTrending(hashtag, post) {
        const firstQuery = `
            INSERT INTO trendings (name) VALUES ($1) RETURNING id;
        `;
        const secondQuery = `
            INSERT INTO trending_posts (trending_id, post_id) values($1, $2);
        `;

        const { rows } = await db.query(firstQuery, [hashtag]);
        await db.query(secondQuery, [rows[0].id, post]);
    }

    getTrendings() {
        const query = `
            SELECT t.name FROM trendings t GROUP BY t.name;
        `;
        return db.query(query);
    }

    getTrendingIdByPost(postId) {
        const query = `
            SELECT tp.trending_id, t.name 
            FROM trending_posts tp 
            JOIN trendings t ON t.id = tp.trending_id
            WHERE tp.post_id = $1;
        `;
        return db.query(query, [postId]);
    }

    async deleteTrendingById(trendingId, postId) {
        const firstQuery = `
            DELETE FROM trending_posts WHERE trending_id = $1 AND post_id = $2;
        `;

        const secondQuery = `
            DELETE FROM trendings WHERE id = $1;
        `;

        await db.query(firstQuery, [trendingId, postId]);
        await db.query(secondQuery, [trendingId]);
    }
}

export default new TrendingsRepository();