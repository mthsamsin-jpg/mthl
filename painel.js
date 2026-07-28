document.getElementById('year').textContent = new Date().getFullYear();

/* =========================================================
   DADOS: serviços e funcionários (fonte única de verdade,
   usada tanto para renderizar os cards quanto para
   preencher os selects do agendamento)
========================================================= */
const SERVICOS = [
  {
    id: 'banho-tosa',
    nome: 'Banho & Tosa',
    preco: 'a partir de R$ 60',
    descricao: 'Banho completo, secagem e tosa na tesoura ou na máquina, do jeito que o seu pet gosta.',
    icone: 'M4 12a8 8 0 1016 0 8 8 0 00-16 0zM12 8v4l3 2'
  },
  {
    id: 'consulta-vet',
    nome: 'Consulta Veterinária',
    preco: 'a partir de R$ 120',
    descricao: 'Avaliação clínica completa com uma das nossas veterinárias, incluindo orientação de cuidados.',
    icone: 'M12 21s-7-4.35-9.5-8.5C.8 8.7 2.5 5 6 5c2 0 3.5 1.2 4.2 2.6C10.9 6.2 12.4 5 14.4 5c3.5 0 5.2 3.7 3.5 7.5C15.4 16.65 12 21 12 21z'
  },
  {
    id: 'vacinacao',
    nome: 'Vacinação',
    preco: 'consulte valores',
    descricao: 'Aplicação de vacinas com acompanhamento da carteira de vacinação do seu pet.',
    icone: 'M9 3l6 6M4 14l6-6 6 6-6 6-6-6zM14 4l6 6'
  },
  {
    id: 'day-care',
    nome: 'Day Care',
    preco: 'a partir de R$ 80/dia',
    descricao: 'Seu pet passa o dia com a gente, brincando e socializando em ambiente seguro.',
    icone: 'M4 6h16M4 12h10M4 18h7'
  },
  {
    id: 'adestramento',
    nome: 'Adestramento',
    preco: 'pacotes sob consulta',
    descricao: 'Sessões de adestramento com reforço positivo, para casa e para o dia a dia.',
    icone: 'M12 2l2.4 6.9L21 9l-5.5 4.3L17 21l-5-3.9L7 21l1.5-7.7L3 9l6.6-.1z'
  },
  {
    id: 'taxi-dog',
    nome: 'Táxi Dog',
    preco: 'a partir de R$ 25',
    descricao: 'Buscamos e levamos o seu pet até o pet shop com todo o cuidado no transporte.',
    icone: 'M3 13l2-5h10l3 5M5 13h14v4H5zM7 17a1.5 1.5 0 103 0M14 17a1.5 1.5 0 103 0'
  }
];

const FUNCIONARIOS = [
  {
    id: 'camila',
    nome: 'Dra. Camila Duarte',
    cargo: 'Médica Veterinária',
    cor: '#E8A33D',
    qualificacoes: ['CRMV ativo, clínica de pequenos animais', 'Especialização em dermatologia veterinária', '8 anos de experiência em consultório'],
    bio: '"Cada consulta é uma chance de deixar o tutor mais tranquilo."'
  },
  {
    id: 'rafael',
    nome: 'Rafael Torres',
    cargo: 'Groomer / Tosador',
    cor: '#FF8FA3',
    qualificacoes: ['Certificação em tosa higiênica e na tesoura', 'Especialista em raças de pelo longo', '6 anos de experiência em pet grooming'],
    bio: '"Gosto de deixar cada pet saindo daqui se sentindo o mais bonito da rua."'
  },
  {
    id: 'juliana',
    nome: 'Juliana Prado',
    cargo: 'Adestradora Comportamental',
    cor: '#7FB6D9',
    qualificacoes: ['Certificação em adestramento positivo', 'Especialização em comportamento animal', '5 anos trabalhando com socialização'],
    bio: '"Adestrar é ensinar uma linguagem comum entre pet e tutor."'
  }
];

/* =========================================================
   MENU / NAVEGAÇÃO ENTRE SEÇÕES
========================================================= */
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
const tabsNav = document.getElementById('tabsNav');
const menuToggle = document.getElementById('menuToggle');

