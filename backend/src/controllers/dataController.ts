import { Request, Response } from "express";
import redisInstance from "../models/redisModel";
import dataSchema from "../schemas/dataSchema";
import validateMiddleware from "../middlewares/validation";
import errorHandlerMiddleware from "../middlewares/errorHandler";

const dataController = {
  getAllData: async (req: Request, res: Response) => {
    try {
      // Retrieve all user keys
      const userKeys = await redisInstance.keys("user:*");

      //logic Retrieve user data for each key
      const userData = await Promise.all(
        userKeys.map(async (key) => await redisInstance.hgetall(key))
      );

      res.status(200).json(userData);
    } catch (error) {
      // Handle errors
      errorHandlerMiddleware(error, req, res, () => {});
    }
  },

  getDataById: async (req: Request, res: Response) => {
    try {
      // Extract the ID from the req
      const { id } = req.params;

      // logic to getUser by their ids
      const userData = await redisInstance.hgetall(`user:${id}`);
      if (userData && Object.keys(userData).length > 0) {
        res.status(200).json(userData);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      // Handle errors
      errorHandlerMiddleware(error, req, res, () => {});
    }
  },

  createData: async (req: Request, res: Response) => {
    try {
      // Validate request data using Joi middleware
      // validateMiddleware(dataSchema)(req, res, () => {});
      const validate = validateMiddleware(dataSchema);
      await validate(req, res, () => {});

      // Extract validated data from the req
      const { name, age } = req.body;

      // Generate an auto-incrementing user ID for the update,delete purpose
      const userId = await redisInstance.incr("userCounter");

      //logic for Store user data in Redis Hash
      await redisInstance.hmset(`user:${userId}`, "name", name, "age", age);

      res.status(201).json({ userId, message: "User created successfully" });
    } catch (error) {
      // Handle errors
      errorHandlerMiddleware(error, req, res, () => {});
    }
  },

  updateData: async (req: Request, res: Response) => {
    try {
      // Extract the ID from the req
      const { id } = req.params;

      // Validate request data using Joi middleware
      const validate = validateMiddleware(dataSchema);
      await validate(req, res, () => {});

      // Extract validated data from the req
      const { name, age } = req.body;

      // Check if the user data exists
      const userExists = await redisInstance.exists(`user:${id}`);
      if (userExists) {
        //logic for Update user data in Redis Hash if the user exist
        await redisInstance.hmset(`user:${id}`, "name", name, "age", age);

        res.status(200).json({ id, message: "User updated successfully" });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      // Handle errors
      errorHandlerMiddleware(error, req, res, () => {});
    }
  },

  deleteData: async (req: Request, res: Response) => {
    try {
      // Extract the ID from the req
      const { id } = req.params;

      //logic to delete data from Redis
      const deletedCount = await redisInstance.del(`user:${id}`);

      if (deletedCount === 1) {
        res.status(200).json({ id, message: "User deleted successfully" });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      // Handle errors
      errorHandlerMiddleware(error, req, res, () => {});
    }
  },
};

export default dataController;
