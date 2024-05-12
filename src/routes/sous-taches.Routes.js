const express = require("express");
const router = express.Router();
const soustacheController = require("../controllers/sous-tachesController");
const verifyApiKey = require("../middlewares/auth");

router.post("/ajouter", soustacheController.addSousTache);

router.put("/update/:id", soustacheController.updateSousTache);

router.put("/statut/:id", soustacheController.updateStatutSousTache);

router.delete("/delete/:id", soustacheController.deleteSousTache);

module.exports = router;
