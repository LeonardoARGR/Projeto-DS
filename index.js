const express = require('express')//para usar o express
const server = express()//para criar um servidor

server.get("/", (req, res) =>{
    return res.json({mensagem:"Hello NODE"})
})

server.get("/teste", (req, res) =>{
    return res.json({mensagem:"Teste"})
})

server.listen(1999, ()=>{
    console.log('server ON')
})