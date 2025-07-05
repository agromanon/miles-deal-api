const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

console.log('🚀 Miles Deal API iniciando...');

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  console.log('Health check acessado');
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'API funcionando!'
  });
});

// Test
app.get('/test', (req, res) => {
  res.json({
    message: 'API está funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Miles Deal API',
    version: '1.0.0',
    endpoints: [
      'GET /health',
      'GET /test',
      'GET /',
      'GET /setup'
    ]
  });
});

// Setup
app.get('/setup', (req, res) => {
  res.json({
    message: 'Setup funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Tratamento de sinais
process.on('SIGTERM', () => {
  console.log('🔴 Recebido SIGTERM - ignorando...');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Miles Deal API rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
