import * as Sequelize from 'sequelize';

const sequelize = new Sequelize('blhx', 'blhx', '198925', {
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

const User = sequelize.define('user', {
    username: Sequelize.STRING,
    birthday: Sequelize.DATE
});

(async function () {
    await sequelize.sync();
    let jane = await User.create({
        username: 'janedoe',
        birthday: new Date(1980, 6, 20)
    });
    console.log(JSON.stringify(jane));
})()


export default sequelize;
