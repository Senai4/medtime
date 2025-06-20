const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

// Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão com DB com sucesso");
    })
    .catch((erro) => {
        console.log("Erro ao conectar com o banco: ", erro);
    });

// Importando Models
const Usuario = require("./database/Usuario");
const Medicamento = require("./database/Medicamento");
const Curiosidades = require("./database/Curiosidades");
const Quiz = require("./database/Quiz");

// Configuração do Express
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// Rotas - Página inicial
app.get("/", (req, res) => {
    res.render("index");
});

// Cadastro de Usuário
app.get("/cadastro", (req, res) => {
    res.render("cadastro");
});

app.post("/cadastro", (req, res) => {
    const { nome ,email, código, senha } = req.body;

    Usuario.findOne({ where: { email: email} }).then(usuario => {
        if (usuario) {
            res.send("Email já Cadastrado");
        } else {
            Usuario.create({nome, email, código, senha }).then(() => {
                res.redirect("/login");
            }).catch(erro => {
                res.status(500).send("Erro ao cadastrar usuário");
            });
        }
    });
});

// Login de Usuário
app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", (req, res) => {
    const { email, senha } = req.body;

    Usuario.findOne({ where: {email, senha: senha } }).then(usuario => {
        if (usuario) {
            res.redirect("/medicamentos");
        } else {
            res.send("Usuário ou senha inválidos");
        }
    });
});

// Consulta de Medicamentos
app.get("/medicamentos", (req, res) => {
    Medicamento.findOne().then(medicamentos => {
        res.render("medicamentos", { medicamentos });
    });
});

// Consulta de Curiosidades
app.get("/curiosidades", (req, res) => {
    Curiosidades.findAll().then(curiosidades => {
        res.render("curiosidades", { curiosidades });
    });
});

// Notificações de Saúde Pública
app.get("/notificações", (req, res) => {
    const notificacoes = [
        "Campanha de vacinação contra a gripe começa em 19/04",
        "Saiba como manter sua saúde em dia",
        "Melhores medicamentos para diabetes"
    ];
    res.json(notificacoes);
});

// Quiz de Perguntas
app.post("/quiz", (req, res) => {
    const { age } = req.body;

    Quiz.create({ age }).then(() => {
        res.send("Resposta do quiz salva com sucesso!");
    }).catch((erro) => {
        res.status(500).send("Erro ao salvar a resposta");
    });
});

// Inicializa o servidor 
app.listen(4000, () => {
    console.log("App rodando na porta 4000!");
});