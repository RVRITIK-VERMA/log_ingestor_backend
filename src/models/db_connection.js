require('dotenv').config();
const {Sequelize}= require('sequelize');

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DBNAME,
    // Other options as needed
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//exporting connection to other files
module.exports = db;
