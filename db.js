// importando biblioteca
const Sequelize = require("sequelize");

//chaves
const conexaoComBanco = new Sequelize("teste", "root", "", {
    host: "localhost",
    dialect: "mysql",
});

const Postagem = conexaoComBanco.define("postagens", {
    titulo: {
        type: Sequelize.STRING, //VARCHAR
    },
    conteudo: {
        type: Sequelize.TEXT, //TEXTAREA
    },
});

//Postagem.sync({force: true});

Postagem.create({
    titulo: "Título Teste",
    conteudo: "Conteúdo teste"
}) //INSERT