// ===== Reckon Calculator — logic =====

const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');
const pad = document.getElementById('pad');

// Internal state
let currentInput = '0';   // the number currently being typed
let previousValue = null; // stored left-hand operand
let pendingOperator = null;
let expressionDisplay = ''; // human-readable running expression (top line)
let justEvaluated = false;  // true right after "=" so next digit starts fresh

const MAX_DIGITS = 14;

// Map our display operator symbols to real math operators
const OP_MAP = {
  '+': '+',
  '−': '-',
  '×': '*',
  '÷': '/'
};

function formatNumberForDisplay(numStr) {
  if (numStr === '' || numStr === undefined || numStr === null) return '0';
  if (numStr === 'Error') return numStr;

  const [intPart, decPart] = numStr.split('.');
  const negative = intPart.startsWith('-');
  const cleanInt = negative ? intPart.slice(1) : intPart;
  const withCommas = cleanInt.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  let out = (negative ? '-' : '') + withCommas;
  if (decPart !== undefined) out += '.' + decPart;
  return out;
}

function updateScreen() {
  expressionEl.textContent = expressionDisplay || '\u00A0';
  resultEl.textContent = formatNumberForDisplay(currentInput);
  resultEl.classList.toggle('is-error', currentInput === 'Error');

  // shrink long numbers so they still fit on one line
  const len = resultEl.textContent.length;
  if (len > 12) {
    resultEl.style.fontSize = '26px';
  } else if (len > 9) {
    resultEl.style.fontSize = '32px';
  } else {
    resultEl.style.fontSize = '';
  }
}

function resetAll() {
  currentInput = '0';
  previousValue = null;
  pendingOperator = null;
  expressionDisplay = '';
  justEvaluated = false;
  updateScreen();
}

function backspace() {
  if (justEvaluated || currentInput === 'Error') {
    resetAll();
    return;
  }
  if (currentInput.length <= 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
    currentInput = '0';
  } else {
    currentInput = currentInput.slice(0, -1);
  }
  updateScreen();
}

function inputDigit(digit) {
  if (currentInput === 'Error' || justEvaluated) {
    currentInput = digit;
    expressionDisplay = '';
    justEvaluated = false;
  } else if (currentInput === '0') {
    currentInput = digit;
  } else if (currentInput.replace('-', '').replace('.', '').length < MAX_DIGITS) {
    currentInput += digit;
  }
  updateScreen();
}

function inputDecimal() {
  if (currentInput === 'Error' || justEvaluated) {
    currentInput = '0.';
    expressionDisplay = '';
    justEvaluated = false;
  } else if (!currentInput.includes('.')) {
    currentInput += '.';
  }
  updateScreen();
}

function applyOperator(opSymbol) {
  if (currentInput === 'Error') return;

  const inputValue = parseFloat(currentInput);

  if (pendingOperator && !justEvaluated && previousValue !== null) {
    // chain: compute the running total first
    const computed = compute(previousValue, inputValue, pendingOperator);
    if (computed === null) {
      showError();
      return;
    }
    previousValue = computed;
  } else {
    previousValue = inputValue;
  }

  pendingOperator = opSymbol;
  justEvaluated = false;
  expressionDisplay = `${formatNumberForDisplay(trimFloat(previousValue))} ${opSymbol}`;
  currentInput = '0';
  updateScreen();
}

function compute(a, b, opSymbol) {
  const op = OP_MAP[opSymbol];
  let res;
  switch (op) {
    case '+': res = a + b; break;
    case '-': res = a - b; break;
    case '*': res = a * b; break;
    case '/':
      if (b === 0) return null; // divide by zero guard
      res = a / b;
      break;
    default: return null;
  }
  // guard against floating point noise (0.1 + 0.2 etc.)
  return Math.round((res + Number.EPSILON) * 1e10) / 1e10;
}

function trimFloat(n) {
  return Number.isFinite(n) ? String(n) : 'Error';
}

function showError() {
  currentInput = 'Error';
  previousValue = null;
  pendingOperator = null;
  expressionDisplay = '';
  justEvaluated = true;
  updateScreen();
}

function equals() {
  if (currentInput === 'Error') return;
  if (pendingOperator === null || previousValue === null) return;

  const inputValue = parseFloat(currentInput);
  const fullExpression = `${formatNumberForDisplay(trimFloat(previousValue))} ${pendingOperator} ${formatNumberForDisplay(currentInput)} =`;
  const result = compute(previousValue, inputValue, pendingOperator);

  if (result === null) {
    showError();
    return;
  }

  expressionDisplay = fullExpression;
  currentInput = trimFloat(result);
  previousValue = null;
  pendingOperator = null;
  justEvaluated = true;
  updateScreen();
}

function percent() {
  if (currentInput === 'Error') return;
  const value = parseFloat(currentInput) / 100;
  currentInput = trimFloat(value);
  updateScreen();
}

// ===== Button press handling (with visual feedback) =====
function flashKey(btn) {
  btn.classList.add('is-pressed');
  setTimeout(() => btn.classList.remove('is-pressed'), 110);
}

pad.addEventListener('click', (e) => {
  const btn = e.target.closest('.key');
  if (!btn) return;
  flashKey(btn);

  const action = btn.dataset.action;
  const value = btn.dataset.value;

  switch (action) {
    case 'number': inputDigit(value); break;
    case 'decimal': inputDecimal(); break;
    case 'operator': applyOperator(value); break;
    case 'equals': equals(); break;
    case 'clear': resetAll(); break;
    case 'backspace': backspace(); break;
    case 'percent': percent(); break;
  }
});

// ===== Keyboard support =====
const KEY_TO_OP = { '+': '+', '-': '−', '*': '×', '/': '÷' };

function findKeyButton(action, value) {
  return pad.querySelector(
    value !== undefined
      ? `.key[data-action="${action}"][data-value="${value}"]`
      : `.key[data-action="${action}"]`
  );
}

window.addEventListener('keydown', (e) => {
  const { key } = e;

  if (/^[0-9]$/.test(key)) {
    inputDigit(key);
    flashKey(findKeyButton('number', key));
    return;
  }

  if (key === '.') {
    inputDecimal();
    flashKey(findKeyButton('decimal'));
    return;
  }

  if (['+', '-', '*', '/'].includes(key)) {
    const symbol = KEY_TO_OP[key];
    applyOperator(symbol);
    flashKey(findKeyButton('operator', symbol));
    return;
  }

  if (key === 'Enter' || key === '=') {
    e.preventDefault();
    equals();
    flashKey(findKeyButton('equals'));
    return;
  }

  if (key === 'Backspace') {
    backspace();
    flashKey(findKeyButton('backspace'));
    return;
  }

  if (key === 'Escape') {
    resetAll();
    flashKey(findKeyButton('clear'));
    return;
  }

  if (key === '%') {
    percent();
    flashKey(findKeyButton('percent'));
    return;
  }
});

// initial paint
updateScreen();