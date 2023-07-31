const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id:{type:DataTypes.UUID,defaultValue:DataTypes.UUIDV4,required:true,primaryKey:true},
        customerId: { type: DataTypes.UUID,required:true},
        
        amount:{type:DataTypes.DOUBLE,required:true},
        reference:{
            type:DataTypes.STRING,required:true
        }
        
    };

    const options = {
        defaultScope: {
            
            attributes: { exclude: ['hash'] }
        },
        scopes: {
            
            withHash: { attributes: {}, }
        }
    };

    const Funding= sequelize.define('Funding', attributes, options);

    Funding.associate=(models)=>{
        Funding.belongsTo(models.User, {
            foreignKey: 'customerId',
            
          });
      
          
    }
    return Funding;
}