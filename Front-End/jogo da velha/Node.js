

const celulas = document.querySelectorAll('.celula');

let vezDoX = true;

document.getElementById("botaoReiniciar").addEventListener('click', iniciarJogo);



function iniciarJogo(){
    celulas.forEach(celula =>{
        celula.textContent = "";
        celula.addEventListener('click',trataClique,{once:true});
    })
}

function trataClique(evento){
    evento.target.textContent = vezDoX ? "X" : "O";
    vezDoX = !vezDoX;
}

iniciarJogo();