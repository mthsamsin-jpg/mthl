function buscaDadosdoServidor() {

    //CODIGO QUE BUSCA DADOS DO SERVIDOR

    return new Promise((reslver, reject) => {
        console.log("Buscando dados no servidor");

        setTimeout(() => {
            let sucesso = Math.random() > 0.5;

            if (sucesso) {
                resolve("Dados recebidos com sucesso");
            }

            else {
                reject("falha ao buscar dados do servidor");
            }

        }, 2000);
    })
}


buscaDadosdoServidor().then((menssagem) => {

     console.log(menssagem);

     })

     .catch((erro)  => {

        console.error(erro);

     });