import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('blhx', 'blhx', '198925', {
    host: 'localhost',
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

(async function () {
    await sequelize.sync();
})()

export default sequelize;
