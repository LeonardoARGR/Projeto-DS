async function carregarUsers(){
    const resposta = await fetch("http://localhost:3031/mostrar");
    const users = await resposta.json();
    
    const container = document.getElementById("dados");
    container.innerHTML = "<div class='row'><div class='col title-col'>Nome</div><div class='col title-col'>Email</div></div>";
    
    users.forEach((user) => {
        const userDiv = document.createElement("div");
        userDiv.classList.add("row")
        userDiv.innerHTML = `<div class='col content-col'>${user.nome}</div><div class='col content-col'>${user.email}</div>`;
        container.appendChild(userDiv);
    })
}

async function cadastrarUser(nome, email, senha) {
    try {    
        const respostaCadastro = await fetch(`http://localhost:3031/salvar/${nome}/${email}/${senha}`, {
            method: 'GET',
        });

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
}

document.getElementById('btnCadastrar').addEventListener('click', function() {
    const nome = document.getElementById('nome_user').value;
    const email = document.getElementById('email_user').value;
    const senha = document.getElementById('senha_user').value;

    if(!nome || !email || !senha) {
        alert("Todos os campos devem ser preenchidos!")
        return;
    }

    cadastrarUser(nome, email, senha);
})
