const Sequelize = require("sequelize");
const connection = require("./database");

const Curiosidades = connection.define("curiosidades", {
    texto: {
        type: Sequelize.STRING,
        alloNull: false
    }
});

module.exports = Curiosidades;