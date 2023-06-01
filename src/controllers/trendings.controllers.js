import TrendingsRepository from "../repositories/trendings.repository.js";

export async function getTrendings(req, res) {
    try {
        const trendings = await TrendingsRepository.getTrendings();
        res.status(200).send(trendings.rows);
    } catch (err) {
        res.status(500).json(err.message);
    }
}
