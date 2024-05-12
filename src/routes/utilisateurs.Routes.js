// src/routes/utilisateursRoutes.js
const express = require("express");
const router = express.Router();
const utilisateursController = require("../controllers/utilisateursController");

router.post("/create", utilisateursController.createUser);

router.post("/generateApiKey", utilisateursController.generateApiKey);

module.exports = router;
