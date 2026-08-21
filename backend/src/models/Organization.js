const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Organization extends Model {}

Organization.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    org_name: { type: DataTypes.STRING(150), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    address: { type: DataTypes.STRING(255), allowNull: true },
    is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    sequelize,
    modelName: "Organization",
    tableName: "organizations",
    underscored: true,
  }
);

module.exports = Organization;
