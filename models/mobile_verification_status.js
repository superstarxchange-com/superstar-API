const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    mobile_number: { type: DataTypes.STRING, allowNull: false },
    otp: { type: DataTypes.STRING, allowNull: false },
  };

  const mobile_verification_status = sequelize.define(
    "mobile_verification_status",
    attributes
  );

  return mobile_verification_status;
}
