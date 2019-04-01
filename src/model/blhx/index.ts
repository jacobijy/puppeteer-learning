import * as Sequelize from 'sequelize';
import './Warships';

const blhxDB = new Sequelize('blhx', 'blhx', '198925', {
    host: 'localhost',
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    operatorsAliases: false
});

blhxDB.sync();

export default blhxDB;
