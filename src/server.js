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

// Log TODAS as requisições
app.use((req, res, next) => {
  console.log(`📡 REQUEST: ${req.method} ${req.url}`);
  console.log(`📡 HEADERS:`, req.headers);
  console.log(`📡 IP:`, req.ip);
  res.header('X-Debug-Server', 'Miles-Deal-API');
  res.header('X-Debug-Time', new Date().toISOString());
  next();
});

// Health check
app.get('/health', (req, res) => {
  console.log('✅ Health check executado');
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'API funcionando!',
    headers: req.headers,
    url: req.url,
    method: req.method
  });
});

// Test
app.get('/test', (req, res) => {
  console.log('✅ Test executado');
  res.json({
    message: 'API está funcionando!',
    timestamp: new Date().toISOString(),
    headers: req.headers,
    url: req.url,
    method: req.method
  });
});

// Rota raiz
app.get('/', (req, res) => {
  console.log('✅ Rota raiz executada');
  res.json({
    message: 'Miles Deal API - DEBUG VERSION',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    headers: req.headers,
    url: req.url,
    method: req.method
  });
});

// Capturar TODAS as requisições
app.use('*', (req, res) => {
  console.log(`🔍 CATCH ALL: ${req.method} ${req.originalUrl}`);
  console.log(`🔍 HEADERS:`, req.headers);
  res.status(404).json({
    error: 'Rota não encontrada',
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
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
  console.log('📊 Escutando em 0.0.0.0:3000');
  console.log('=================================');
});

console.log('🔚 Arquivo server.js carregado completamente');
