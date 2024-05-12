const pool = require("../config/db_pg");

exports.addSousTache = (tacheId, titre, complete) => {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO sous_taches (tache_id, titre, complete) VALUES ($1, $2, $3) RETURNING *";
    pool
      .query(query, [tacheId, titre, complete])
      .then((result) => resolve(result.rows[0]))
      .catch((error) => reject(error));
  });
};

exports.getSousTachesByTacheId = (tacheId) => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM sous_taches WHERE tache_id = $1", [tacheId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

exports.updateSousTache = (id, titre) => {
  return new Promise((resolve, reject) => {
    const query = "UPDATE sous_taches SET titre = $1 WHERE sous_taches_id = $2 RETURNING *";
    pool
      .query(query, [titre, id])
      .then((result) => resolve(result.rows[0]))
      .catch((error) => reject(error));
  });
};

exports.updateStatutSousTache = (id, complete) => {
  return new Promise((resolve, reject) => {
    const query = "UPDATE sous_taches SET complete = $1 WHERE sous_taches_id = $2 RETURNING *";
    pool
      .query(query, [complete, id])
      .then((result) => resolve(result.rows[0]))
      .catch((error) => reject(error));
  });
};

exports.deleteSousTache = (id) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM sous_taches WHERE sous_taches_id = $1";
    pool
      .query(query, [id])
      .then((result) => resolve(result.rowCount))
      .catch((error) => reject(error));
  });
};
