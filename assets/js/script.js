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

// Custom Cursor JS (Performance & Smoothness)
const customCursor = document.createElement('div');
customCursor.classList.add('custom-cursor');
document.body.appendChild(customCursor);

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let cursorX = mouseX;
let cursorY = mouseY;

document.addEventListener('mousemove', (e) => {
    customCursor.style.display = 'block';
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Esconde o cursor JS e volta para o mouse do sistema ao entrar no SoundCloud (iframe iframe cruza dominio nulo)
document.addEventListener('mouseout', (e) => {
    if (e.relatedTarget === null) {
        customCursor.style.display = 'none';
    }
});

function animateCursor() {
    // Interpolação super suave acompanhando o mouse (LERP de 30%)
    cursorX += (mouseX - cursorX) * 0.3;
    cursorY += (mouseY - cursorY) * 0.3;
    
    // Transição por hardware acceleration 3d evita todo tipo de "bug" de frame (travar)
    customCursor.style.transform = `translate3d(calc(${cursorX}px - 50%), calc(${cursorY}px - 50%), 0)`;
    requestAnimationFrame(animateCursor);
}
requestAnimationFrame(animateCursor);

// --- Custom SoundCloud Player Controls ---
const iframeElement = document.getElementById('sc-widget');
const widget = SC.Widget(iframeElement);
const playBtn = document.getElementById('play-btn');

let isPlaying = false;

widget.bind(SC.Widget.Events.PLAY, function() {
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    
    // Pula o primeiro minuto de todas as músicas sempre que começarem
    widget.getPosition(function(pos) {
        if (pos < 60000) {
            widget.seekTo(60000);
        }
    });
});

widget.bind(SC.Widget.Events.PAUSE, function() {
    isPlaying = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
});

function togglePlay() {
    widget.toggle();
}

function prevTrack() {
    widget.prev();
}

function nextTrack() {
    widget.next();
}

// Controle de Volume 
const volumeSlider = document.getElementById('volume-slider');
const volIcon = document.getElementById('vol-icon');

volumeSlider.addEventListener('input', function(e) {
    const vol = e.target.value;
    
    // Atualiza volume da SDK SoundCloud (escala de 0 a 100)
    widget.setVolume(vol);

    // Altera o desenho do megafone visual de acordo com o nível da barra
    if (vol == 0) {
        volIcon.className = "fas fa-volume-mute";
    } else if (vol <= 40) {
        volIcon.className = "fas fa-volume-down";
    } else {
        volIcon.className = "fas fa-volume-up";
    }
});

// Seta o primeiro som estático de fábrica para metade quando API acorda
widget.bind(SC.Widget.Events.READY, function() {
    widget.setVolume(50);
});

// Avança para a próxima música quando a atual terminar
widget.bind(SC.Widget.Events.FINISH, function() {
    widget.next();
});

// Theme Toggle Function
function toggleTheme() {
    const isKuromi = document.body.classList.toggle('kuromi-theme');
    const themeBtn = document.getElementById('theme-btn');
    const headerIcon = document.getElementById('header-icon');
    const headerTitle = document.getElementById('header-title');
    
    if (isKuromi) {
        themeBtn.innerHTML = '<img src="https://i.pinimg.com/originals/38/76/29/38762926647ad190c0e55f6a7f64f990.png" alt="Voltar Tema" style="width: 35px; height: 35px;">';
        headerIcon.src = 'https://i.pinimg.com/originals/74/e9/e2/74e9e274b74cc0c27d3e0a83e0c16500.png';
        headerTitle.textContent = 'Planejador Financeiro da Kuromi';
        currentEmojis = null;
    } else {
        themeBtn.innerHTML = '<img src="https://i.pinimg.com/originals/53/ea/85/53ea855d85bcf99af50e2c7d64b016f3.png" alt="Tema" style="width: 35px; height: 35px;">';
        headerIcon.src = 'https://i.pinimg.com/originals/cf/e6/f2/cfe6f26807e632be0f532467f722ac3e.png';
        headerTitle.textContent = 'Calculadora & Planejador Financeiro';
        currentEmojis = null;
    }
}

// Suporte para o teclado físico (incluindo teclado numérico)
document.addEventListener('keydown', (e) => {
    // Ignora se estiver focado em algum input como o slider de volume
    if (e.target.tagName === 'INPUT') return;

    const key = e.key;

    // Números
    if (/^[0-9]$/.test(key)) {
        appendNumber(key);
    } 
    // Vírgula e Ponto
    else if (key === '.' || key === ',') {
        appendOperator('.');
    } 
    // Operadores Matemáticos
    else if (['+', '-', '*', '/', '%'].includes(key)) {
        // Evita comportamento padrão do '/' (pesquisa rápida no Firefox)
        if (key === '/') e.preventDefault();
        appendOperator(key);
    } 
    // Enter / Igual = Calcular
    else if (key === 'Enter' || key === '=') {
        e.preventDefault(); // Evita cliques acidentais se um botão estiver focado
        calculate();
    } 
    // Apagar um número por vez com Backspace
    else if (key === 'Backspace') {
        if (currentInput && currentInput !== "Erro" && currentInput !== "Errado!") {
            currentInput = currentInput.slice(0, -1);
            updateDisplay();
        }
    } 
    // Botão Esc ou C = Limpar tudo
    else if (key === 'Escape' || key.toLowerCase() === 'c') {
        clearDisplay();
    }
});

// --- Planejador Financeiro (Budget Planner) ---
let transactions = JSON.parse(localStorage.getItem('minhasTransacoes')) || [];
let budgetChart = null;

function addTransaction(type) {
    if (currentInput === "" || currentInput === "Erro" || currentInput === "Errado!") {
        alert("Realize um cálculo ou digite um valor primeiro! 🌸");
        return;
    }
    const amount = parseFloat(currentInput);
    if (isNaN(amount) || amount <= 0) {
        alert("Por favor, insira um valor positivo! 🌸");
        return;
    }
    let desc = prompt("Com o que foi esse valor? (Ex: Lanche, Mesada...)");
    if (!desc) desc = type === 'income' ? 'Dinheirinho novo' : 'Comprinhas';

    transactions.push({ id: Date.now(), desc, amount, type, date: new Date().toLocaleDateString('pt-BR') });
    saveTransactions();
    clearDisplay();
    renderAll();
}

function saveTransactions() {
    localStorage.setItem('minhasTransacoes', JSON.stringify(transactions));
}

function renderAll() {
    renderTable();
    renderSummary();
    renderChart();
}

function renderSummary() {
    let inc = 0, exp = 0;
    transactions.forEach(t => { if (t.type === 'income') inc += t.amount; else exp += t.amount; });
    const bal = inc - exp;
    document.getElementById('budget-income').textContent = `R$ ${inc.toFixed(2)}`;
    document.getElementById('budget-expense').textContent = `R$ ${exp.toFixed(2)}`;
    const el = document.getElementById('budget-balance');
    el.textContent = `R$ ${bal.toFixed(2)}`;
    el.style.color = bal < 0 ? '#ff5252' : '';

    el.style.color = bal < 0 ? '#ff5252' : '';
}

// --- Tabela Editável ---
function renderTable() {
    const tbody = document.getElementById('transaction-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    [...transactions].reverse().forEach(t => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${t.date}</td>
            <td contenteditable="true" data-id="${t.id}" data-field="desc">${t.desc}</td>
            <td style="color:${t.type==='income'?'#69f0ae':'#ff5252'};font-weight:600">${t.type==='income'?'📈 Receita':'📉 Despesa'}</td>
            <td contenteditable="true" data-id="${t.id}" data-field="amount" style="color:${t.type==='income'?'#69f0ae':'#ff5252'};font-weight:600">${t.amount.toFixed(2)}</td>
            <td><button class="delete-row-btn" onclick="deleteTransaction(${t.id})" title="Apagar"><i class="fas fa-times"></i></button></td>
        `;
        tbody.appendChild(tr);
    });
    tbody.querySelectorAll('td[contenteditable]').forEach(cell => {
        cell.addEventListener('blur', function() {
            const id = parseInt(this.dataset.id);
            const field = this.dataset.field;
            const note = transactions.find(n => n.id === id);
            if (!note) return;
            if (field === 'amount') {
                const val = parseFloat(this.textContent.replace(',','.'));
                if (!isNaN(val) && val > 0) note.amount = val;
                else this.textContent = note.amount.toFixed(2);
            } else {
                note[field] = this.textContent.trim() || note[field];
            }
            saveTransactions(); renderSummary(); renderChart();
        });
        cell.addEventListener('keydown', function(e) { if (e.key === 'Enter') { e.preventDefault(); this.blur(); } });
    });
}

function deleteTransaction(id) {
    transactions = transactions.filter(n => n.id !== id);
    saveTransactions(); renderAll();
}

function clearTransactions() {
    if (confirm("Você quer mesmo apagar todo o seu histórico financeiro? 🥺")) {
        transactions = [];
        localStorage.removeItem('minhasTransacoes');
        renderAll();
    }
}

// --- Gráfico (Chart.js Donut) ---
function renderChart() {
    const ctx = document.getElementById('budget-chart');
    if (!ctx) return;
    let inc = 0, exp = 0;
    transactions.forEach(t => { if (t.type === 'income') inc += t.amount; else exp += t.amount; });
    if (budgetChart) budgetChart.destroy();
    const hasData = inc > 0 || exp > 0;
    budgetChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: hasData ? ['Receitas', 'Despesas'] : ['Sem dados'],
            datasets: [{ data: hasData ? [inc, exp] : [1], backgroundColor: hasData ? ['#69f0ae','#ff5252'] : ['#f0f0f0'], borderWidth: 2, borderColor: '#fff' }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, cutout: '65%',
            plugins: { legend: { position: 'bottom', labels: { padding: 15, usePointStyle: true, font: { family: 'Quicksand', weight: '600', size: 12 } } } }
        }
    });
}

// --- Exportar CSV ---
function exportCSV() {
    if (transactions.length === 0) { alert("Nenhuma transação para exportar! 🌸"); return; }
    let csv = "Data,Descrição,Tipo,Valor\n";
    let inc = 0, exp = 0;
    transactions.forEach(t => {
        csv += `${t.date},"${t.desc}",${t.type==='income'?'Receita':'Despesa'},${t.amount.toFixed(2)}\n`;
        if (t.type==='income') inc += t.amount; else exp += t.amount;
    });
    csv += `\n,,Total Receitas,${inc.toFixed(2)}\n,,Total Despesas,${exp.toFixed(2)}\n,,SALDO,${(inc-exp).toFixed(2)}\n`;
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `meu-orcamento-${new Date().toLocaleDateString('pt-BR').replace(/\//g,'-')}.csv`;
    a.click();
}

// --- Importar CSV ---
function importCSV(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const lines = e.target.result.split('\n');
        let imported = 0;
        lines.forEach((line, i) => {
            if (i === 0) return;
            const parts = line.split(',');
            if (parts.length < 4) return;
            const date = parts[0].trim(), desc = parts[1].trim().replace(/"/g,''), typeRaw = parts[2].trim().toLowerCase(), amount = parseFloat(parts[3].trim());
            if (!date || !desc || isNaN(amount) || amount <= 0) return;
            if (typeRaw.includes('total') || typeRaw.includes('saldo')) return;
            transactions.push({ id: Date.now() + i, desc, amount, type: typeRaw.includes('receita') || typeRaw.includes('income') ? 'income' : 'expense', date });
            imported++;
        });
        if (imported > 0) { saveTransactions(); renderAll(); alert(`Importado! ${imported} transações adicionadas. ✨`); }
        else alert("Nenhuma transação válida encontrada. 😢\nFormato: Data, Descrição, Tipo, Valor");
    };
    reader.readAsText(file);
    event.target.value = '';
}

setTimeout(renderAll, 200);

// --- Integração Pluggy (Conexão Bancária) ---
const API_BASE = 'http://localhost:3001/api';
let connectedItemId = localStorage.getItem('pluggyItemId') || null;

// Atualiza UI se já tem banco conectado
if (connectedItemId) {
    setTimeout(() => {
        const status = document.getElementById('pluggy-status');
        const btn = document.getElementById('pluggy-connect-btn');
        if (status) status.style.display = 'block';
        if (btn) btn.innerHTML = '<i class="fas fa-sync-alt"></i> Atualizar Dados';
    }, 300);
}

async function connectBank() {
    const btn = document.getElementById('pluggy-connect-btn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Conectando...';
    btn.disabled = true;

    try {
        // 1. Pedir ao backend um connect token
        const res = await fetch(`${API_BASE}/connect-token`, { method: 'POST' });
        if (!res.ok) throw new Error('Servidor backend não está rodando. Rode: cd server && npm start');
        const { accessToken } = await res.json();

        // 2. Abrir o Widget Pluggy Connect
        const pluggyConnect = new PluggyConnect({
            connectToken: accessToken,
            onSuccess: async (data) => {
                console.log('Pluggy conectado!', data);
                connectedItemId = data.item.id;
                localStorage.setItem('pluggyItemId', connectedItemId);
                
                document.getElementById('pluggy-status').style.display = 'block';
                document.getElementById('pluggy-status-text').textContent = 'Banco conectado! Buscando transações...';
                
                // 3. Buscar contas e transações
                await fetchBankTransactions(connectedItemId);
                
                btn.innerHTML = '<i class="fas fa-sync-alt"></i> Atualizar Dados';
                btn.disabled = false;
            },
            onError: (error) => {
                console.error('Erro Pluggy:', error);
                alert('Erro ao conectar banco. Tente novamente. 😢');
                btn.innerHTML = '<i class="fas fa-university"></i> Conectar Banco';
                btn.disabled = false;
            },
            onClose: () => {
                if (!connectedItemId) {
                    btn.innerHTML = '<i class="fas fa-university"></i> Conectar Banco';
                    btn.disabled = false;
                }
            }
        });

        pluggyConnect.init();
    } catch (err) {
        console.error(err);
        alert(`Erro: ${err.message}\n\nCertifique-se que o backend está rodando:\n1. Abra um terminal\n2. cd server\n3. npm install\n4. npm start`);
        btn.innerHTML = '<i class="fas fa-university"></i> Conectar Banco';
        btn.disabled = false;
    }
}

async function fetchBankTransactions(itemId) {
    try {
        // Buscar contas do item
        const accountsRes = await fetch(`${API_BASE}/accounts/${itemId}`);
        const accountsData = await accountsRes.json();
        
        if (!accountsData.results || accountsData.results.length === 0) {
            document.getElementById('pluggy-status-text').textContent = 'Nenhuma conta encontrada.';
            return;
        }

        let totalImported = 0;

        // Para cada conta, buscar transações
        for (const account of accountsData.results) {
            const txRes = await fetch(`${API_BASE}/transactions/${account.id}`);
            const txData = await txRes.json();
            
            if (txData.results) {
                txData.results.forEach(tx => {
                    // Evita duplicatas verificando se já existe pelo ID do Pluggy
                    const exists = transactions.find(t => t.pluggyId === tx.id);
                    if (exists) return;

                    transactions.push({
                        id: Date.now() + Math.random(),
                        pluggyId: tx.id,
                        desc: tx.description || tx.descriptionRaw || 'Transação bancária',
                        amount: Math.abs(tx.amount),
                        type: tx.amount >= 0 ? 'income' : 'expense',
                        date: new Date(tx.date).toLocaleDateString('pt-BR')
                    });
                    totalImported++;
                });
            }
        }

        saveTransactions();
        renderAll();
        
        const statusText = totalImported > 0 
            ? `✅ ${totalImported} transações importadas do banco!` 
            : '✅ Banco conectado (sem transações novas)';
        document.getElementById('pluggy-status-text').textContent = statusText;
        
    } catch (err) {
        console.error('Erro ao buscar transações:', err);
        document.getElementById('pluggy-status-text').textContent = 'Erro ao buscar transações do banco.';
    }
}
