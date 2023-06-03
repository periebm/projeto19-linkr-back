import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { db } from "../database/db.connection.js";
import { findUserForLogin } from "../repositories/users.repositories.js";
import { compareSync } from "bcrypt";

export async function authValidate(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  if (!token) return res.sendStatus(401);

  dotenv.config();
  const secretKey = process.env.SECRET_KEY || "mySecret";

  try {
    const data = jwt.verify(token, secretKey);

    const session = await db.query(`SELECT * FROM users WHERE id=$1`, [data.id]);
    if (session.rows.length === 0) return res.status(401).send("Sessao nao encontrada");
    res.locals.session = session;
    res.locals.userId = session.rows[0].id;

    next();
  } catch (err) {
    if (err.message === "invalid signature" || "invalid token") {
      return res.status(401).send("Token invalido");
    }
    res.status(500).json(err.message);
  }
}

export async function loginValidate(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await findUserForLogin(email);
    if (!user) return res.sendStatus(401);

    const isValidPassword = compareSync(password, user.hashedPassword);
    if (!isValidPassword) return res.sendStatus(401);

    res.locals.userId = user.userId;
    res.locals.pictureUrl = user.picture_url;
    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
}
