import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser } from "../repositories/users.repositories.js";

export default class AuthControllers {
  async signUp(req, res) {
    const { email, username, password, pictureUrl } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    try {
      await createUser(email, username, hashedPassword, pictureUrl);
      res.sendStatus(201);
    } catch (err) {
      if (err.code === "23505") {
        return res.status(409).send("O email fornecido já está registrado.");
      }
      res.status(500).send(err.message);
    }
  }

  async login(req, res) {
    const { userId } = res.locals;
    const secretKey = process.env.SECRET_KEY || "mySecret";
    try {
      const data = { id: userId };
      const token = jwt.sign(data, secretKey);
      res.status(200).send({ token });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}
