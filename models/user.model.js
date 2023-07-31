const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      reuired: true,
      primaryKey: true,
    },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    mobile_number: { type: DataTypes.STRING, allowNull: false },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: "Email field must be an Email",
        },
      },
    },
    hash: { type: DataTypes.STRING, allowNull: false },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      required: true,
    },
    secret_key: { type: DataTypes.STRING(310), allowNull: false },
    pkh: { type: DataTypes.STRING, allowNull: false },
  };

  const options = {
    defaultScope: {
      attributes: { exclude: ["hash"] },
    },
    scopes: {
      withHash: { attributes: {} },
    },
  };

  const User = sequelize.define("User", attributes, options);

  User.associate = (models) => {
    User.hasMany(models.Transaction, {
      foreignKey: "id",
      as: "transactionId",
    });

    User.hasOne(models.Wallet, {
      foreignKey: "id",
      as: "walletId",
    });
  };
  return User;
}
