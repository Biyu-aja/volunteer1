const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const sequelize = require("../config/database");

// Pemrograman Berorientasi Objek: class User meng-extend base class Model dari Sequelize,
// memiliki instance method sendiri (encapsulation of behaviour + data)
class User extends Model {
  async comparePassword(plainPassword) {
    return bcrypt.compare(plainPassword, this.password_hash);
  }

  toSafeJSON() {
    const { id, full_name, email, role, phone, avatar_url, created_at } = this;
    return { id, full_name, email, role, phone, avatar_url, created_at };
  }
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    full_name: { type: DataTypes.STRING(150), allowNull: false },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    role: {
      type: DataTypes.ENUM("volunteer", "organization", "admin"),
      defaultValue: "volunteer",
    },
    phone: { type: DataTypes.STRING(20), allowNull: true },
    avatar_url: { type: DataTypes.STRING(255), allowNull: true },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    underscored: true,
    hooks: {
      // Structured programming: alur otomatis sebelum data disimpan
      beforeCreate: async (user) => {
        if (user.password_hash) {
          user.password_hash = await bcrypt.hash(user.password_hash, 10);
        }
      },
    },
  }
);

module.exports = User;
