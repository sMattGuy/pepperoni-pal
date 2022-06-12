module.exports = (sequelize, DataTypes) => {
	return sequelize.define('personality', {
		id: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
		},
		hungerMod: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		happinessMod: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		cleanlinessMod: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		sickMod: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		special: {
			type: DataTypes.STRING,
			defaultValue: "Normal",
		},
		specialDescription: {
			type: DataTypes.STRING,
			defaultValue: "matt forgor to put something",
		}
	}, {
		timestamps: false,
	});
};