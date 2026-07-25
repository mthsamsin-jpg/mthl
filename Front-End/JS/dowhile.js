const carros = ["Ferrari","BMW","Porsche","McLaren","Mercedes"];

const marcas = document.getElementById("marcas");

function luxoCar(titulo,conteudo)
{
let lista = document.createElement("ul");
lista.innerHTML = "<h2>"+ titulo +"</h2>"+conteudo;
marcas.appendChild(lista);
}


let conteudo = "";
let i = 0;
let continuar
do{
conteudo += "<p>"+carros[i]+"</p>";
continuar = confirm("Deseja continuar para o próximo carro?");
    i++;
} while(continuar && i < carros.length)
luxoCar("Check-list de Marcas",conteudo);

