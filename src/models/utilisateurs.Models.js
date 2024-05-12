const pool = require("../config/db_pg");
const { v4: uuidv4 } = require("uuid");

exports.createUser = (nom, prenom, courriel, password) => {
  return new Promise((resolve, reject) => {
    const apiKey = uuidv4();
    const query = "INSERT INTO utilisateur (nom, prenom, courriel, password, cle_api) VALUES ($1, $2, $3, $4, $5) RETURNING cle_api";
    pool
      .query(query, [nom, prenom, courriel, password, apiKey])
      .then((result) => {
        resolve(result.rows[0].cle_api);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.validationCle = (cleApi) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT COUNT(*) AS count FROM utilisateur WHERE cle_api = $1";
    const params = [cleApi];

    pool
      .query(query, params)
      .then((result) => {
        resolve(parseInt(result.rows[0].count, 10) > 0);
      })
      .catch((error) => {
        console.error(`Error when executing SQL: ${error.message}`);
        reject(error);
      });
  });
};

exports.findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT utilisateur_id, password FROM utilisateur WHERE courriel = $1";
    pool
      .query(query, [email])
      .then((result) => {
        if (result.rows.length > 0) {
          resolve(result.rows[0]);
        } else {
          resolve(null);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.updateApiKey = (userId, apiKey) => {
  return new Promise((resolve, reject) => {
    const query = "UPDATE utilisateur SET cle_api = $1 WHERE utilisateur_id = $2 RETURNING cle_api";
    pool
      .query(query, [apiKey, userId])
      .then((result) => {
        resolve(result.rows[0].cle_api);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.getUserByApi = (cleApi) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT utilisateur_id FROM utilisateur WHERE cle_api = $1";
    pool
      .query(query, [cleApi])
      .then((result) => {
        if (result.rows.length > 0) {
          resolve(result.rows[0].utilisateur_id);
        } else {
          resolve(null);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
