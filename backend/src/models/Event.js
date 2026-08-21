const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Event extends Model {
  // OOP: behaviour yang menyatu dengan entity Event itu sendiri
  remainingQuota(approvedCount) {
    return Math.max(this.quota - approvedCount, 0);
  }

  isFull(approvedCount) {
    return this.remainingQuota(approvedCount) === 0;
  }
}

Event.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    organization_id: { type: DataTypes.INTEGER, allowNull: false },
    category_id: { type: DataTypes.INTEGER, allowNull: true },
    title: { type: DataTypes.STRING(180), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    location: { type: DataTypes.STRING(255), allowNull: false },
    quota: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10 },
    event_date: { type: DataTypes.DATEONLY, allowNull: false },
    start_time: { type: DataTypes.TIME, allowNull: false },
    end_time: { type: DataTypes.TIME, allowNull: false },
    status: {
      type: DataTypes.ENUM("draft", "published", "closed", "completed"),
      defaultValue: "published",
    },
  },
  {
    sequelize,
    modelName: "Event",
    tableName: "events",
    underscored: true,
  }
);

module.exports = Event;
