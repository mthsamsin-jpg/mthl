function validateForm()
{
const nome = document.getElementById("nome").value;
const email = document.getElementById("email").value;
const telefone = document.getElementById("telefone").value;
const menssagem = document.getElementById("menssagem").value;

if(nome === '' || email === '' || menssagem === '' ||telefone ==='')
{
    alert('Todos os campos são obrigatorios');
    return false;
}

if(nome.length < 3 || nome.length > 50)
{
    alert('O nome deve ter entre 3 a 50 caracteres');
    return false;
}

if(email.length < 5 || email.length > 50)
{
    alert('O E-mail deve ter entre 5 a 50 caracteres');
    return false;
}

if(telefone.length < 5 || telefone.length > 50)
{
    alert('O Telefone deve ter entre 5 a 50 caracteres');
    return false;
}

const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

if (!emailPattern.test(email)){
 alert('Por favor, insira um valor de e-mail válida');
    return false;
}

return true;
}

document.getElementById("contacForm").addEventListener("submit",function(event){
    event.preventDefault();
    if(validateForm())
    {
        alert("Formulário validado!");
}

});