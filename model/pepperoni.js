module.exports = (sequelize, DataTypes) => {
	return sequelize.define('pepperoni', {
		activePepperoni: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		alive: {
			type: DataTypes.BOOLEAN,
		},
		name: {
			type: DataTypes.STRING,
		},
		generation: {
			type: DataTypes.INTEGER,
		},
		startDate: {
			type: DataTypes.INTEGER,
		},
		hunger: {
			type: DataTypes.INTEGER,
		},
		happiness: {
			type: DataTypes.INTEGER,
		},
		cleanliness: {
			type: DataTypes.INTEGER,
		},
		sick: {
			type: DataTypes.INTEGER,
		},
	}, {
		timestamps: false,
	});
};