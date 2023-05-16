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

Reflect.defineProperty(pepperoni.prototype, 'getStats', {
	value: async pepperoniTag => {
		let statsFound = await stats.findOne({where:{id: 1}});
		if(statsFound){
			return statsFound;
		}
		return stats.create({
			id:1,
			level:1,
			experience:0,
			nextLevel:20,
			fluffliness:0,
			cuteness:0,
			adoration:0
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
			currStats.fluffliness = newStats.fluffliness;
			currStats.cuteness = newStats.cuteness;
			currStats.adoration = newStats.adoration;
			return currStats.save();
		}
		return stats.create({
			userid:pepperoniTag.userid,
			level:newStats.level,
			experience:newStats.experience,
			nextLevel:newStats.nextLevel,
			fluffliness:newStats.fluffliness,
			cuteness:newStats.cuteness,
			adoration:newStats.adoration
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


module.exports = { pepperoni, deaths, stats, personality };
