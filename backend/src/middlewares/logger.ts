import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

const logsDirectory = path.join(__dirname, "../logs"); // Adjust the path as needed

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const logFilePath = path.join(logsDirectory, "app.log");

  // Log to console
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);

  // Log to file
  fs.appendFile(
    logFilePath,
    `${new Date().toISOString()} - ${req.method} ${req.path}\n`,
    (err) => {
      if (err) {
        console.error("Error writing to log file:", err);
      }
    }
  );

  next();
};

export default loggerMiddleware;
