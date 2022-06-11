module.exports = (sequelize, DataTypes) => {
	return sequelize.define('stats', {
		userid: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		level: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		experience: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		nextLevel: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		attack: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		defense: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		evade: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
	}, {
		timestamps: false,
	});
};