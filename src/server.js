// src/server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

console.log('🆕 SERVIDOR VERSÃO 2.0 - PORTA 3001');
console.log('📍 PORT:', PORT);

app.use((req, res, next) => {
  console.log(`🔥 ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  console.log('✅ NOVA ROTA / EXECUTADA');
  res.json({
    message: 'VERSÃO 2.0 FUNCIONANDO - PORTA 3001',
    timestamp: new Date().toISOString(),
    version: '2.0',
    port: PORT
  });
});

app.get('/test', (req, res) => {
  console.log('✅ NOVA ROTA /test EXECUTADA');
  res.json({
    message: 'TESTE VERSÃO 2.0 - PORTA 3001',
    timestamp: new Date().toISOString(),
    version: '2.0',
    random: Math.random()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('=================================');
  console.log('🚀 SERVIDOR VERSÃO 2.0 RODANDO');
  console.log(`📡 PORTA: ${PORT}`);
  console.log('=================================');
});

process.on('SIGTERM', () => {
  console.log('🔴 SIGTERM ignorado - V2.0');
});
