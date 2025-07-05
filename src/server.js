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

// Rotas de teste para verificar roteamento
app.get('/health/test', (req, res) => {
  console.log('✅ /health/test executado');
  res.json({ 
    message: 'Health test funcionando!',
    timestamp: new Date().toISOString()
  });
});

app.get('/test/debug', (req, res) => {
  console.log('✅ /test/debug executado');
  res.json({ 
    message: 'Test debug funcionando!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (req, res) => {
  console.log('✅ /api executado');
  res.json({ 
    message: 'API root funcionando!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  console.log('✅ /api/health executado');
  res.json({ 
    message: 'API health funcionando!',
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
    headers: req.headers,
    url: req.url,
    method: req.method
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
  console.log('📊 Rotas de teste disponíveis:');
  console.log('  - GET /health');
  console.log('  - GET /test');
  console.log('  - GET /health/test');
  console.log('  - GET /test/debug');
  console.log('  - GET /api');
  console.log('  - GET /api/health');
  console.log('  - GET /');
  console.log('  - GET /setup');
  console.log('=================================');
});

console.log('🔚 Arquivo server.js carregado completamente');
