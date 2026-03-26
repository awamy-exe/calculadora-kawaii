# Calculadora & Planejador Financeiro 📈💰

Uma solução completa de gestão financeira pessoal que une a simplicidade de uma calculadora moderna com o poder de um dashboard financeiro inteligente. Conecte suas contas bancárias, visualize seus gastos em tempo real e organize seu orçamento com estilo.

## 🌟 Principais Recursos

- **Integração Bancária (Pluggy API)**: Conecte suas contas reais e cartões de crédito para importar transações automaticamente via Open Finance.
- **Dashboard Interativo**: Gráfico de pizza (Donut Chart) dinâmico via **Chart.js** que separa suas receitas e despesas visualmente.
- **Tabela de Transações Editável**: Histórico completo com salvamento automático (Local Storage) e edição em tempo real.
- **Gestão de Dados (Excel/CSV)**: Exporte seu orçamento completo para Excel ou importe extratos bancários externos via CSV.
- **Personalização de Temas**: Escolha entre o tema **Hello Kitty** (Rosa/Delicado) ou **Kuromi** (Escuro/Elegante) com um clique.
- **Rádio de K-Pop Embutida**: Player de música integrado (SoundCloud) para acompanhar sua organização financeira.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3 progressivo, JavaScript Vanilla (ES6+).
- **Gráficos**: [Chart.js](https://www.chartjs.org/) para visualização de dados.
- **Backend (Integração)**: Node.js e Express para comunicação segura com a API da Pluggy.
- **API Financeira**: [Pluggy Connect](https://pluggy.ai/) (V2) para agregação de contas bancárias.

## 🚀 Como Iniciar

### 1. Frontend (Interface)
O projeto principal é estático. Basta clonar o repositório e abrir o arquivo `index.html` em qualquer navegador moderno.

```bash
git clone https://github.com/awamy-exe/Calculadora.git
```

### 2. Backend (Conexão Bancária)
Para usar o botão **"Conectar Banco"**, você precisa rodar o servidor local:

1. Acesse a pasta do servidor: `cd server`
2. Instale as dependências: `npm install`
3. Configure suas chaves no arquivo `.env` (Client ID e Secret do Pluggy).
4. Inicie o servidor: `npm start`

O servidor rodará em `http://localhost:3001` e servirá como ponte para a API oficial.

## 🎨 Temas Disponíveis

- **Tema Padrão (Hello Kitty)**: Foco em tons pastéis (#fce4ec), ideal para um ambiente de trabalho leve e fofo.
- **Modo Dark (Kuromi)**: Estética noturna com tons de Roxo e Preto, focada em conforto visual e elegância.

---
Desenvolvido para transformar a chatice das finanças em algo visualmente incrível e funcional. ✨🏦
