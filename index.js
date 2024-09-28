const express = require("express")//para usar o express
const server = express()//para criar um servidor
const alunos = require("./src/teste.json")

server.get("/", (req, res) =>{
    return res.json({mensagem:"Hello NODE"})
})

server.get("/teste", (req, res) =>{
    return res.json({mensagem:"Teste"})
})

server.get("/alunos", (req, res) =>{
    return res.json(alunos)
})

server.listen(1999, ()=>{
    console.log('server ON')
})