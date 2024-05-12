const express = require("express");
const router = express.Router();
const tacheController = require("../controllers/tachesController");
const verifyApiKey = require("../middlewares/auth");

router.get("/all", tacheController.getAllTaches);

router.get("/", tacheController.getNonComplete);

router.get("/:id/details", tacheController.getTacheDetails);

router.post("/ajouter", tacheController.addTache);

router.put("/update/:id", tacheController.updateTache);

router.put("/statut/:id", tacheController.updateTacheStatus);

router.delete("/delete/:id", tacheController.deleteTache);

module.exports = router;
