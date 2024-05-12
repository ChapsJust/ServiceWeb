const TacheModel = require("../models/taches.Models");
const sousTachesModel = require("../models/sous-taches.Models");
const utilisateurModel = require("../models/utilisateurs.Models");

exports.getAllTaches = async (req, res) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Authorization header is required" });
    }

    const cle_api = req.headers.authorization.split(" ")[1];

    const result = await TacheModel.getAllTaches(cle_api);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: " + error.message });
  }
};

exports.getNonComplete = async (req, res) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Authorization header is required" });
    }

    const cle_api = req.headers.authorization.split(" ")[1];

    const result = await TacheModel.getNonComplete(cle_api);
    if (result.rows.length === 0) {
      res.status(404).json({ message: "No incomplete tasks found" });
    } else {
      res.status(200).json(result.rows);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: " + error.message });
  }
};

exports.getTacheById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await TacheModel.getTacheById(id);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Tâche non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: " + error.message });
  }
};

exports.getTacheDetails = async (req, res) => {
  const tacheId = req.params.id;
  try {
    const tache = await TacheModel.getTacheById(tacheId);
    if (!tache.rows.length) {
      return res.status(404).send("Tâche non trouvée");
    }
    const tacheDetails = tache.rows[0];

    const sousTachesResult = await sousTachesModel.getSousTachesByTacheId(tacheId);
    const sousTaches = sousTachesResult.rows || [];

    res.json({
      tacheId: tacheDetails.tache_id,
      titre: tacheDetails.titre,
      description: tacheDetails.description,
      dateDebut: tacheDetails.date_debut,
      dateEcheance: tacheDetails.date_echeance,
      complete: tacheDetails.complete,
      sousTaches: sousTaches,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.addTache = async (req, res) => {
  try {
    const { titre, description, dateDebut, dateEcheance, complete } = req.body;
    const utilisateurId = await utilisateurModel.getUserByApi(req.headers.authorization.split(" ")[1]);
    const result = await TacheModel.addTache(titre, description, utilisateurId, dateDebut, dateEcheance, complete);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: " + error.message });
  }
};

exports.updateTache = async (req, res) => {
  try {
    const { id } = req.params;
    const utilisateurWithApi = await utilisateurModel.getUserByApi(req.headers.authorization.split(" ")[1]);
    const utilisateurIdTache = await TacheModel.getTacheById(id);

    if (utilisateurWithApi != utilisateurIdTache.rows[0].utilisateur_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { titre, description, dateDebut, dateEcheance } = req.body;
    const result = await TacheModel.updateTache(id, titre, description, dateDebut, dateEcheance);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Tâche non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: " + error.message });
  }
};

exports.deleteTache = async (req, res) => {
  try {
    const { id } = req.params;
    const utilisateurWithApi = await utilisateurModel.getUserByApi(req.headers.authorization.split(" ")[1]);
    const utilisateurIdTache = await TacheModel.getTacheById(id);

    if (!utilisateurIdTache.rows[0]) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    if (utilisateurWithApi != utilisateurIdTache.rows[0].utilisateur_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await TacheModel.deleteTache(id);

    if (result > 0) {
      return res.status(404).json({ message: "Aucune tâche trouvée" });
    } else {
      return res.status(200).send();
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: " + error.message });
  }
};

exports.updateTacheStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { complete } = req.body;
    const result = await TacheModel.updateTacheStatus(id, complete);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Tâche non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error: " + error.message });
  }
};
