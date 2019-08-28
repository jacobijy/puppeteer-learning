import { Sequelize } from 'sequelize-typescript';
import Warship from '../model/blhx/Warships';

const sequelize = new Sequelize({
    database: 'blhx',
    host: 'localhost',
    dialect: 'mysql',
    username: 'root',
    password: '123456',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    models: [Warship]
});

(async function () {
    await sequelize.addModels([Warship]);
    await sequelize.sync();
})()

export default sequelize;
