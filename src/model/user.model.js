const { DataTypes } = require('sequelize');
const db = require('../../utils/db');

const User = db.define('tbl_users', {


    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey : true,
      autoIncrement: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      
      },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }  ,
    mobile_number:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    isadmin:{
      type:DataTypes.BOOLEAN,
      allowNull: true,
    },
    company: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
          type: DataTypes.STRING,
          allowNull: true,
    },
    city: {
          type: DataTypes.STRING,
          allowNull: true,
    },
    comment: {
          type: DataTypes.STRING,
          allowNull: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
}

  } );
  
  // db.sync();
  // console.log('sss');

module.exports=  User;