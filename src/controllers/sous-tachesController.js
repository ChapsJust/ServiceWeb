const sousTacheModel = require("../models/sous-taches.Models");

exports.addSousTache = async (req, res) => {
  try {
    const { tache_id, titre, complete } = req.body;
    const nouvelleSousTache = await sousTacheModel.addSousTache(tache_id, titre, complete);
    res.status(201).json(nouvelleSousTache);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateSousTache = async (req, res) => {
  try {
    const { titre } = req.body;
    const miseAJour = await sousTacheModel.updateSousTache(req.params.id, titre);
    res.json(miseAJour);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateStatutSousTache = async (req, res) => {
  try {
    const { complete } = req.body;
    const miseAJour = await sousTacheModel.updateStatutSousTache(req.params.id, complete);
    res.json(miseAJour);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.deleteSousTache = async (req, res) => {
  try {
    await sousTacheModel.deleteSousTache(req.params.id);
    res.send("Sous-tâche supprimée avec succès.");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
