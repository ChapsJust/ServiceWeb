const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./src/config/documentation.json");
dotenv.config();

const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

//Swagger documentation

const swaggerOptions = {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Examen API Documentation",
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

//Morgan logs pour 500 erreurs
const accessLogStream = fs.createWriteStream(path.join(__dirname, "error500.log"), { flags: "a" });

app.use(
  morgan("common", {
    skip: function (req, res) {
      return res.statusCode < 500;
    },
    stream: accessLogStream,
  })
);

//API verification
const verifierAPI = require("./src/middlewares/auth");
// Routes
const utilisateursRouter = require("./src/routes/utilisateurs.Routes");
const tachesRouter = require("./src/routes/taches.Routes");
const sousTachesRouter = require("./src/routes/sous-taches.Routes");

app.use("/taches", verifierAPI, tachesRouter);
app.use("/utilisateurs", utilisateursRouter);
app.use("/sous-taches", verifierAPI, sousTachesRouter);

app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API de l'application de gestion de contacts");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
