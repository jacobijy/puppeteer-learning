import  {Sequelize} from 'sequelize';
import './Warships';

const blhxDB = new Sequelize('blhx', 'blhx', '198925', {
    host: 'localhost',
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

blhxDB.sync();

export default blhxDB;