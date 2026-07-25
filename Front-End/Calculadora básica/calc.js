function efetuarOperacao()
{
    let numb1 = parseFloat(document.getElementById("numb1").value);
    let numb2 = parseFloat(document.getElementById("numb2").value);
    let operador = document.getElementById("operador").value;
    let resultado;

    switch (operador) {
     case"+":
     resultado = numb1 + numb2;
     break;

     case"-":
     resultado = numb1 - numb2;
     break;

     case"*":
     resultado = numb1 * numb2;
     break;

     case"/":
     if(numb2 == 0)
        {
     resultado = "kksksksksksksk tu é muito otário."
     }
     else {
        resultado = numb1 / numb2;
     }
     break;

     default:
        resultado = "Operador invalído!"

    }

    document.getElementById("resultado").innerHTML = "Resultado" + resultado;

}