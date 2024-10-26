const Sequelize = require("sequelize");
const express = require("express")//para usar o express

const server = express()//para criar um servidor

const { create } = require("express-handlebars");

// CONEXÃO BANCO DE DADOS
const conexaoComBanco = new Sequelize("bd_pri", "root", "", {
    host: "localhost",
    dialect: "mysql",
  });
// FIM CONEXÃO BANCO DE DADOS

const User = conexaoComBanco.define('users', {
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

User.sync({force: false});


// ROTAS
server.get("/", (req, res) =>{
    return res.json({mensagem:"Hello NODE"})
});

server.get("/salvar/:nome/:email/:senha", async function (req, res) {
    const {nome, email, senha} = req.params;
    const novoUser = await User.create({nome, email, senha}); //função que espera

    res.json({
        resposta: "Aluno criado com sucesso!",
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
    const {id, nome, idade} = req.params;
    const idNumber = parseInt(id, 10); //Converte o ID para número

    const [updated] = await User.update(
        {nome, idade},
        {
            where: {id:idNumber}, //Usa o ID numérico
        }
    );

    res.json({
        mensagem: "Usuário atualizado com sucesso!",
    })

})

// FIM DAS ROTAS

/*
const abs = create({ defaultLayout: "main" }); //definindo layout padrão
server.engine("handlebars", abs.engine); //denfinindo o motor e o recheio 
server.set("view engine", "handlebars"); //definindo o tipo e o tipo lo
*/

server.listen(3031, function () {
    console.log("Servidor aberto na rota 3031");
});