const Sequelize = require("sequelize");
const connection = require("./database");

const Usuario = connection.define("usuarios", {
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Usuario;