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
    token: { type: DataTypes.STRING, allowNull: false },
  };

  const changePass = sequelize.define("changePassword", attributes);

  return changePass;
}
