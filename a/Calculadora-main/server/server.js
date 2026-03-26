// --- Finance Backend (Pluggy Integration) ---
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

const PLUGGY_BASE = 'https://api.pluggy.ai';

// Cache do token (válido por 2h)
let cachedToken = null;
let tokenExpiry = 0;

// --- Obter API Key (Token) do Pluggy ---
async function getPluggyToken() {
    if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

    const res = await fetch(`${PLUGGY_BASE}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            clientId: process.env.PLUGGY_CLIENT_ID,
            clientSecret: process.env.PLUGGY_CLIENT_SECRET
        })
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Erro ao autenticar no Pluggy: ${err}`);
    }

    const data = await res.json();
    cachedToken = data.apiKey;
    tokenExpiry = Date.now() + (2 * 60 * 60 * 1000); // 2 horas
    return cachedToken;
}

// --- Criar Connect Token (para o Widget no Frontend) ---
app.post('/api/connect-token', async (req, res) => {
    try {
        const token = await getPluggyToken();
        const response = await fetch(`${PLUGGY_BASE}/connect_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': token
            },
            body: JSON.stringify({
                clientUserId: 'finance-user-1' // ID único do usuário
            })
        });

        if (!response.ok) throw new Error('Erro ao criar connect token');
        const data = await response.json();
        res.json({ accessToken: data.accessToken });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// --- Listar Contas de um Item (conexão bancária) ---
app.get('/api/accounts/:itemId', async (req, res) => {
    try {
        const token = await getPluggyToken();
        const response = await fetch(`${PLUGGY_BASE}/accounts?itemId=${req.params.itemId}`, {
            headers: { 'X-API-KEY': token }
        });

        if (!response.ok) throw new Error('Erro ao buscar contas');
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// --- Buscar Transações de uma Conta ---
app.get('/api/transactions/:accountId', async (req, res) => {
    try {
        const token = await getPluggyToken();
        const page = req.query.page || 1;
        const pageSize = req.query.pageSize || 50;

        const response = await fetch(
            `${PLUGGY_BASE}/transactions?accountId=${req.params.accountId}&pageSize=${pageSize}&page=${page}`, {
            headers: { 'X-API-KEY': token }
        });

        if (!response.ok) throw new Error('Erro ao buscar transações');
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// --- Buscar Item (status da conexão bancária) ---
app.get('/api/item/:itemId', async (req, res) => {
    try {
        const token = await getPluggyToken();
        const response = await fetch(`${PLUGGY_BASE}/items/${req.params.itemId}`, {
            headers: { 'X-API-KEY': token }
        });

        if (!response.ok) throw new Error('Erro ao buscar item');
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// --- Deletar conexão bancária ---
app.delete('/api/item/:itemId', async (req, res) => {
    try {
        const token = await getPluggyToken();
        await fetch(`${PLUGGY_BASE}/items/${req.params.itemId}`, {
            method: 'DELETE',
            headers: { 'X-API-KEY': token }
        });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// --- Iniciar Servidor ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🌸 Servidor Finance rodando em http://localhost:${PORT}`);
    console.log(`📡 Endpoints disponíveis:`);
    console.log(`   POST /api/connect-token`);
    console.log(`   GET  /api/accounts/:itemId`);
    console.log(`   GET  /api/transactions/:accountId`);
    console.log(`   GET  /api/item/:itemId`);
    console.log(`   DELETE /api/item/:itemId`);
});
