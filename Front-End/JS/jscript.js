function verificaAprovacao()
{
   let nota = Number (document.getElementById("nota").value);

    if(nota >=6)
    {
        document.getElementById("resultado").innerHTML = "Aluno(a) aprovado(a)!";
        alert("Aluno(a) aprovado(a)!");
    }
    else{
         document.getElementById("resultado").innerHTML = "Aluno(a) reprovado(a)!";
         alert("Aluno(a) reprovado(a)!");
    }
    console.log(nota);
}
