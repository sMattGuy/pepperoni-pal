const Sequelize = require('sequelize');

const sequelize = new Sequelize({
	dialect: 'sqlite',
	logging: false,
	storage: '../database.sqlite',
});

const pepperoni  = require('../model/pepperoni.js')(sequelize, Sequelize.DataTypes);
remove();
async function remove(){
	const tag = await pepperoni.update({gaming:0},{where:{gaming:1}});
	console.log(tag);
}
