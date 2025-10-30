// worker/src/config/redis.js
const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL
});

client.on('error', (err) => console.log('❌ Worker: Redis Client Error', err));
client.on('connect', () => console.log('✅ Worker: Redis Client Connected'));

const connectRedis = async () => {
  await client.connect();
};

module.exports = { client, connectRedis };