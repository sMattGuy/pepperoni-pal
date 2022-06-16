module.exports = (sequelize, DataTypes) => {
	return sequelize.define('sleep', {
		userid: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		sleeping: {
			type: DataTypes.BOOLEAN,
			defaultValue: 0,
		},
		startDate: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		}
	}, {
		timestamps: false,
	});
};