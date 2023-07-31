const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    nft_id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    inProcess: { type: DataTypes.INTEGER, allowNull: false },
  };

  const exclusive_pay = sequelize.define("exclusive_pay", attributes);

  return exclusive_pay;
}
