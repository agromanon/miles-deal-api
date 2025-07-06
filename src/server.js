const express = require('express');
const app = express();

// DESABILITAR ETAG
app.disable('etag');

const PORT = process.env.PORT || 3000;

console.log('🚀 MILES DEAL API - VERSÃO ULTRA SIMPLES');
console.log('📊 DATABASE_URL:', process.env.DATABASE_URL ? 'CONFIGURADO' : 'NÃO CONFIGURADO');

app.use(express.json());

// Middleware anti-cache
app.use((req, res, next) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  console.log(`📡 ${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// ROTA RAIZ
app.get('/', (req, res) => {
  console.log('✅ HOME executada');
  res.json({
    message: 'Miles Deal API - Ultra Simple Version',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: process.env.DATABASE_URL ? 'configured' : 'not_configured',
    status: 'working'
  });
});

// HEALTH
app.get('/health', (req, res) => {
  console.log('✅ HEALTH executada');
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'API funcionando!',
    database: process.env.DATABASE_URL ? 'configured' : 'not_configured'
  });
});

// SETUP - SEM BANCO POR ENQUANTO
app.get('/setup', (req, res) => {
  console.log('✅ SETUP executada');
  res.json({
    success: true,
    message: 'Setup endpoint working - database operations disabled for now',
    timestamp: new Date().toISOString(),
    database: process.env.DATABASE_URL ? 'configured' : 'not_configured'
  });
});

// FLIGHTS - SEM BANCO POR ENQUANTO
app.get('/flights', (req, res) => {
  console.log('✅ FLIGHTS executada');
  res.json({
    success: true,
    message: 'Flights endpoint working - database operations disabled for now',
    timestamp: new Date().toISOString(),
    total_flights: 0,
    flights: []
  });
});

// SEARCH
app.get('/search', (req, res) => {
  console.log('✅ SEARCH executada');
  res.json({
    success: true,
    message: 'Search endpoint working',
    timestamp: new Date().toISOString(),
    query: req.query
  });
});

// Tratamento de erros
app.use((error, req, res, next) => {
  console.error('❌ ERRO:', error);
  res.status(500).json({
    success: false,
    error: error.message,
    timestamp: new Date().toISOString()
  });
});

// Capturar erros
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
});

// Ignorar SIGTERM
process.on('SIGTERM', () => {
  console.log('🔴 SIGTERM ignorado');
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('=================================');
  console.log(`🚀 SERVIDOR RODANDO NA PORTA ${PORT}`);
  console.log('📝 ROTAS DISPONÍVEIS:');
  console.log('  - GET / (home)');
  console.log('  - GET /health (status)');
  console.log('  - GET /setup (setup)');
  console.log('  - GET /flights (flights)');
  console.log('  - GET /search (search)');
  console.log('=================================');
});
