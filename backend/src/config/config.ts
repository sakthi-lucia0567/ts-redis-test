import dotenv from "dotenv";
dotenv.config();

export default {
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
  },
  api: {
    port: process.env.PORT || 3000,
  },
};
