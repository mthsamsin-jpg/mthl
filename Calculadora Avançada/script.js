(function(){
  "use strict";
 
  /* ---------------------------------------------------------
   *  MOTOR DE CÁLCULO
   *  Tokenizador + parser recursivo (sem uso de eval).
   *  Suporta: + - × ÷ ^ (potência) √ (raiz) % (percentual) ()
   * --------------------------------------------------------- */
 
  const TokenType = {
    NUMBER: "NUMBER", PLUS: "PLUS", MINUS: "MINUS", MUL: "MUL", DIV: "DIV",
    POW: "POW", PERCENT: "PERCENT", SQRT: "SQRT", LPAREN: "LPAREN",
    RPAREN: "RPAREN", EOF: "EOF"
  };
 
  function tokenize(input){
    const tokens = [];
    let i = 0;
    const n = input.length;
    while (i < n){
      const ch = input[i];
      if (ch === " "){ i++; continue; }
      if (/[0-9.]/.test(ch)){
        let start = i;
        let sawDot = false;
        while (i < n && /[0-9.]/.test(input[i])){
          if (input[i] === ".") {
            if (sawDot) break;
            sawDot = true;
          }
          i++;
        }
        const raw = input.slice(start, i);
        if (raw === "." || raw === "") throw new Error("Número inválido");
        tokens.push({ type: TokenType.NUMBER, value: parseFloat(raw) });
        continue;
      }
      switch(ch){
        case "+": tokens.push({type:TokenType.PLUS}); i++; break;
        case "−":
        case "-": tokens.push({type:TokenType.MINUS}); i++; break;
        case "×":
        case "*": tokens.push({type:TokenType.MUL}); i++; break;
        case "÷":
        case "/": tokens.push({type:TokenType.DIV}); i++; break;
        case "^": tokens.push({type:TokenType.POW}); i++; break;
        case "%": tokens.push({type:TokenType.PERCENT}); i++; break;
        case "√": tokens.push({type:TokenType.SQRT}); i++; break;
        case "(": tokens.push({type:TokenType.LPAREN}); i++; break;
        case ")": tokens.push({type:TokenType.RPAREN}); i++; break;
        default:
          throw new Error("Caractere inesperado: " + ch);
      }
    }
    tokens.push({type:TokenType.EOF});
    return tokens;
  }
 
  /*
   * Gramática (precedência crescente):
   *   expression := term (('+'|'-') term)*
   *   term       := power (('*'|'/') power)*
   *   power      := postfix ('^' power)?           // associa à direita
   *   postfix    := unary ('%')*                    // 50 -> 0.5, encadeável
   *   unary      := '-' unary | '√' unary | primary
   *   primary    := NUMBER | '(' expression ')'
   *
   * Multiplicação implícita é aceita entre um valor e um '(' ou '√'
   * subsequente (ex.: "2(3+1)" ou "2√9"), como em calculadoras científicas.
   */
  function parse(tokens){
    let pos = 0;
    const peek = () => tokens[pos];
    const advance = () => tokens[pos++];
    const expectImplicitMulAhead = () => {
      const t = peek();
      return t.type === TokenType.LPAREN || t.type === TokenType.SQRT;
    };
 
    function parsePrimary(){
      const t = peek();
      if (t.type === TokenType.NUMBER){ advance(); return t.value; }
      if (t.type === TokenType.LPAREN){
        advance();
        const val = parseExpression();
        if (peek().type !== TokenType.RPAREN){
          throw new Error("Parêntese não fechado");
        }
        advance();
        return val;
      }
      throw new Error("Expressão inválida");
    }
 
    function parseUnary(){
      const t = peek();
      if (t.type === TokenType.MINUS){ advance(); return -parseUnary(); }
      if (t.type === TokenType.SQRT){
        advance();
        const val = parseUnary();
        if (val < 0) throw new Error("Raiz de número negativo");
        return Math.sqrt(val);
      }
      let val = parsePrimary();
      if (expectImplicitMulAhead()){
        val = val * parseUnary();
      }
      return val;
    }
 
    function parsePostfix(){
      let val = parseUnary();
      while (peek().type === TokenType.PERCENT){
        advance();
        val = val / 100;
      }
      return val;
    }
 
    function parsePower(){
      let base = parsePostfix();
      if (peek().type === TokenType.POW){
        advance();
        const exponent = parsePower(); // associatividade à direita
        return Math.pow(base, exponent);
      }
      return base;
    }
 
    function parseTerm(){
      let val = parsePower();
      while (peek().type === TokenType.MUL || peek().type === TokenType.DIV){
        const op = advance();
        const rhs = parsePower();
        if (op.type === TokenType.MUL){ val = val * rhs; }
        else {
          if (rhs === 0) throw new Error("Divisão por zero");
          val = val / rhs;
        }
      }
      return val;
    }
 
    function parseExpression(){
      let val = parseTerm();
      while (peek().type === TokenType.PLUS || peek().type === TokenType.MINUS){
        const op = advance();
        const rhs = parseTerm();
        val = (op.type === TokenType.PLUS) ? val + rhs : val - rhs;
      }
      return val;
    }
 
    const result = parseExpression();
    if (peek().type !== TokenType.EOF){
      throw new Error("Expressão malformada");
    }
    return result;
  }
 
  function balanceParens(str){
    let open = 0;
    for (const ch of str){
      if (ch === "(") open++;
      if (ch === ")") open--;
    }
    return open > 0 ? str + ")".repeat(open) : str;
  }
 
  function evaluate(str){
    const balanced = balanceParens(str);
    const tokens = tokenize(balanced);
    const value = parse(tokens);
    if (!isFinite(value)) throw new Error("Resultado indefinido");
    return value;
  }
 
  function formatNumber(num){
    if (Object.is(num, -0)) num = 0;
    // evita ruído de ponto flutuante (ex.: 0.1 + 0.2)
    const rounded = Math.round((num + Number.EPSILON) * 1e12) / 1e12;
    let s = rounded.toString();
    if (s.length > 15 && s.includes(".")){
      s = rounded.toPrecision(12).replace(/\.?0+$/,"");
    }
    if (Math.abs(rounded) >= 1e15 || (Math.abs(rounded) < 1e-9 && rounded !== 0)){
      s = rounded.toExponential(6);
    }
    return s;
  }
 
  /* ---------------------------------------------------------
   *  ESTADO E INTERFACE
   * --------------------------------------------------------- */
 
  const expressionEl = document.getElementById("expression");
  const resultEl = document.getElementById("result");
  const keypad = document.getElementById("keypad");
 
  let expr = "";          // expressão sendo construída (símbolos de exibição)
  let justEvaluated = false;
 
  function render(){
    expressionEl.textContent = expr.length ? expr : "\u00A0";
    resultEl.textContent = expr.length ? previewOrLast() : "0";
    autoScrollRight(expressionEl);
    autoScrollRight(resultEl);
  }
 
  function autoScrollRight(el){
    requestAnimationFrame(() => { el.scrollLeft = el.scrollWidth; });
  }
 
  function previewOrLast(){
    try {
      const val = evaluate(expr);
      return formatNumber(val);
    } catch(e){
      return resultEl.dataset.last || "0";
    }
  }
 
  function flashError(){
    resultEl.textContent = "Erro";
    resultEl.classList.add("error");
    setTimeout(() => resultEl.classList.remove("error"), 400);
  }
 
  function pulseResult(){
    resultEl.classList.remove("pulse");
    void resultEl.offsetWidth;
    resultEl.classList.add("pulse");
  }
 
  const lastCharIsDigitOrDot = () => /[0-9.]$/.test(expr);
  const lastCharIsOperator = () => /[+\-−×÷^]$/.test(expr);
 
  function appendDigit(d){
    if (justEvaluated){
      expr = "";
      justEvaluated = false;
    }
    if (d === "." ){
      // impede múltiplos pontos no número atual
      const tailMatch = expr.match(/(\d*\.?\d*)$/);
      if (tailMatch && tailMatch[0].includes(".")) return;
      if (!/\d$/.test(expr) && expr !== "") {
        // ok, "." pode iniciar um novo número após operador
      }
    }
    expr += d;
    render();
  }
 
  function appendOperator(op){
    if (justEvaluated){
      justEvaluated = false;
    }
    if (expr === "" ){
      if (op === "−"){ expr = "−"; render(); return; } // permite negativo inicial
      return;
    }
    if (lastCharIsOperator()){
      expr = expr.slice(0, -1) + op; // substitui operador repetido
    } else {
      expr += op;
    }
    render();
  }
 
  function appendSqrt(){
    if (justEvaluated){ expr = ""; justEvaluated = false; }
    expr += "√(";
    render();
  }
 
  function appendPow(){
    if (expr === "" || lastCharIsOperator()) return;
    if (justEvaluated) justEvaluated = false;
    expr += "^";
    render();
  }
 
  function appendPercent(){
    if (!lastCharIsDigitOrDot() && !expr.endsWith(")")) return;
    expr += "%";
    render();
  }
 
  function appendParen(type){
    if (justEvaluated){ expr = ""; justEvaluated = false; }
    if (type === "open"){
      expr += "(";
    } else {
      const opens = (expr.match(/\(/g)||[]).length;
      const closes = (expr.match(/\)/g)||[]).length;
      if (opens > closes) expr += ")";
    }
    render();
  }
 
  function backspace(){
    if (justEvaluated){
      expr = "";
      justEvaluated = false;
      render();
      return;
    }
    if (expr.endsWith("√(")) expr = expr.slice(0, -2);
    else expr = expr.slice(0, -1);
    render();
  }
 
  function clearAll(){
    expr = "";
    justEvaluated = false;
    resultEl.dataset.last = "0";
    render();
  }
 
  function toggleSign(){
    const match = expr.match(/(-?\d+\.?\d*)$/);
    if (!match) return;
    const num = match[1];
    const start = expr.length - num.length;
    const before = expr.slice(0, start);
    const newNum = num.startsWith("-") ? num.slice(1) : "-" + num;
    expr = before + newNum;
    render();
  }
 
  function doEquals(){
    if (expr === "") return;
    try {
      const value = evaluate(expr);
      const formatted = formatNumber(value);
      resultEl.dataset.last = formatted;
      expr = formatted; // resultado vira ponto de partida da próxima operação
      justEvaluated = true;
      resultEl.textContent = formatted;
      expressionEl.textContent = "= " + formatted;
      pulseResult();
    } catch(e){
      flashError();
    }
  }
 
  function ripple(btn){
    btn.classList.remove("ripple");
    void btn.offsetWidth;
    btn.classList.add("ripple");
  }
 
  keypad.addEventListener("click", (e) => {
    const btn = e.target.closest("button.key");
    if (!btn) return;
    ripple(btn);
    const action = btn.dataset.action;
    const value = btn.dataset.value;
 
    switch(action){
      case "digit": appendDigit(value); break;
      case "op": appendOperator(value); break;
      case "sqrt": appendSqrt(); break;
      case "pow": appendPow(); break;
      case "percent": appendPercent(); break;
      case "paren-open": appendParen("open"); break;
      case "paren-close": appendParen("close"); break;
      case "backspace": backspace(); break;
      case "clear": clearAll(); break;
      case "sign": toggleSign(); break;
      case "equals": doEquals(); break;
    }
  });
 
  /* ---------------------------------------------------------
   *  SUPORTE A TECLADO FÍSICO
   * --------------------------------------------------------- */
  const keyMap = {
    "+": () => appendOperator("+"),
    "-": () => appendOperator("−"),
    "*": () => appendOperator("×"),
    "/": () => appendOperator("÷"),
    "^": () => appendPow(),
    "%": () => appendPercent(),
    "(": () => appendParen("open"),
    ")": () => appendParen("close"),
    "Enter": () => doEquals(),
    "=": () => doEquals(),
    "Backspace": () => backspace(),
    "Escape": () => clearAll(),
    ".": () => appendDigit("."),
  };
 
  window.addEventListener("keydown", (e) => {
    if (/^[0-9]$/.test(e.key)){ appendDigit(e.key); return; }
    if (keyMap[e.key]){
      e.preventDefault();
      keyMap[e.key]();
      // destaca visualmente o botão correspondente, se existir
      const map = {"+":"+","-":"−","*":"×","/":"÷","Enter":"=","=":"="};
      return;
    }
    if (e.key.toLowerCase() === "r"){ appendSqrt(); }
  });
 
  render();
})();
