const { Sequelize, DataTypes } = require('sequelize');
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
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
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
      allowNull: false,
    },
    isadmin:{
      type:DataTypes.BOOLEAN,
      allowNull: true,
    },
    company: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
          type: DataTypes.STRING,
          allowNull: false,
    },
    city: {
          type: DataTypes.STRING,
          allowNull: false,
    },
    comment: {
          type: DataTypes.STRING,
          allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
}

  } );
  
  db.sync();
  console.log('sss');

module.exports=  User;