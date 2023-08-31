require("dotenv").config({ path: "./.env.local", override: true });

const express = require("express");

const app = express();

const cors = require("cors");

const { logger } = require("./src/app.helper.js");
const { sequelize } = require("./src/app.dbconfig.js");

const { after } = require("./src/app.middleware.js");

app.use(cors());
app.use(express.json());

app.use("/api", require("./src/app.routes.js"));

app.use(after.routeNotFound);
app.use(after.errorMiddleware);

const port = process.env.api_port;

sequelize
  .authenticate()
  .then(() => {
    sequelize.sync({ alter: true }).then(() => {
      app.listen(port, logger(`Now Serving :${port}`));
    });
  })
  .catch((err) => {
    logger("Database Connection Failed", err);
  });
