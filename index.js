const Sequelize = require("sequelize");
const express = require("express")//para usar o express

const server = express()//para criar um servidor

//###CONEXÃO BANCO DE DADOS###
const conexaoComBanco = new Sequelize("bd_pri", "root", "", {
    host: "localhost",
    dialect: "mysql",
  });
//### FIM CONEXÃO BANCO DE DADOS###

// ROTAS
server.get("/", (req, res) =>{
    return res.json({mensagem:"Hello NODE"})
});

server.get("/usuario/:nome/:email/:senha", (req, res) =>{
    res.send(req.params);
});

server.get("/habito/:nome/:descricao", (req, res) =>{
    res.send(req.params);
});

server.listen(3031, function () {
    console.log("Servidor aberto na rota 3031");
});