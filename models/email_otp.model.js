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
    otp: { type: DataTypes.STRING, allowNull: false },
  };

  const email_otp = sequelize.define("email_otp", attributes);

  return email_otp;
}
