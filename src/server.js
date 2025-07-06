const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000; // ← PORTA 5000

console.log('🚀 MILES DEAL API - FRESH START');
console.log('📍 PORT:', PORT);
console.log('📍 ENV PORT:', process.env.PORT);
console.log('🔍 Verificando se porta está livre...');

app.use(express.json());

// HEALTH CHECKS
app.get('/health', (req, res) => {
  console.log('🔍 Health check acessado');
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0',
    port: PORT,
    uptime: process.uptime(),
    pid: process.pid
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
    pid: process.pid,
    uptime: process.uptime()
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log('✅ Host: 0.0.0.0 - todas as interfaces');
  console.log('✅ PID:', process.pid);
  console.log('✅ Porta livre e funcionando!');
});

// TRATAMENTO DE SINAIS
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM recebido - fechando servidor graciosamente');
  server.close(() => {
    console.log('✅ Servidor fechado');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🔄 SIGINT recebido - fechando servidor');
  server.close(() => {
    console.log('✅ Servidor fechado');
    process.exit(0);
  });
});
