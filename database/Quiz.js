const Sequelize = require("sequelize");
const connection = require("./database");

const Quiz = connection.define("quiz", {
    age: {
        type: Sequelize.INTEGER,
        alloNull: false
    }
});

module.exports = Quiz;