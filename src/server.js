const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

console.log('🚀 Miles Deal API iniciando...');

app.use(express.json());

// Health check para Easypanel
app.get('/health', (req, res) => {
  console.log('Health check acessado');
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'API funcionando!',
    uptime: process.uptime()
  });
});

// Health check alternativo
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// Rota de teste
app.get('/test', (req, res) => {
  res.json({
    message: 'API está funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔴 Recebido SIGTERM, fazendo shutdown graceful...');
  process.exit(0);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Miles Deal API rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
