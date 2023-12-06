import Redis from "ioredis";
import config from "../config/config";

class RedisClient {
  private static instance: Redis | null = null;

  private constructor() {}

  public static getInstance(): Redis {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis(config.redis);
    }
    return RedisClient.instance;
  }
}

const redisInstance = RedisClient.getInstance();
export default redisInstance;
