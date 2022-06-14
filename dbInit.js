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
		personality.upsert({id: 1,name: 'Normal',hungerMod: 0,happinessMod: 0,cleanlinessMod: 0,sickMod: 0,special: 'Average', specialDescription: 'Battle: Averages your stats and applies it to them for the battle'}), //special
		personality.upsert({id: 2,name: 'Light Eater',hungerMod: 1.5,happinessMod: 0,cleanlinessMod: 0,sickMod: 0,special: 'Peckish', specialDescription: 'Battle: Deal an additional 2 Damage for this turn'}), //attack
		personality.upsert({id: 3,name: 'Heavy Eater',hungerMod: -1.5,happinessMod: 0,cleanlinessMod: 0,sickMod: 0,special: 'Devoure', specialDescription: 'Battle: Deal an additional 4 Damage for this turn'}), //attack
		personality.upsert({id: 4,name: 'Jolly',hungerMod: 0,happinessMod: -1.5,cleanlinessMod: 0,sickMod: 0,special: 'Cheer', specialDescription: 'Battle: Reduce opponents defense by 1 during this turn'}), //attack
		personality.upsert({id: 5,name: 'Depressed',hungerMod: 0,happinessMod: 1.5,cleanlinessMod: 0,sickMod: 0,special: 'Sob', specialDescription: 'Battle: Reduce opponents evasion by 1 during this turn'}), //attack
		personality.upsert({id: 6,name: 'Mud Lover',hungerMod: 0,happinessMod: 0,cleanlinessMod: 1.5,sickMod: 0,special: 'Dirt Cover', specialDescription: 'Battle: Increase defense by 2 during next turn'}), //defend
		personality.upsert({id: 7,name: 'Clean Freak',hungerMod: 0,happinessMod: 0,cleanlinessMod: -1.5,sickMod: 0,special: 'Slippery Scrub', specialDescription: 'Battle: Increase evasion by 2 during next turn'}), //defend
		personality.upsert({id: 8,name: 'Immune',hungerMod: 0,happinessMod: 0,cleanlinessMod: 0,sickMod: -1.5,special: 'Survivalist', specialDescription: 'Battle: Get a 1 in 6 chance to run away'}), //special
		personality.upsert({id: 9,name: 'Weak',hungerMod: 0,happinessMod: 0,cleanlinessMod: 0,sickMod: 1.5,special: 'Diseased', specialDescription: 'Battle: Deal 3 Damage over 3 turns'}), //special
		personality.upsert({id: 10,name: 'Dios Friend',hungerMod: 0,happinessMod: 0,cleanlinessMod: 0,sickMod: 0,special: 'Dios Friend', specialDescription: 'Grants you one additional life'}), //special
		personality.upsert({id: 11,name: 'Introspective',hungerMod: 0,happinessMod: 0,cleanlinessMod: 0,sickMod: 0,special: 'Book Keeping', specialDescription: 'You can see exactly what your stats are'}), //special
	]
	await Promise.all(personalities);
	console.log('Database synced');

	sequelize.close();
}).catch(console.error);