function activateTab(target){
  tabButtons.forEach(btn => {
    const isActive = btn.dataset.target === target;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
  tabPanels.forEach(panel => {
    panel.classList.toggle('active', panel.id === target);
  });
  tabsNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;
    activateTab(target);
    history.replaceState(null, '', '#' + target);
  });
});

menuToggle.addEventListener('click', () => {
  const isOpen = tabsNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

// Abre direto na seção certa se a página foi carregada com #hash (ex: vindo do cadastro)
const validTargets = ['sobre', 'servicos', 'funcionarios', 'agendamento'];
const initialHash = window.location.hash.replace('#', '');
if (validTargets.includes(initialHash)) {
  activateTab(initialHash);
}

/* =========================================================
   RENDERIZA SERVIÇOS
========================================================= */
const servicosGrid = document.getElementById('servicosGrid');
SERVICOS.forEach(servico => {
  const card = document.createElement('article');
  card.className = 'servico-card';
  card.innerHTML = `
    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="${servico.icone}"/>
    </svg>
    <h3>${servico.nome}</h3>
    <p>${servico.descricao}</p>
    <span class="price">${servico.preco}</span>
  `;
  servicosGrid.appendChild(card);
});

/* =========================================================
   RENDERIZA FUNCIONÁRIOS
========================================================= */
const equipeGrid = document.getElementById('equipeGrid');
FUNCIONARIOS.forEach(func => {
  const iniciais = func.nome.replace('Dra. ', '').split(' ').map(p => p[0]).slice(0, 2).join('');
  const card = document.createElement('article');
  card.className = 'func-card';
  card.innerHTML = `
    <div class="func-avatar" style="background:${func.cor}">${iniciais}</div>
    <h3>${func.nome}</h3>
    <p class="func-role">${func.cargo}</p>
    <ul class="func-quals">
      ${func.qualificacoes.map(q => `
        <li>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>
          <span>${q}</span>
        </li>`).join('')}
    </ul>
    <p class="func-bio">${func.bio}</p>
  `;
  equipeGrid.appendChild(card);
});

/* =========================================================
   AGENDAMENTO
========================================================= */
const agendaForm = document.getElementById('agendaForm');
const agendaSuccess = document.getElementById('agendaSuccess');
const servicoSelect = document.getElementById('ag-servico');
const funcionarioSelect = document.getElementById('ag-funcionario');
const dataInput = document.getElementById('ag-data');
const slotsGrid = document.getElementById('slotsGrid');
const slotsHint = document.getElementById('slotsHint');

// Preenche os selects a partir dos mesmos dados usados nos cards
SERVICOS.forEach(s => {
  const opt = document.createElement('option');
  opt.value = s.id;
  opt.textContent = s.nome;
  servicoSelect.appendChild(opt);
});
FUNCIONARIOS.forEach(f => {
  const opt = document.createElement('option');
  opt.value = f.id;
  opt.textContent = f.nome;
  funcionarioSelect.appendChild(opt);
});

// Data mínima = hoje
const hoje = new Date();
dataInput.min = hoje.toISOString().split('T')[0];

const HORARIOS = ['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00'];
let horarioSelecionado = null;

// Gera uma "ocupação" determinística por data, só para simular uma agenda real
function horariosOcupados(dataStr){
  let hash = 0;
  for (let i = 0; i < dataStr.length; i++) hash = (hash * 31 + dataStr.charCodeAt(i)) % 1000;
  const ocupados = new Set();
  ocupados.add(HORARIOS[hash % HORARIOS.length]);
  ocupados.add(HORARIOS[(hash + 3) % HORARIOS.length]);
  return ocupados;
}

function renderSlots(){
  slotsGrid.innerHTML = '';
  horarioSelecionado = null;
  atualizarResumo();

  if (!dataInput.value){
    slotsHint.textContent = 'Escolha uma data para ver os horários disponíveis.';
    return;
  }

  const ocupados = horariosOcupados(dataInput.value);
  slotsHint.textContent = 'Toque em um horário para selecioná-lo.';

  HORARIOS.forEach(hora => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'slot-btn';
    btn.textContent = hora;
    if (ocupados.has(hora)){
      btn.disabled = true;
    } else {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        horarioSelecionado = hora;
        atualizarResumo();
      });
    }
    slotsGrid.appendChild(btn);
  });
}

