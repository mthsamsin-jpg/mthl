function seledorDeIdioma()
{
     let idioma = (document.getElementById("idioma").value);
     let saudacao;

    switch (idioma) {
            case "pt":
            saudacao = "Olá! Seja bem-vindo.";
            break;

            case "en":
            saudacao = "Hello! Welcome";
            break;

            case "fr":
            saudacao = "Bonjour! Bienvenue.";
            break;

            case "es":
            saudacao = "Hola! Bienvindo";
            break;

            default:
                saudacao = "Idioma não encontrado";
    }

     document.getElementById("saudacao").innerText = saudacao;

}