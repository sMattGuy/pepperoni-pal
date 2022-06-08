const Sequelize = require('sequelize');

const sequelize = new Sequelize({
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const death = require('./model/deaths.js')(sequelize, Sequelize.DataTypes);
remove();
async function remove(){
	const tag = await death.destroy({where:{id: 1}})
	if(tag)
		console.log(`removed ${tag} rows`)
	else
		console.log(`nothing removed`)
}
