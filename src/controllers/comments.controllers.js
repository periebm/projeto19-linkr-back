import Comments from "../repositories/comments.repository.js";

const insertComment = async (req, res) => {
    const { content, postId } = req.body;
    const { userId } = res.locals;
    try {
        const { rows } = await Comments.create({
            content,
            userId,
            postId
        });
        res.status(201).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCommentsByPostId = async (req, res) => {
    const { id } = req.params;
    const { userId } = res.locals;
    try {
        const { rows } = await Comments.listCommentsById({ userId, id });
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default {
    insertComment,
    getCommentsByPostId
};