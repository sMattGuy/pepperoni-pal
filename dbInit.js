const Sequelize = require('sequelize');

const sequelize = new Sequelize({
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const pep = require('./model/pepperoni.js')(sequelize, Sequelize.DataTypes);
require('./model/deaths.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	
	console.log('Database synced');

	sequelize.close();
}).catch(console.error);