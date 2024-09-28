const express = require("express")//para usar o express
const server = express()//para criar um servidor
const alunos = require("./src/teste.json")
const usuarios = require("./src/usuarios.json")
const habitos = require("./src/habitos.json")

server.get("/", (req, res) =>{
    return res.json({mensagem:"Hello NODE"})
})

server.get("/teste", (req, res) =>{
    return res.json({mensagem:"Teste"})
})

server.get("/alunos", (req, res) =>{
    return res.json(alunos)
})

server.get("/usuarios", (req, res) =>{
    return res.json(usuarios)
})

server.get("/habitos", (req, res) =>{
    return res.json(habitos)
})

server.listen(1999, ()=>{
    console.log('server ON')
})