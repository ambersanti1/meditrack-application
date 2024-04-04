const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Medication extends Model {}

Medication.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    medicine_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    disease: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_hour: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    frequency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id",
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "medication",
  }
);

module.exports = Medication;
