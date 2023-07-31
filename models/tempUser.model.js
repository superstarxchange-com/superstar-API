const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: "Email field must be an Email",
        },
      },
    },
    password: { type: DataTypes.STRING, allowNull: false },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      required: true,
    },
  };

  const User = sequelize.define("tempUser", attributes);

  return User;
}
