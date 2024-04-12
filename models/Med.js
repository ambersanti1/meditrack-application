const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Med extends Model {}

Med.init(
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
    dia: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hora: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    progress: {
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
    modelName: "med",
  }
);

module.exports = Med;

/* PSEUDOCODIGO
Create model to save data (medicine_name, disease, dia, hora and progress)
Save data in fechas array in the database
Create route to post cards
fetch cards to be displayed 

*/