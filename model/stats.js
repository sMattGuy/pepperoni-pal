module.exports = (sequelize, DataTypes) => {
	return sequelize.define('stats', {
		id: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
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
		fluffliness: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		cuteness: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		adoration: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
	}, {
		timestamps: false,
	});
};