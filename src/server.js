const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

console.log('=================================');
console.log('🚀 MILES DEAL API - VERSÃO DEBUG');
console.log('=================================');
console.log('📅 Data/Hora:', new Date().toISOString());
console.log('🔧 NODE_ENV:', process.env.NODE_ENV);
console.log('🔧 PORT:', PORT);
console.log('🔧 Processo PID:', process.pid);

app.use(express.json());

// Log de todas as rotas registradas
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url} - ${new Date().toISOString()}`);
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

// Rota raiz
app.get('/', (req, res) => {
  console.log('✅ Rota raiz executada');
  res.json({
    message: 'Miles Deal API - DEBUG VERSION',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    pid: process.pid
  });
});

// Setup
app.get('/setup', (req, res) => {
  console.log('✅ Setup executado');
  res.json({
    message: 'Setup funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  console.log(`❌ Rota não encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Rota não encontrada',
    method: req.method,
    url: req.originalUrl,
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
  console.log('📊 Rotas disponíveis:');
  console.log('  - GET /health');
  console.log('  - GET /test');
  console.log('  - GET /');
  console.log('  - GET /setup');
  console.log('=================================');
});

console.log('🔚 Arquivo server.js carregado completamente');
