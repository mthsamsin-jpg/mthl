document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('cadastroForm');
const successPanel = document.getElementById('successPanel');
const successTitle = document.getElementById('successTitle');
const successText = document.getElementById('successText');

function setError(fieldEl, message){
  fieldEl.classList.toggle('invalid', Boolean(message));
  const errorEl = fieldEl.querySelector('.error-msg');
  if(errorEl) errorEl.textContent = message || '';
}

function validateEmail(value){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validatePhone(value){
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10;
}

// Auto-formata o telefone enquanto o usuário digita: (00) 00000-0000
const telefoneInput = document.getElementById('telefone');
telefoneInput.addEventListener('input', () => {
  let digits = telefoneInput.value.replace(/\D/g, '').slice(0, 11);
  let formatted = digits;
  if(digits.length > 0) formatted = '(' + digits.slice(0, 2);
  if(digits.length >= 3) formatted += ') ' + digits.slice(2, 7);
  if(digits.length >= 8) formatted += '-' + digits.slice(7, 11);
  telefoneInput.value = formatted;
});

form.addEventListener('submit', function(e){
  e.preventDefault();
  let isValid = true;

  const tutorField = form.querySelector('[data-field="tutor"]');
  const tutorVal = form.tutor.value.trim();
  if(tutorVal.length < 2){
    setError(tutorField, 'Digite seu nome.');
    isValid = false;
  } else {
    setError(tutorField, '');
  }

  const petField = form.querySelector('[data-field="pet"]');
  const petVal = form.pet.value.trim();
  if(petVal.length < 1){
    setError(petField, 'Digite o nome do pet.');
    isValid = false;
  } else {
    setError(petField, '');
  }

  const especieField = form.querySelector('[data-field="especie"]');
  if(!form.especie.value){
    setError(especieField, 'Escolha uma espécie.');
    isValid = false;
  } else {
    setError(especieField, '');
  }

  const telefoneField = form.querySelector('[data-field="telefone"]');
  if(!validatePhone(form.telefone.value)){
    setError(telefoneField, 'Telefone incompleto.');
    isValid = false;
  } else {
    setError(telefoneField, '');
  }

  const emailField = form.querySelector('[data-field="email"]');
  if(!validateEmail(form.email.value.trim())){
    setError(emailField, 'E-mail inválido.');
    isValid = false;
  } else {
    setError(emailField, '');
  }

  if(!isValid){
    const firstInvalid = form.querySelector('.invalid input, .invalid select');
    if(firstInvalid) firstInvalid.focus();
    return;
  }

  successTitle.textContent = 'Bem-vindo(a), ' + petVal + '! 🐾';
  successText.textContent = 'Cadastro de ' + tutorVal + ' recebido com sucesso. Te levando para conhecer o Pet Shop...';

  form.classList.add('hide');
  successPanel.classList.add('show');

  // Leva a pessoa direto para o painel (Sobre / Serviços / Funcionários / Agendamento)
  setTimeout(function(){
    window.location.href = 'painel.html';
  }, 1400);
});