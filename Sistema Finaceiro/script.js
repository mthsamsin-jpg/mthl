(function(){

  /* ------------------------------------------------------------
     Dados de categorias
     ------------------------------------------------------------ */
  const CATS = {
    in:  [
      {name:'Salário', color:'#4fae8b'},
      {name:'Freelance', color:'#d4af37'},
      {name:'Investimentos', color:'#5b8c8a'}
    ],
    out: [
      {name:'Moradia', color:'#c97b4a'},
      {name:'Alimentação', color:'#e2664b'},
      {name:'Transporte', color:'#5b8c8a'},
      {name:'Lazer', color:'#d4af37'},
      {name:'Saúde', color:'#7fa98b'},
      {name:'Outros', color:'#9fb8b2'}
    ]
  };

  function catColor(name){
    const all = [...CATS.in, ...CATS.out];
    const f = all.find(c=>c.name===name);
    return f ? f.color : '#9fb8b2';
  }

  /* ------------------------------------------------------------
     Dados iniciais (troque por dados reais quando quiser)
     ------------------------------------------------------------ */
  let transactions = [
    {desc:'Salário — Empresa Alfa', cat:'Salário', type:'in', val:6200, date:'2026-07-01'},
    {desc:'Aluguel', cat:'Moradia', type:'out', val:1650, date:'2026-07-02'},
    {desc:'Supermercado Pão de Açúcar', cat:'Alimentação', type:'out', val:480.32, date:'2026-07-06'},
    {desc:'Projeto freelance — site', cat:'Freelance', type:'in', val:1200, date:'2026-07-09'},
    {desc:'Uber e transporte', cat:'Transporte', type:'out', val:210.5, date:'2026-07-12'},
    {desc:'Cinema com amigos', cat:'Lazer', type:'out', val:96, date:'2026-07-15'},
    {desc:'Farmácia', cat:'Saúde', type:'out', val:145.9, date:'2026-07-19'},
    {desc:'Dividendos — carteira', cat:'Investimentos', type:'in', val:340, date:'2026-07-21'}
  ];

  const monthHistory = [8200, 8850, 8100, 9400, 9900, 10650, 11200];
  const monthLabels = ['Fev','Mar','Abr','Mai','Jun','Jul','Ago'];

  /* ------------------------------------------------------------
     Formatação
     ------------------------------------------------------------ */
  const fmt = n => n.toLocaleString('pt-BR', {minimumFractionDigits:0, maximumFractionDigits:0});
  const fmtCents = n => (Math.abs(n) % 1).toFixed(2).slice(2);
  const fmtFull = n => 'R$ ' + n.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2});

  function totals(){
    const inc = transactions.filter(t=>t.type==='in').reduce((s,t)=>s+t.val,0);
    const out = transactions.filter(t=>t.type==='out').reduce((s,t)=>s+t.val,0);
    return {inc, out, bal: inc - out};
  }

  function animateNumber(el, target, opts={}){
    const dur = opts.dur || 1100;
    const isCurrency = opts.currency;
    const t0 = performance.now();
    function tick(now){
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1-p, 3);
      const val = target * eased;
      el.textContent = isCurrency ? 'R$ ' + fmt(val) : fmt(val);
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ------------------------------------------------------------
     Gráfico "pulso" (SVG que se desenha sozinho)
     ------------------------------------------------------------ */
  function buildPulsePath(values){
    const w = 700, h = 150, pad = 10;
    const max = Math.max(...values), min = Math.min(...values);
    const range = (max - min) || 1;
    const step = w / (values.length - 1);
    const pts = values.map((v,i)=>{
      const x = i*step;
      const y = h - pad - ((v - min)/range) * (h - pad*2);
      return [x,y];
    });
    let d = `M ${pts[0][0]},${pts[0][1]}`;
    for(let i=1;i<pts.length;i++){
      const [x0,y0]=pts[i-1], [x1,y1]=pts[i];
      const mx = (x0+x1)/2;
      d += ` C ${mx},${y0} ${mx},${y1} ${x1},${y1}`;
    }
    const area = d + ` L ${pts[pts.length-1][0]},${h} L ${pts[0][0]},${h} Z`;
    return {line:d, area, last:pts[pts.length-1]};
  }

  function renderPulse(){
    const {line, area, last} = buildPulsePath(monthHistory);
    document.getElementById('linePath').setAttribute('d', line);
    document.getElementById('areaPath').setAttribute('d', area);
    const dot = document.getElementById('pulseDot');
    dot.setAttribute('cx', last[0]);
    dot.setAttribute('cy', last[1]);
    document.getElementById('pulseMonths').innerHTML = monthLabels.map(m=>`<span>${m}</span>`).join('');
  }

  function renderSpark(id, seed){
    const el = document.getElementById(id);
    el.innerHTML = '';
    for(let i=0;i<12;i++){
      const bar = document.createElement('i');
      const h = 20 + Math.abs(Math.sin(seed + i*1.3)) * 80;
      bar.style.height = h + '%';
      bar.style.animationDelay = (i*0.03) + 's';
      el.appendChild(bar);
    }
  }

  function renderDonut(){
    const out = transactions.filter(t=>t.type==='out');
    const byCat = {};
    out.forEach(t=>{ byCat[t.cat] = (byCat[t.cat]||0) + t.val; });
    const entries = Object.entries(byCat).sort((a,b)=>b[1]-a[1]);
    const total = entries.reduce((s,[,v])=>s+v,0) || 1;

    let acc = 0;
    const stops = entries.map(([name,val])=>{
      const start = acc/total*360;
      acc += val;
      const end = acc/total*360;
      return `${catColor(name)} ${start}deg ${end}deg`;
    }).join(', ');
    document.getElementById('donut').style.setProperty('--donut-stops', stops || 'var(--muted) 0 360deg');
    document.getElementById('donutTop').textContent = entries.length ? entries[0][0] : '—';

    const legend = document.getElementById('legend');
    legend.innerHTML = entries.map(([name,val])=>`
      <div class="legend-item">
        <span class="sw" style="background:${catColor(name)}"></span>
        <span class="lname">${name}</span>
        <span class="lval mono">${fmtFull(val)}</span>
      </div>
    `).join('') || '<div class="legend-item"><span class="lname" style="color:var(--muted)">Sem despesas ainda</span></div>';
  }

  let currentFilter = 'all';

  function renderTable(highlightFirst){
    const body = document.getElementById('txBody');
    const rows = [...transactions].reverse().filter(t=>{
      if(currentFilter==='all') return true;
      return t.type === currentFilter;
    });

    if(!rows.length){
      body.innerHTML = '<tr class="empty-row"><td colspan="3">Nenhuma transação nesta visão ainda.</td></tr>';
      return;
    }

    body.innerHTML = rows.map((t,i)=>`
      <tr class="${highlightFirst && i===0 ? 'new-row' : ''}">
        <td>
          <div class="desc-cell">
            <span class="cat-dot" style="background:${catColor(t.cat)}"></span>
            <div>
              <div class="desc-main">${t.desc}</div>
              <div class="desc-cat">${t.cat}</div>
            </div>
          </div>
        </td>
        <td class="date-cell">${new Date(t.date+'T00:00:00').toLocaleDateString('pt-BR', {day:'2-digit', month:'short'})}</td>
        <td style="text-align:right;" class="amount ${t.type} mono">${t.type==='in'?'+':'−'} ${fmtFull(t.val)}</td>
      </tr>
    `).join('');
  }

  function renderAll(highlightFirst){
    const {inc, out, bal} = totals();

    animateNumber(document.getElementById('balanceMain'), bal, {currency:true});
    document.getElementById('balanceCents').textContent = ',' + fmtCents(bal);
    animateNumber(document.getElementById('statIn'), inc, {currency:true});
    animateNumber(document.getElementById('statOut'), out, {currency:true});
    animateNumber(document.getElementById('cardIn'), inc, {currency:true});
    animateNumber(document.getElementById('cardOut'), out, {currency:true});

    const rate = inc > 0 ? Math.max(0, Math.round(((inc-out)/inc)*100)) : 0;
    document.getElementById('cardRate').textContent = rate + '%';

    const prevMonth = monthHistory[monthHistory.length-2];
    const deltaPct = prevMonth ? Math.round(((bal - prevMonth)/prevMonth)*100) : 0;
    const deltaEl = document.getElementById('balanceDelta');
    if(deltaPct >= 0){
      deltaEl.textContent = `▲ ${deltaPct}% em relação ao mês anterior`;
      deltaEl.classList.remove('down');
    } else {
      deltaEl.textContent = `▼ ${Math.abs(deltaPct)}% em relação ao mês anterior`;
      deltaEl.classList.add('down');
    }

    document.getElementById('goalCurrent').textContent = fmtFull(Math.max(0,bal));
    const goalPct = Math.min(100, Math.max(0, (bal/15000)*100));
    requestAnimationFrame(()=> document.getElementById('goalFill').style.width = goalPct + '%');

    renderDonut();
    renderTable(highlightFirst);
    renderSpark('sparkIn', 1.1);
    renderSpark('sparkOut', 2.4);
  }

  function refreshCatOptions(type){
    const sel = document.getElementById('catInput');
    sel.innerHTML = CATS[type].map(c=>`<option value="${c.name}">${c.name}</option>`).join('');
  }

  /* ------------------------------------------------------------
     Inicialização
     ------------------------------------------------------------ */
  renderPulse();
  refreshCatOptions('in');
  renderAll(false);

  /* ------------------------------------------------------------
     Filtros da tabela
     ------------------------------------------------------------ */
  document.querySelectorAll('.chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{
      document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.dataset.filter;
      renderTable(false);
    });
  });

  /* ------------------------------------------------------------
     Modal de nova transação
     ------------------------------------------------------------ */
  const overlay = document.getElementById('overlay');
  let modalType = 'in';

  document.getElementById('openModal').addEventListener('click', ()=>{
    overlay.classList.add('open');
    document.getElementById('descInput').focus();
  });
  document.getElementById('cancelModal').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e)=>{ if(e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });

  function closeModal(){ overlay.classList.remove('open'); document.getElementById('txForm').reset(); }

  document.querySelectorAll('.type-toggle button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.type-toggle button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      modalType = btn.dataset.type;
      refreshCatOptions(modalType);
    });
  });

  document.getElementById('txForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const desc = document.getElementById('descInput').value.trim();
    const cat = document.getElementById('catInput').value;
    const val = parseFloat(document.getElementById('valInput').value);
    if(!desc || !val || val <= 0) return;

    transactions.push({
      desc, cat, type: modalType, val,
      date: new Date().toISOString().slice(0,10)
    });

    closeModal();
    renderAll(true);
  });

  /* ------------------------------------------------------------
     Efeito ripple nos botões
     ------------------------------------------------------------ */
  document.querySelectorAll('.btn').forEach(btn=>{
    btn.addEventListener('click', function(e){
      const rect = this.getBoundingClientRect();
      const r = document.createElement('span');
      r.className = 'ripple';
      r.style.left = (e.clientX - rect.left) + 'px';
      r.style.top = (e.clientY - rect.top) + 'px';
      this.appendChild(r);
      setTimeout(()=>r.remove(), 650);
    });
  });

  /* ------------------------------------------------------------
     Exportar (demonstração)
     ------------------------------------------------------------ */
  document.getElementById('exportBtn').addEventListener('click', ()=>{
    const btn = document.getElementById('exportBtn');
    const original = btn.textContent;
    btn.textContent = 'Extrato gerado ✓';
    setTimeout(()=> btn.textContent = original, 1600);
  });

  /* ------------------------------------------------------------
     Menu mobile (gaveta lateral)
     Isso é o que faz a barra lateral virar um menu deslizante
     quando a tela é pequena (celular/tablet)
     ------------------------------------------------------------ */
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('drawerBackdrop');
  const menuToggle = document.getElementById('menuToggle');
  const sidebarClose = document.getElementById('sidebarClose');

  function openDrawer(){
    sidebar.classList.add('open');
    backdrop.classList.add('open');
  }
  function closeDrawer(){
    sidebar.classList.remove('open');
    backdrop.classList.remove('open');
  }

  menuToggle.addEventListener('click', openDrawer);
  sidebarClose.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  // fecha a gaveta automaticamente ao clicar em um item do menu
  document.querySelectorAll('.nav-item').forEach(item=>{
    item.addEventListener('click', closeDrawer);
  });

  // se a tela for redimensionada para desktop, garante que a gaveta feche
  window.addEventListener('resize', ()=>{
    if(window.innerWidth > 900) closeDrawer();
  });

})();