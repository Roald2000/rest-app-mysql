const { sequelize } = require("../app.dbconfig");

const { DataTypes } = require("sequelize");
const { uniq_id } = require("../app.helper");

const User = sequelize.define(
  "use_tbl",
  {
    user_id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      unique: true,
      allowNull: false,
      defaultValue: uniq_id,
    },
    username: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(["User", "Admin", "Guest"]),
      defaultValue: "User",
      allowNull: false,
    },
    is_activated: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0, // 0 not activated, 1 activated
      allowNull: false,
    },
  },
  { tableName: "", timestamps: true, freezeTableName: true }
);

const BlackList = sequelize.define(
  "blacklist",
  {
    t_id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      unique: true,
      defaultValue: uniq_id,
    },
    blacklisted_token: {
      type: DataTypes.TEXT("long"),
      unique: true,
    },
  },
  { tableName: "blacklist", timestamps: true }
);

module.exports = { User, BlackList };
