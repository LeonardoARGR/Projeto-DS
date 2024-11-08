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

async function cadastrarUsuario(){
    
}
