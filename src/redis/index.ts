import * as Redis from 'ioredis';

const client  = new Redis({
    port: 6379,
    host: '127.0.0.1',
    db: 0,
    password: '123456'
});
// redis.
