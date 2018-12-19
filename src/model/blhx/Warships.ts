import * as Sequelize from 'sequelize';
import sequelize from '../../mysql';

const Warship = sequelize.define('warship', {
    shipname: Sequelize.STRING,
    
})
