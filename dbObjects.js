const Sequelize = require('sequelize');

const sequelize = new Sequelize({
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const pepperoni = require('./model/pepperoni.js')(sequelize, Sequelize.DataTypes);
const deaths = require('./model/deaths.js')(sequelize, Sequelize.DataTypes);

module.exports = { pepperoni, deaths };