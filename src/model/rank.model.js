const { DataTypes } = require('sequelize')
const db = require('../../utils/db');

const Rank = db.define('tbl_ranks', {
    id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        primaryKey : true,
        autoIncrement : true,
        field : 'id_rank'
    },
    fiveStar : {
        type : DataTypes.INTEGER,
        field : 'fiveStar',
        allowNull : true,
        defaultValue : 0
    },
    fourStar : {
        type : DataTypes.INTEGER,
        field : 'fourStar',
        allowNull : true,
        defaultValue : 0
    },
    threeStar : {
        type : DataTypes.INTEGER,
        field : 'threeStar',
        allowNull : true,
        defaultValue : 0
    },
    twoStar : {
        type : DataTypes.INTEGER,
        field : 'twoStar',
        allowNull : true,
        defaultValue : 0
    },
    oneStar : {
        type : DataTypes.INTEGER,
        field : 'oneStar',
        allowNull : true,
        defaultValue : 0
    },
    rate : {
        type : DataTypes.FLOAT,
        field : 'rate',
        allowNull : true,
        defaultValue : 0
    }
})

Rank.sync({alter : true})

module.exports = Rank;