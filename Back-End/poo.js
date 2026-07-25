class Veiculo
 {
    constructor(fabricante,modelo,ano,tipo,qtdPortas)
    {
        this.fabricante = fabricante; // Propriedades de Classe
        this.modelo = modelo; // Propriedades de Classe
        this.ano = ano; // Propriedades de Classe
        this.tipo = tipo; // Propriedades de Classe
        this.qtdPortas = qtdPortas; // Propriedades de Classe
    }

    mostraDadosDoVeiculo()
    {
        console.log(`${this.fabricante}, ${this.modelo}, ${this.ano}, ${this.tipo}, ${this.qtdPortas}`);
    } 


}

class Moto extends Veiculo
    {
     constructor(fabricante,modelo,ano,cilindradas){
        super(fabricante,modelo,ano);
        this.cilindradas = cilindradas;
    } 

    mostraDadosDoVeiculo()
    {
        console.log(`${this.fabricante}, ${this.modelo}, ${this.ano},${this.cilindradas}`);
    } 
}




class Carro extends Veiculo{
     constructor(fabricante,modelo,ano,tipo,qtdPortas){
        super(fabricante,modelo,ano,tipo,qtdPortas);
     }
}

const meuCarro = new Carro("Ford","Ka","2008","Sedan",4);
const myMoto = new Moto("Honda","Twist","2026",300);
meuCarro. mostraDadosDoVeiculo();
myMoto. mostraDadosDoVeiculo(); 