function verificarPorcentagem()
{
     let desconto = Number (document.getElementById("desconto").value);
     let preco = Number (document.getElementById("preco").value);


     if(preco >150 && desconto <= 40)
     {
        let valorDoDesconto = preco * (desconto / 100); 
        let precoFinal = preco - valorDoDesconto
        let resultado = "Valor aprovado! Desconto de R$" + valorDoDesconto + " | Total a pagar: R$" + precoFinal;

         document.getElementById("porcentagem").innerHTML = resultado;
        alert(resultado);
     }
     else{
        document.getElementById("porcentagem").innerHTML = erro;
        alert(erro);
     }

     console.log(desconto);

    }