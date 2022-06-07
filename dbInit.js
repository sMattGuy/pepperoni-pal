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
	
	await pep.upsert({"activePepperoni":1,"alive":0,"name":"missingno","generation":0,"startDate":0,"hunger":0,"happiness":0,"cleanliness":0,"sick":0});
	
	console.log('Database synced');

	sequelize.close();
}).catch(console.error);