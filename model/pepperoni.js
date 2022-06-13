module.exports = (sequelize, DataTypes) => {
	return sequelize.define('pepperoni', {
		userid: {
			type: DataTypes.STRING,
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
			defaultValue: 0,
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
		personality: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
		},
		gaming: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
	}, {
		timestamps: false,
	});
};
