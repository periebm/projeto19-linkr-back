import { db } from "../database/db.connection.js";

class TrendingsRepository {
    async createTrending(hashtag, post) {
        const firstQuery = `
            INSERT INTO trendings (name) VALUES ($1) RETURNING id;
        `;
        const secondQuery = `
            INSERT INTO trending_posts (trending_id, post_id) values($1, $2);
        `;

        const { rows } = await db.query(firstQuery, [hashtag])
        await db.query(secondQuery, [rows[0].id, post]);
    }
}

export default new TrendingsRepository();