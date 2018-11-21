import * as Redis from 'ioredis';
import logger from '../log4js';

const client  = new Redis({
    port: 6379,
    host: '127.0.0.1',
    password: '123456'
});

// redis.
// client.Promise
client.on('error', (err: Error) => {
    if (err) {
        logger().error('connect to redis error, check your redis config', err);
        // logger('default').error('connect to redis error, check your redis config', err);
        process.exit(1);
    }
});

export default client;
