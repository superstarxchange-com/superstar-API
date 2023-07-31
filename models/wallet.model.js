const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id:{type:DataTypes.UUID,defaultValue:DataTypes.UUIDV4,required:true,primaryKey:true},
        customerId: { type: DataTypes.UUID,required:true},
        accountNumber: { type: DataTypes.DOUBLE, allowNull: false ,required:true,unique:true},
        balance:{type:DataTypes.DOUBLE,allowNull:false,required:true},
        type:{type:DataTypes.ENUM(['customer','admin']),required:true,defaultValue:'customer'}
    };

    const options = {
        defaultScope: {
            
            attributes: { exclude: ['hash'] }
        },
        scopes: {
            
            withHash: { attributes: {}, }
        }
    };

    const Wallet= sequelize.define('Wallet', attributes, options);

    Wallet.associate=(models)=>{
        Wallet.belongsTo(models.User, {
            foreignKey: 'customerId',
            
          });
      
          Wallet.hasMany(models.Transaction, {
            foreignKey: 'accountNumber',
            
          });   
    }
    return Wallet;
}