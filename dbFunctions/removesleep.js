const Sequelize = require('sequelize');
const Op = Sequelize.Op

const sequelize = new Sequelize({
	dialect: 'sqlite',
	logging: false,
	storage: '../database.sqlite',
});

const sleep = require('../model/sleep.js')(sequelize, Sequelize.DataTypes);
remove();
async function remove(){
	const tag = await sleep.update({sleeping:0},{where:{sleeping:1}});
	console.log(tag);
}
