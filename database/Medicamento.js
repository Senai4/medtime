const Sequelize = require("sequelize");
const connection = require("./database");

const Medicamento = connection.define("medicamentos", {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descrição: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Medicamento;