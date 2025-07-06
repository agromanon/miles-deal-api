const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

console.log('🚀 MILES DEAL API - FRESH START');
console.log('📍 PORT:', PORT);
console.log('📍 ENV PORT:', process.env.PORT);

app.use(express.json());

// HEALTH CHECKS MÚLTIPLOS
app.get('/health', (req, res) => {
  console.log('🔍 Health check acessado');
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0',
    port: PORT,
    uptime: process.uptime()
  });
});

app.get('/healthz', (req, res) => {
  console.log('🔍 Healthz acessado');
  res.status(200).send('OK');
});

app.get('/ping', (req, res) => {
  console.log('🔍 Ping acessado');
  res.status(200).send('pong');
});

app.get('/', (req, res) => {
  console.log('🔍 Root acessado');
  res.json({
    message: 'Miles Deal API - Fresh Start',
    version: '1.0',
    timestamp: new Date().toISOString(),
    status: 'SUCCESS',
    port: PORT,
    env_port: process.env.PORT,
    database: process.env.DATABASE_URL ? 'CONECTADO' : 'NÃO CONECTADO'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log('✅ Host: 0.0.0.0 - todas as interfaces');
  console.log('✅ Health checks: /health, /healthz, /ping');
});
