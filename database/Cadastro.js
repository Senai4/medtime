const Sequelize = require("sequelize");
const connection = require("./database");

const Cadastro = connection.define("cadastro", {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Cadastro;