const urlParams = new URLSearchParams(window.location.search);


// HÁBITOS

async function carregarHabitos() {
    const resposta = await fetch("http://localhost:3031/habitos");
    const habitos = await resposta.json();

    const container = document.getElementById("dados");

    habitos.forEach((habito) => {
        
        const habitoDiv = document.createElement("div");
        habitoDiv.classList.add("icone-habito");

        // Converte o Markdown em HTML usando a função 'marked' global
        console.log(marked); // Deve mostrar a função ou o objeto com métodos, não 'undefined'

        // Em seguida, use a função:
        const previaHtml = marked.parse(habito.previa);

        habitoDiv.innerHTML = `
            <div class="row w-100 align-items-center">
                <div class='col-4 d-flex align-items-center justify-content-center'><img src="${habito.caminho_imagem}" class="img-thumbnail"></div>
                <div class='col-8'>
                    <h3>${habito.nome}</h3>
                    ${previaHtml}
                    <button class="btn btn-outline-light" onclick="lerHabito(${habito.id})">Ler mais</button>
                    <a><a>
                </div>
            </div>
        `;

        container.appendChild(habitoDiv);
    });
}

function lerHabito(id) {
    window.location.href = `habito.html?id=${id}`
}

async function exibirHabito() {
    try {
        const id = urlParams.get("id");
    
        const resposta = await fetch('http://localhost:3031/habitos');
        const habitos = await resposta.json();
        const habito = habitos.find((habito) => habito.id == id);
    
        if(habito) {
            const container = document.getElementById("dados");
            
            //Convertendo Markdown em HTML
            const conteudoHtml = marked.parse(habito.descricao);

            container.innerHTML = `
                <div class="row habito-row">
                    <div class='col-5 foto-col'>
                        <img src="${habito.caminho_imagem}" class="img-thumbnail">
                        <label for="horario">Selecione um horário para praticar!</label>
                        <input class="form-control horario" type="time" id="horario">
                        <button class="btn btn-outline-success" onclick="salvarHabito(${habito.id})">Salvar hábito</button>
                    </div>
                    <div class='col-7 conteudo-col'>
                        ${conteudoHtml}
                        <a><a>
                    </div>
                </div>
            `;

            
        } else {
            alert("Hábito não encontrado");
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Erro de requisição");
        window.location.href = `index.html`
    }
}

async function salvarHabito() {
    const usuarioid = localStorage.getItem('userId');
    const horario_praticado = document.getElementById('horario').value;
    
    if (usuarioid) {
        if (horario_praticado) {
            const habitoid = urlParams.get("id");
            try {
                const resposta = await fetch(`http://localhost:3031/salvar-habito/${horario_praticado}/${usuarioid}/${habitoid}`);
                const data = await resposta.json();
                
                if (resposta.ok) { // Verifica se a resposta foi bem-sucedida
                    alert(data.resposta);
                } else {
                    alert("Hábito não salvo");
                }
            } catch (error) {
                console.error('Error:', error);
                alert("Erro de requisição");
            }
        } else {
            alert("Erro! Horário não definido");
        }
    } else {
        alert("Você precisa entrar em uma conta para fazer isso.");
    }
}

// USUÁRIO

function verificarLogin() {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');

    if (userId && userName) {
        console.log(`Usuário logado: ${userName} (ID: ${userId})`);
        window.location.href = `areausuario.html`;
    } else {
        console.log('Nenhum usuário logado.');
        window.location.href = `login.html`;
    }
}

async function cadastrarUser() {
    try {    
        const nome = document.getElementById('nome_user').value;
        const email = document.getElementById('email_user').value;
        const senha = document.getElementById('senha_user').value;

        // Enviar dados do novo usuário para o servidor
        const respostaCadastro = await fetch(`http://localhost:3031/salvar/${nome}/${email}/${senha}`);

        const data = await respostaCadastro.json();

        if (data.resposta) {
            alert(data.resposta);  // Exibir mensagem de sucesso

            // Iniciar a sessão após o cadastro bem-sucedido
            const respostaLogin = await fetch(`http://localhost:3031/entrar/${email}/${senha}`);

            const loginData = await respostaLogin.json();

            if (respostaLogin.ok) {
                localStorage.setItem('userId', loginData.userId);
                localStorage.setItem('userName', loginData.userName);

                alert(`Bem vindo ${loginData.userNome}!`);
                window.location.href = `areausuario.html`; // Redireciona após login
            } else {
                alert("Erro ao iniciar sessão: " + loginData.mensagem);
            }
        } else {
            alert("Erro ao cadastrar o usuário");
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Erro de requisição");
    }
};

async function loginUser() {
    try {
        const email = document.getElementById('email_user').value;
        const senha = document.getElementById('senha_user').value;

        const respostaLogin = await fetch(`http://localhost:3031/entrar/${email}/${senha}`);

        const loginData = await respostaLogin.json();
        console.log('Dados do login:', loginData); // Verifique se userNome está presente

        if (respostaLogin.ok) {
            localStorage.setItem('userId', loginData.userId);
            localStorage.setItem('userName', loginData.userName);

            alert(`Bem vindo ${loginData.userName}!`);
            window.location.href = `areausuario.html`; // Redireciona após login
        } else {
            alert("Erro ao iniciar sessão: " + loginData.mensagem);
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro de conexão com o servidor');
    }
}

function sairConta() {
    // Remove os dados de login do localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');

    // Redireciona o usuário para a página de login ou página inicial
    window.location.href = 'index.html';
}


function editarUser(id) {
    window.location.href = `editar.html?id=${id}`
}

async function carregarUsers() {
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