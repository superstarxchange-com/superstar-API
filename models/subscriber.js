const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: "Email field must be an Email",
        },
      },
    },
  };

  const User = sequelize.define("subscriber", attributes);

  return User;
}
