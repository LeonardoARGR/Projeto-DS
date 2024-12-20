const cors = require('cors');
const Sequelize = require("sequelize");
const express = require("express");

const server = express(); // para criar um servidor

const { create } = require("express-handlebars");

// CONEXÃO BANCO DE DADOS
const conexaoComBanco = new Sequelize("bd_pri", "root", "", {
    host: "localhost",
    dialect: "mysql",
});
// FIM CONEXÃO BANCO DE DADOS

// Definindo a tabela "usuario"
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
});

// Definindo a tabela "habito"
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

// Criando as tabelas -> 'force: true' = recria as tabelas, apagando dados existentes.
conexaoComBanco.sync({ force: false })
    .then(() => {
        console.log("Tabelas sincronizadas!");
    })
    .catch(error => {
        console.error("Erro ao sincronizar tabelas:", error);
    });

// Configuração do middleware CORS
server.use(cors());

// ROTAS

server.get("/salvar/:nome/:email/:senha", async function (req, res) {
    const { nome, email, senha } = req.params;
    try {
        const novoUser = await User.create({ nome, email, senha });
        res.json({
            resposta: "Usuário criado com sucesso!",
            user: novoUser,
        });
    } catch (error) {
        res.status(500).json({ mensagem: `Erro ao criar usuário: ${error}` });
    }
});

server.get("/mostrar", async function (req, res) {
    try {
        const usuarios = await User.findAll(); //Busca todos os registros
        res.json(usuarios); //Retorna os registros em formato JSON
    } catch (error) {
        res.status(500).json({ mensagem: `Erro ao buscar usuário: ${error}` });
    }
});

server.get("/deletar/:id", async function (req, res) {
    const { id } = req.params;
    const idNumber = parseInt(id, 10); // Converte o ID para número

    try {
        const deletado = await User.destroy({
            where: { id: idNumber },
        });

        if (deletado) {
            res.json({ mensagem: "Usuário deletado com sucesso!" });
        } else {
            res.status(404).json({ mensagem: "Usuário não encontrado" });
        }
    } catch (error) {
        res.status(500).json({ mensagem: `Erro ao deletar usuário: ${error}` });
    }
});

server.get("/editar/:id/:nome/:email/:senha", async function (req, res) {
    const { id, nome, email, senha } = req.params;
    const idNumber = parseInt(id, 10); // Converte o ID para número

    try {
        const [updated] = await User.update(
            { nome, email, senha },
            {
                where: { id: idNumber },
            }
        );

        if (updated) {
            res.json({ mensagem: "Usuário atualizado com sucesso!" });
        } else {
            res.status(404).json({ mensagem: "Usuário não encontrado" });
        }
    } catch (error) {
        res.status(500).json({ mensagem: `Erro ao atualizar usuário: ${error}` });
    }
});

server.get("/entrar/:email/:senha", async function (req, res) {
    const { email, senha } = req.params;
    try {
        const usuario = await User.findOne({ where: { email, senha } }); // Verifica o usuário pelo email e senha
        if (usuario) {
            // Usuário encontrado e senha correta
            res.json({ mensagem: "Usuário logado com sucesso!", userId: usuario.id, userName: usuario.nome });
        } else {
            // Usuário não encontrado ou senha incorreta
            res.status(401).json({ mensagem: "Email ou senha incorretos." });
        }
    } catch (error) {
        res.status(500).json({ mensagem: `Erro ao tentar logar: ${error}` });
    }
});

// ROTAS HABITOS
server.get("/habitos", async function (req, res) {
    try {
        const habitos = await Habito.findAll(); // Busca todos os registros
        res.json(habitos); // Retorna os registros em formato JSON
    } catch (error) {
        res.status(500).json({ mensagem: `Erro ao buscar os hábitos: ${error}` });
    }
});

server.get("/salvar-habito/:horario_praticado/:usuarioid/:habitoid", async function (req, res) {
    const { horario_praticado, usuarioid, habitoid } = req.params;

    // Converte os IDs para números inteiros
    const usuarioIdNumber = parseInt(usuarioid, 10);
    const habitoIdNumber = parseInt(habitoid, 10);

    try {
        const habitoSalvo = await HabitoSalvo.create({horario_praticado, usuarioIdNumber, habitoIdNumber});
        res.json({
            resposta: "Hábito salvo com sucesso!"
        });
    } catch (error) {
        res.status(500).json({ mensagem: `Erro ao salvar hábito: ${error}` });
    }
});

// FIM DAS ROTAS

const abs = create({ defaultLayout: "main" }); // definindo layout padrão
server.engine("handlebars", abs.engine); // definindo o motor e o recheio
server.set("view engine", "handlebars"); // definindo o tipo e o tipo

server.listen(3031, function () {
    console.log("Servidor aberto na porta 3031");
});
