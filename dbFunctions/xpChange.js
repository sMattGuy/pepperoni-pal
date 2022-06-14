const Sequelize = require('sequelize');
const Op = Sequelize.Op

const sequelize = new Sequelize({
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const pepperoni  = require('./model/pepperoni.js')(sequelize, Sequelize.DataTypes);
const stats = require('./model/stats.js')(sequelize, Sequelize.DataTypes);

remove();
async function remove(){
	const tag = await stats.update({experience:0},{where:{experience:{[Op.lt]:0}}});
	console.log(tag);
}
