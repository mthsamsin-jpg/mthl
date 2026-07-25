function adicionarTarefa() {
    let inputTarefa = document.getElementById("casa");
    let textoTarefa = inputTarefa.value.trim(); 
    
    
    if (textoTarefa === "") {
        alert("Por favor, digite uma tarefa!");
        return;
    }

    
    let lista = document.querySelector("ul");

  
    let novaLi = document.createElement("li");

    novaLi.innerHTML = `
        <input type="checkbox"> 
        <span>${textoTarefa}</span> 
        <button class="btn-excluir">Excluir</button>`;

    lista.appendChild(novaLi);

    inputTarefa.value = "";
}


function excluirTarefa(evento)
 {
    if (evento.target.classList.contains("btn-excluir") || evento.target.textContent === "Excluir") 
        {
        let liDaTarefa = evento.target.closest("li");
        liDaTarefa.remove();
        }
 }

let listaUl = document.querySelector("ul");

listaUl.addEventListener("click", excluirTarefa);