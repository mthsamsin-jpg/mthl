    function pedidoDePizza(){
        const opecao = parseInt(document.getElementById('opecao').value);
        const mensagem = document.getElementById('mensagem');
    mensagem.innerHTML = saboresDePizza(opecao);
    }

    function saboresDePizza(opecao)
    {
        if(opecao === 1)
        {
            alert("Pedido enviado");
            return "Pizza de calabresa";
        }

        else if(opecao === 2)
        {
             alert("Pedido enviado");
             return "Pizza de quatro queijos";
        }

        else if(opecao === 3)
        {
             alert("Pedido enviado");
             return "Pizza de frango com catupiry";
        }

        else if(opecao === 4)
        {
             alert("Pedido enviado");
             return "Pizza de brigadeiro";
        }


        else
        {
             alert("Número pedido inválido!");
             return "Número pedido inválido!";
        }
    }