dataInput.addEventListener('change', renderSlots);

/* ---- Resumo lateral ao vivo ---- */
const resumoServico = document.getElementById('resumoServico');
const resumoFuncionario = document.getElementById('resumoFuncionario');
const resumoData = document.getElementById('resumoData');
const resumoHorario = document.getElementById('resumoHorario');

function formatarData(dataStr){
  if (!dataStr) return '—';
  const [ano, mes, dia] = dataStr.split('-');
  return `${dia}/${mes}/${ano}`;
}

function atualizarResumo(){
  const servico = SERVICOS.find(s => s.id === servicoSelect.value);
  const func = FUNCIONARIOS.find(f => f.id === funcionarioSelect.value);
  resumoServico.textContent = servico ? servico.nome : '—';
  resumoFuncionario.textContent = func ? func.nome : 'Sem preferência';
  resumoData.textContent = formatarData(dataInput.value);
  resumoHorario.textContent = horarioSelecionado || '—';
}

servicoSelect.addEventListener('change', atualizarResumo);
funcionarioSelect.addEventListener('change', atualizarResumo);

/* ---- Validação e envio ---- */
function setError(fieldEl, message){
  fieldEl.classList.toggle('invalid', Boolean(message));
  const errorEl = fieldEl.querySelector('.error-msg');
  if (errorEl) errorEl.textContent = message || '';
}

agendaForm.addEventListener('submit', function(e){
  e.preventDefault();
  let isValid = true;

  const tutorField = agendaForm.querySelector('[data-field="nomeTutor"]');
  const tutorVal = agendaForm.tutor.value.trim();
  if (tutorVal.length < 2){ setError(tutorField, 'Digite seu nome.'); isValid = false; }
  else setError(tutorField, '');

  const petField = agendaForm.querySelector('[data-field="nomePet"]');
  const petVal = agendaForm.pet.value.trim();
  if (petVal.length < 1){ setError(petField, 'Digite o nome do pet.'); isValid = false; }
  else setError(petField, '');

  const servicoField = agendaForm.querySelector('[data-field="servico"]');
  if (!servicoSelect.value){ setError(servicoField, 'Escolha um serviço.'); isValid = false; }
  else setError(servicoField, '');

  const dataField = agendaForm.querySelector('[data-field="data"]');
  if (!dataInput.value){ setError(dataField, 'Escolha uma data.'); isValid = false; }
  else setError(dataField, '');

  const horarioField = agendaForm.querySelector('[data-field="horario"]');
  if (!horarioSelecionado){ setError(horarioField, 'Escolha um horário disponível.'); isValid = false; }
  else setError(horarioField, '');

  if (!isValid){
    const firstInvalid = agendaForm.querySelector('.invalid input, .invalid select');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  const servico = SERVICOS.find(s => s.id === servicoSelect.value);
  const func = FUNCIONARIOS.find(f => f.id === funcionarioSelect.value);

  document.getElementById('agendaSuccessTitle').textContent = `Prontinho, ${tutorVal}! 🐾`;
  document.getElementById('agendaSuccessText').textContent =
    `${servico.nome} para ${petVal} em ${formatarData(dataInput.value)} às ${horarioSelecionado}` +
    (func ? ` com ${func.nome}.` : '.');

  agendaForm.classList.add('hide');
  agendaSuccess.classList.add('show');
});

document.getElementById('agendaResetBtn').addEventListener('click', function(){
  agendaForm.reset();
  document.querySelectorAll('#agendaForm .invalid').forEach(f => setError(f, ''));
  slotsGrid.innerHTML = '';
  slotsHint.textContent = 'Escolha uma data para ver os horários disponíveis.';
  horarioSelecionado = null;
  atualizarResumo();
  agendaSuccess.classList.remove('show');
  agendaForm.classList.remove('hide');
  agendaForm.tutor.focus();
});