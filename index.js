const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const session = require("express-session"); // Express-session para gerenciamento de sessão
const bcrypt = require('bcryptjs'); // Biblioteca para criptografia de senhas

// Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão com DB com sucesso");
    })
    .catch((erro) => {
        console.log("Erro ao conectar com o banco: ", erro);
    });

// Autentificação Criador
app.use(session({
    secret: "segredo_super_secreto",
    resave: false,
    saveUninitialized: false
}));

function autenticarAdmin(req, res, next) {
    if (req.session && req.session.admin) {
        next();
    } else {
        res.redirect("/login");
    }
}

// Rota de Login
app.get("/admin/login", (req, res) => {
    res.render("login");
});

app.post("/admin/login", (req, res) => {
    const { usuario, senha } = req.body;

// Credenciais do Criador
if (usuario === "admin" && senha === "1234") {
    req.session.admin = true;
    res.redirect("/admin");
} else {
    res.render("login", {erro: "Credenciais inválidas"});
}
});

// Rota protegida do Painel
app.get("/admin", autenticarAdmin, (req, res) => {
    res.render("admin");
});

app.get("/admin/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/admin/login");
});

// Importando Models
const Cadastro = require("./database/Cadastro");
const Usuario = require("./database/Usuario");
const Medicamento = require("./database/Medicamento");
const Curiosidades = require("./database/Curiosidades");
const Quiz = require("./database/Quiz");

Usuario.sync();
Cadastro.sync();
Medicamento.sync();
Curiosidades.sync();
Quiz.sync();

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

// Página "Sobre Nós"
app.get("/sobre", (req, res) => {
    res.render("sobre");
});


app.post("/cadastro", async (req, res) => {
    const { nome, email, senha } = req.body;

    const usuarioExistente = await Usuario.findOne({ where: { email } });

    if (usuarioExistente) {
        res.send("Email já cadastrado");
    } else {
        const hash = await bcrypt.hash(senha, 10); // Gera hash da senha
        Usuario.create({ nome, email, senha: hash }).then(() => {
            res.redirect("/login");
        }).catch(erro => {
            res.status(500).send("Erro ao cadastrar usuário");
        });
    }
});

// Login de Usuário
app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    const { email, senha } = req.body;
    console.log("Tentativa de login para:", email); // Log para ver o email recebido

    const usuario = await Usuario.findOne({ where: { email } });

    if (usuario) {
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (senhaCorreta) {
            res.redirect("/");
        } else {
            res.send("Usuário ou senha inválidos");
        }
    } else {
        res.send("Usuário ou senha inválidos");
    }
});

// Consulta de Medicamentos
app.get("/medicamentos", (req, res) => {
    Medicamento.findAll().then(medicamentos => {
        res.render("medicamentos", { medicamentos });
    }).catch(err => {
        res.send("Erro ao buscar medicamentos");
    });
});

app.post("/medicamentos/adicionar", autenticarAdmin, (req, res) => {
    const { nome, descricao } = req.body;

    Medicamento.create({ nome, descricao }).then(() => {
        res.redirect("/medicamentos");
    }).catch(erro => {
        res.status(500).send("Erro ao adicionar medicamento");
    });
});

// Consulta de Curiosidades
app.get("/curiosidades", (req, res) => {
    Curiosidades.findAll().then(curiosidades => {
        res.render("curiosidades", { curiosidades });
    }).catch(erro => {
        res.status(500).send("Erro ao buscar curiosidades");
    });
});

app.post("/curiosidades/adicionar", (req, res) => {
    const { texto } = req.body;

    Curiosidades.create({ texto }).then(() => {
        res.redirect("/curiosidades");
    }).catch(erro => {
        res.status(500).send("Erro ao adicionar curiosidade");
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
app.get("/quiz", (req, res) => {
    res.render("quiz");
});

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