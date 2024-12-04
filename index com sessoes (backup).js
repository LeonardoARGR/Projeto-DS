const cors = require('cors');
const Sequelize = require("sequelize");
const express = require("express")//para usar o express
const session = require('express-session');//para usar as sessões

const server = express()//para criar um servidor


const { create } = require("express-handlebars");


// CONEXÃO BANCO DE DADOS
const conexaoComBanco = new Sequelize("bd_pri", "root", "", {
    host: "localhost",
    dialect: "mysql",
});
// FIM CONEXÃO BANCO DE DADOS

//Definindo a tabela "usuario"
const User = conexaoComBanco.define('usuario', {
    nome: {
        type: Sequelize.STRING, //VARCHAR
    },
    email: {
        type: Sequelize.STRING, //VARCHAR
    },
    senha: {
        type: Sequelize.STRING, //VARCHAR
    }
})

//Definindo a tabela "habito"
const Habito = conexaoComBanco.define("habito", {
    nome: {
        type: Sequelize.STRING, //VARCHAR
    },
    previa: {
        type: Sequelize.TEXT('long'), //TEXTAREA
    },
    descricao: {
        type: Sequelize.TEXT('long'), //TEXTAREA
    },
    caminho_imagem: {
        type: Sequelize.STRING, //VARCHAR
    }
});

// Definindo a tabela intermediária "habito_salvo"
const HabitoSalvo = conexaoComBanco.define("habito_salvo", {
    horario_praticado: {
        type: Sequelize.TIME, // Horário no formato HH:MM:SS
        allowNull: false
    }
});

// Configurando relações
User.belongsToMany(Habito, { through: HabitoSalvo });
Habito.belongsToMany(User, { through: HabitoSalvo });

//Criando as tabelas -> 'force: true' = recria as tabelas, apagando dados existentes.
conexaoComBanco.sync({ force: false })
    .then(() => {
        console.log("Tabelas sincronizadas!");
    })
    .catch(error => {
        console.error("Erro ao sincronizar tabelas:", error);
    });

// Configuração do middleware de sessão
server.use(session({
    secret: 'userLogado', // Chave secreta
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Para desenvolvimento em HTTP. Use true com HTTPS em produção
        httpOnly: true, // Evita acesso ao cookie via JavaScript
        sameSite: 'lax' // Impede o envio de cookies em contextos de terceiros
    }
}));

server.use(cors({
    origin: 'http://127.0.0.1:5500', // Substitua pelo domínio onde seu frontend está rodando.
    credentials: true // Permite o envio de cookies
}));

// ROTAS

server.get("/salvar/:nome/:email/:senha", async function (req, res) {
    const {nome, email, senha} = req.params;
    const novoUser = await User.create({nome, email, senha}); //função que espera

    res.json({
        resposta: "Usuário criado com sucesso!",
        user: novoUser,
    });
});

server.get("/mostrar", async function (req, res) {
    try {
        const usuarios = await User.findAll(); //Busca todos os registros
        res.json(usuarios); //Retorna os registros em formato JSON
    } catch (error) {
        res.status(500).json({mensagem: `Erro ao buscar usuário: ${error}`}); //REtorna erro ao cliente
    }
});

server.get("/deletar/:id", async function (req, res) {
    const {id} = req.params;
    const idNumber = parseInt(id ,10); //Converte o ID para número (10 = 2 casas decimais)

    const deletado = await User.destroy({
        where: { id: idNumber},
    });

    if(deletado) {
        res.json({mensagem: "Usuário deletado com sucesso!"});
    }else {
        res.states(404).json({mensagem: "Usuário não encontrado"});
    }
})

server.get("/editar/:id/:nome/:email/:senha", async function (req, res) {
    const {id, nome, email, senha} = req.params;
    const idNumber = parseInt(id, 10); //Converte o ID para número

    const [updated] = await User.update(
        {nome, email, senha},
        {
            where: {id:idNumber}, //Usa o ID numérico
        }
    );

    res.json({
        mensagem: "Usuário atualizado com sucesso!",
    })

})

server.get("/entrar/:email/:senha", async function (req, res) {
    const {email, senha} = req.params;
    try {
        const usuario = await User.findOne({ where: { email, senha } }); // Verifica o usuário pelo email e senha
        if (usuario) {
            // Usuário encontrado e senha correta
            req.session.userId = usuario.id; // Armazena o ID do usuário na sessão
            console.log('Sessão criada:', usuario); // Verifique se a sessão foi criada
            res.json({ mensagem: "Usuário logado com sucesso!", userId: usuario.id, userName: usuario.nome});
        } else {
            // Usuário não encontrado ou senha incorreta
            res.status(401).json({ mensagem: "Email ou senha incorretos." });
        }
    } catch (error) {
        res.status(500).json({ mensagem: `Erro ao tentar logar: ${error}` });
    }
});

server.get("/verificar-sessao", (req, res) => {
    if (req.session.userId) {
        res.json({ logado: true, userId: req.session.userId });
    } else {
        res.json({ logado: false });
    }
});

//ROTAS HABITOS
server.get("/habitos", async function (req, res) {
    try {
        const habitos = await Habito.findAll(); //Busca todos os registros
        res.json(habitos); //Retorna os registros em formato JSON
    } catch (error) {
        res.status(500).json({mensagem: `Erro ao buscar os hábitos: ${error}`}); //REtorna erro ao cliente
    }
})

// FIM DAS ROTAS

const abs = create({ defaultLayout: "main" }); //definindo layout padrão
server.engine("handlebars", abs.engine); //denfinindo o motor e o recheio 
server.set("view engine", "handlebars"); //definindo o tipo e o tipo

server.listen(3031, function () {
    console.log("Servidor aberto na rota 3031");
});