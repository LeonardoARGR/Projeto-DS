const urlParams = new URLSearchParams(window.location.search);

async function carregarUsers(){
    const resposta = await fetch("http://localhost:3031/mostrar");
    const users = await resposta.json();
    
    const container = document.getElementById("dados");
    container.innerHTML = "<div class='row'><div class='col title-col'>Nome</div><div class='col title-col'>Email</div><div class='col title-col'>Edição</div></div>";
    
    users.forEach((user) => {
        const userDiv = document.createElement("div");
        userDiv.classList.add("row")
        userDiv.innerHTML = `<div class='col content-col'>${user.nome}</div><div class='col content-col'>${user.email}</div><div class='col content-col'><button onclick="editarUser(${user.id})">Editar</button></div><div class='col content-col'><button onclick="deletarUser(${user.id})">Excluir</button></div>`;
        container.appendChild(userDiv);
    })
}

async function cadastrarUser() {
    try {    
        const nome = document.getElementById('nome_user').value;
        const email = document.getElementById('email_user').value;
        const senha = document.getElementById('senha_user').value;

        const respostaCadastro = await fetch(`http://localhost:3031/salvar/${nome}/${email}/${senha}`);

        const data = await respostaCadastro.json();

        if (data.resposta) {
            alert(data.resposta);  // Exibir mensagem de sucesso
            window.location.href = 'index.html';
        } else {
            alert("Erro ao cadastrar o usuário");
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Erro de requisição");
    }
};

function editarUser(id) {
    window.location.href = `editar.html?id=${id}`
}

async function carregarUser() {
    try {
        const id = urlParams.get("id");
    
        const resposta = await fetch('http://localhost:3031/mostrar');
        const users = await resposta.json();
        const user = users.find((usuarios) => usuarios.id == id);
    
        if(user) {
            document.getElementById("nome_user").value = user.nome;
            document.getElementById("email_user").value = user.email;
            document.getElementById("senha_user").value = user.senha;
        } else {
            alert("Usuário não encontrado");
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Erro de requisição");
    }
}

async function salvarAlteracoes() {
    try {    
        const id = urlParams.get("id");

        const nome = document.getElementById("nome_user").value;
        const email = document.getElementById("email_user").value;
        const senha = document.getElementById("senha_user").value;

        const resposta = await fetch(`http://localhost:3031/editar/${id}/${nome}/${email}/${senha}`);

        if(resposta.ok) {
            alert("Usuário atualizado com sucesso!");
            window.location.href = "index.html";
        } else {
            alert("Erro ao atualizar usuário")
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Erro de requisição");
    }
}

async function deletarUser(id) {
    try {    
        const resposta = await fetch(`http://localhost:3031/deletar/${id}`)

        if(resposta.ok) {
            alert("Usuário deletado com sucesso!");
            carregarUsers();
        }else {
            alert("Erro ao deletar o usuário");
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Erro de requisição");
    }
};