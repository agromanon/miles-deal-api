const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

console.log('=================================');
console.log('🚀 MILES DEAL API - VERSÃO DEBUG');
console.log('=================================');

app.use(express.json());

// MOVER ROTA RAIZ PARA O TOPO - ANTES DE TUDO
app.get('/', (req, res) => {
  console.log('✅ Rota raiz executada - PRIMEIRA POSIÇÃO');
  res.json({
    message: 'Miles Deal API - ROOT FUNCIONANDO!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    success: true
  });
});

// AGORA sim o middleware de log
app.use((req, res, next) => {
  console.log(`📡 REQUEST: ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  console.log('✅ Health check executado');
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'API funcionando!'
  });
});

// Test
app.get('/test', (req, res) => {
  console.log('✅ Test executado');
  res.json({
    message: 'API está funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Setup - TAMBÉM MOVER PARA CIMA
app.get('/setup', (req, res) => {
  console.log('✅ Setup executado');
  res.json({
    message: 'Setup funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Tratamento de sinais
process.on('SIGTERM', () => {
  console.log('🔴 Recebido SIGTERM - ignorando...');
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('=================================');
  console.log(`🚀 SERVER INICIADO NA PORTA ${PORT}`);
  console.log('📊 Rotas registradas:');
  console.log('  - GET / (PRIMEIRA POSIÇÃO)');
  console.log('  - GET /health');
  console.log('  - GET /test');
  console.log('  - GET /setup');
  console.log('=================================');
});

console.log('🔚 Arquivo server.js carregado completamente');
