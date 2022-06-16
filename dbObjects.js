const Sequelize = require('sequelize');

const sequelize = new Sequelize({
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const pepperoni = require('./model/pepperoni.js')(sequelize, Sequelize.DataTypes);
const deaths = require('./model/deaths.js')(sequelize, Sequelize.DataTypes);
const stats = require('./model/stats.js')(sequelize, Sequelize.DataTypes);
const personality = require('./model/personality.js')(sequelize, Sequelize.DataTypes);
const sleep = require('./model/sleep.js')(sequelize, Sequelize.DataTypes);

Reflect.defineProperty(pepperoni.prototype, 'getStats', {
	value: async pepperoniTag => {
		let statsFound = await stats.findOne({where:{userid: pepperoniTag.userid}});
		if(statsFound){
			return statsFound;
		}
		return stats.create({
			userid:pepperoniTag.userid,
			level:1,
			experience:0,
			nextLevel:20,
			attack:0,
			defense:0,
			evade:0
		});
	},
});
Reflect.defineProperty(pepperoni.prototype, 'setStats', {
	value: async (pepperoniTag, newStats) => {
		const currStats = await stats.findOne({where:{userid:pepperoniTag.userid}});
		if(currStats){
			currStats.level = newStats.level;
			currStats.experience = newStats.experience;
			currStats.nextLevel = newStats.nextLevel;
			currStats.attack = newStats.attack;
			currStats.defense = newStats.defense;
			currStats.evade = newStats.evade;
			return currStats.save();
		}
		return stats.create({
			userid:pepperoniTag.userid,
			level:newStats.level,
			experience:newStats.experience,
			nextLevel:newStats.nextLevel,
			attack:newStats.attack,
			defense:newStats.defense,
			evade:newStats.evade
		});
	},
});

Reflect.defineProperty(pepperoni.prototype, 'getPersonality', {
	value: async pepperoniTag => {
		return await personality.findOne({where:{id:pepperoniTag.personality}});
	},
});
Reflect.defineProperty(pepperoni.prototype, 'setPersonality', {
	value: async pepperoniTag => {
		const count = await personality.count({col: 'id'});
		pepperoniTag.personality = Math.floor(Math.random()*count)+1;
		return pepperoniTag.save();
	},
});

Reflect.defineProperty(pepperoni.prototype, 'startSleeping', {
	value: async pepperoniTag => {
		let sleepTag = await sleep.findOne({where:{userid: pepperoniTag.userid}});
		if(!sleepTag){
			sleepTag = await sleep.create({
				userid: pepperoniTag.userid,
				sleeping: 1,
				startDate: Date.now(),
			});
		}
		else{
			sleepTag.sleeping = 1;
			sleepTag.startDate = Date.now();
			sleepTag.save();
		}
		return setTimeout(function(){
			sleepTag.sleeping = 0;
			sleepTag.save();
		},21600000);
	},
});

Reflect.defineProperty(pepperoni.prototype, 'checkSleeping', {
	value: async pepperoniTag => {
		let sleepTag = await sleep.findOne({where:{userid: pepperoniTag.userid}});
		if(!sleepTag){
			sleepTag = await sleep.create({
				userid: pepperoniTag.userid,
				sleeping: 0,
				startDate: 0,
			});
		}
		return {'sleep':sleepTag.sleeping, 'time':sleepTag.startDate};
	},
});
module.exports = { pepperoni, deaths, stats, personality, sleep };
