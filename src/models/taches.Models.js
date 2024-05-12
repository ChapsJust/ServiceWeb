const pool = require("../config/db_pg");

exports.getAllTaches = (cle_api) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT t.* FROM taches t
      JOIN utilisateur u ON t.utilisateur_id = u.utilisateur_id
      WHERE u.cle_api = $1;
    `;
    pool
      .query(query, [cle_api])
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

exports.getNonComplete = (cle_api) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT t.* FROM taches t
      JOIN utilisateur u ON t.utilisateur_id = u.utilisateur_id
      WHERE u.cle_api = $1 AND t.complete <> 1;
    `;
    pool
      .query(query, [cle_api])
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

exports.getTacheById = (id) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM taches WHERE tache_id = $1";
    pool
      .query(query, [id])
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

exports.addTache = (titre, description, utilisateurId, dateDebut, dateEcheance, complete) => {
  return new Promise((resolve, reject) => {
    const query = `
        INSERT INTO taches (titre, description, utilisateur_id, date_debut, date_echeance, complete) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *;
      `;
    pool
      .query(query, [titre, description, utilisateurId, dateDebut, dateEcheance, complete])
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

exports.updateTache = (id, titre, description, dateDebut, dateEcheance) => {
  return new Promise((resolve, reject) => {
    const query = "UPDATE taches SET titre = $1, description = $2, date_debut = $3, date_echeance = $4 WHERE tache_id = $5 RETURNING *";
    pool
      .query(query, [titre, description, dateDebut, dateEcheance, id])
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

exports.deleteTache = (id) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM taches WHERE tache_id = $1";
    pool
      .query(query, [id])
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

exports.updateTacheStatus = (id, statut) => {
  return new Promise((resolve, reject) => {
    const query = "UPDATE taches SET complete = $1 WHERE tache_id = $2 RETURNING *";
    pool
      .query(query, [statut, id])
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};
