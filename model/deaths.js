module.exports = (sequelize, DataTypes) => {
	return sequelize.define('deaths', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
		},
		generation: {
			type: DataTypes.INTEGER,
		},
		cause: {
			type: DataTypes.STRING,
		},
		person: {
			type: DataTypes.STRING,
		},
		birth: {
			type: DataTypes.INTEGER,
		},
		time: {
			type: DataTypes.INTEGER,
		},
	}, {
		timestamps: false,
	});
};