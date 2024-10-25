// importando biblioteca
const Sequelize = require("sequelize");

//chaves
const conexaoComBanco = new Sequelize("bd_pri", "root", "", {
    host: "localhost",
    dialect: "mysql",
});

const Usuario = conexaoComBanco.define("usuario", {
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

const Habito = conexaoComBanco.define("habito", {
    nome: {
        type: Sequelize.STRING, //VARCHAR
    },
    descricao: {
        type: Sequelize.TEXT, //TEXTAREA
    }
});

Usuario.sync({force: true}); //CRIANDO TABELA
Habito.sync({force: true}); //CRIANDO TABELA

Usuario.create({
    nome: "Leonardo",
    email: "leoaragaogris@outlook.com",
    senha: "Teste321#"
}) //INSERT

Usuario.create({
    nome: "Lucas",
    email: "luc4spereira@gmail.com",
    senha: "ls54#j"
}) //INSERT

Habito.create({
    nome: "Agachamento",
    descricao: "Posicione-se em pé, mantendo os pés afastados na largura dos ombros. Dobre os joelhos e desça o quadril, simulando o ato de se sentar em uma cadeira. Mantenha as costas retas e verifique se os joelhos estão alinhados com os tornozelos. Volte à posição inicial e repita o movimento de 10 a 12 vezes.",
}) //INSERT