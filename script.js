let display = document.getElementById("display");
let currentInput = "";
let lastResult = null;

function appendNumber(value) {
    currentInput += value;
    updateDisplay();
}

function appendOperator(operator) {
    // Não permite operador como primeiro caractere, exceto - ou .
    if (currentInput === "" && operator !== "-" && operator !== ".") return;
    
    // Não permite dois operadores seguidos
    let lastChar = currentInput.slice(-1);
    if (isOperator(lastChar) && isOperator(operator)) {
        currentInput = currentInput.slice(0, -1) + operator;
    } else {
        currentInput += operator;
    }
    updateDisplay();
}

function isOperator(char) {
    return ['+', '-', '*', '/', '%'].includes(char);
}

function clearDisplay() {
    currentInput = "";
    lastResult = null;
    updateDisplay();
}

function appendLastResult() {
    if (lastResult !== null) {
        currentInput += lastResult.toString();
        updateDisplay();
    }
}

function calculate() {
    if (currentInput === "") return;

    try {
        // Tratamento especial para porcentagem
        let expression = currentInput.replace(/%/g, '/100');
        
        // Avalia a expressão
        let result = eval(expression);

        // Verifica se o resultado é válido
        if (!isFinite(result)) {
            throw new Error("Resultado inválido");
        }

        // Formata o resultado para no máximo 8 dígitos
        result = parseFloat(result.toFixed(8));
        
        currentInput = result.toString();
        lastResult = result;
        updateDisplay();
    } catch (error) {
        currentInput = "Erro";
        updateDisplay();
        setTimeout(clearDisplay, 1500);
    }
}

function updateDisplay() {
    display.textContent = currentInput || "0";
}
