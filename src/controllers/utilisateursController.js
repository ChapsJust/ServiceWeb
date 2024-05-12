// src/controllers/utilisateursController.js
const UserModel = require("../models/utilisateurs.Models");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  try {
    const { nom, prenom, courriel, password } = req.body;
    const passwordHash = bcrypt.hashSync(password, 10);
    const apiKey = await UserModel.createUser(nom, prenom, courriel, passwordHash);
    res.status(201).json({ apiKey });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: " + error.message });
  }
};

exports.generateApiKey = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const newApiKey = uuidv4();
    const updatedApiKey = await UserModel.updateApiKey(user.utilisateur_id, newApiKey);
    res.json({ apiKey: updatedApiKey });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
