const Sequelize = require('sequelize');

const sequelize = new Sequelize({
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const pep = require('./model/pepperoni.js')(sequelize, Sequelize.DataTypes);
const stat = require('./model/stats.js')(sequelize, Sequelize.DataTypes);
const personality = require('./model/personality.js')(sequelize, Sequelize.DataTypes);
require('./model/deaths.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');
const alter = process.argv.includes('--alter') || process.argv.includes('-a');
sequelize.sync({ force, alter }).then(async () => {
	//update personalities
	/*
		how mods work
		mods effect how values are added to the units
		if a mods effect is positive, it adds to whatever value is being done
		if a mods effect is negative, it subtracts from whatever value is being done
		for example
		if feeding
			normal feeding is mod 0
			light eater is mod 2
			heavy eater is mod -2
			
			when eating, the value they would get is either doubled or halved
			
			for things that can vary, check the value 
			
			hunger			effects feed
			happiness		effects hourly drain of happiness
			cleanliness		effects play 
			sickness			effects play and hourly
			special will have a role in combat
	*/
	const personalities = [
		personality.create({id: 1,name: 'Normal',hungerMod: 0,happinessMod: 0,cleanlinessMod: 0,sickMod: 0,special: 'Average'}),
		personality.create({id: 2,name: 'Light Eater',hungerMod: 1.5,happinessMod: 0,cleanlinessMod: 0,sickMod: 0,special: 'Peckish'}),
		personality.create({id: 3,name: 'Heavy Eater',hungerMod: -1.5,happinessMod: 0,cleanlinessMod: 0,sickMod: 0,special: 'Devoure'}),
		personality.create({id: 4,name: 'Jolly',hungerMod: 0,happinessMod: -1.5,cleanlinessMod: 0,sickMod: 0,special: 'Cheer'}),
		personality.create({id: 5,name: 'Depressed',hungerMod: 0,happinessMod: 1.5,cleanlinessMod: 0,sickMod: 0,special: 'Sob'}),
		personality.create({id: 6,name: 'Mud Lover',hungerMod: 0,happinessMod: 0,cleanlinessMod: 1.5,sickMod: 0,special: 'Dirt Fling'}),
		personality.create({id: 7,name: 'Clean Freak',hungerMod: 0,happinessMod: 0,cleanlinessMod: -1.5,sickMod: 0,special: 'Scrub'}),
		personality.create({id: 8,name: 'Immune',hungerMod: 0,happinessMod: 0,cleanlinessMod: 0,sickMod: -1.5,special: 'Survivalist'}),
		personality.create({id: 9,name: 'Weak',hungerMod: 0,happinessMod: 0,cleanlinessMod: 0,sickMod: 1.5,special: 'Diseased'}),
		personality.create({id: 10,name: 'Dios Friend',hungerMod: 0,happinessMod: 0,cleanlinessMod: 0,sickMod: 0,special: 'Dios Friend'}),
	]
	await Promise.all(personalities);
	console.log('Database synced');

	sequelize.close();
}).catch(console.error);