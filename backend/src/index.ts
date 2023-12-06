// src/app.ts
import express from "express";
import bodyParser from "body-parser";
import config from "./config/config";
import router from "./routes/dataRoutes";
import errorHandlerMiddleware from "./middlewares/errorHandler";
import loggerMiddleware from "./middlewares/logger";

const app = express();

app.use(bodyParser.json());
// Use the loggerMiddleware for all routes
app.use(loggerMiddleware);

app.use("/api", router);

app.use(errorHandlerMiddleware);

const port = config.api.port || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
