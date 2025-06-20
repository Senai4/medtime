const Sequelize = require("sequelize");

const connection = new Sequelize("medtime", "root", "26ZK10q2", {
    host: "localhost",
    dialect: "mysql"
});

module.exports = connection;