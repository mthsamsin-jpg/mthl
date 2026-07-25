function validateForm()
{
const name = document.getElementById("name").value;
const email = document.getElementById("email").value;
const menssagem = document.getElementById("menssagem").value;

if(name === '' || email === '' || menssagem === '' )
{
    alert('Todos os campos são obrigatorios');
    return false;
}

if(name.length < 3 || name.length > 50)
{
    alert('O nome deve ter entre 3 a 50 caracteres');
    return false;
}

if(email.length < 5 || email.length > 50)
{
    alert('O E-mail deve ter entre 5 a 50 caracteres');
    return false;
}

const eemailPatern = /^a-zA-z0-9._-]+@[a-zA-z0-9.-]+\.[a-zA-Z]{2,6}$/;

if(!emailPatern.test(email)){
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