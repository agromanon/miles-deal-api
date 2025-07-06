const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

console.log('🔥 SERVIDOR DEFINITIVO V3.0 - GRACEFUL SHUTDOWN');
console.log('📍 PORT:', PORT);
console.log('📍 ENV PORT:', process.env.PORT);

app.use((req, res, next) => {
  console.log(`🔥 ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  console.log('✅ ROTA / EXECUTADA - V3.0');
  res.json({
    message: 'VERSÃO 3.0 FUNCIONANDO - GRACEFUL SHUTDOWN',
    timestamp: new Date().toISOString(),
    version: '3.0',
    port: PORT,
    status: 'SUCCESS',
    shutdown: 'GRACEFUL'
  });
});

app.get('/test', (req, res) => {
  console.log('✅ ROTA /test EXECUTADA - V3.0');
  res.json({
    message: 'TESTE VERSÃO 3.0 - GRACEFUL SHUTDOWN',
    timestamp: new Date().toISOString(),
    version: '3.0',
    random: Math.random(),
    port: PORT
  });
});

// Servidor com tratamento de erro
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('=================================');
  console.log('🚀 SERVIDOR V3.0 RODANDO');
  console.log(`📡 PORTA: ${PORT}`);
  console.log('✅ GRACEFUL SHUTDOWN ATIVO');
  console.log('=================================');
});

// Tratamento de erros
server.on('error', (error) => {
  console.error('❌ ERRO NO SERVIDOR V3.0:', error);
  process.exit(1);
});

// GRACEFUL SHUTDOWN - NÃO IGNORAR SIGTERM
process.on('SIGTERM', () => {
  console.log('🔴 SIGTERM recebido - encerrando graciosamente V3.0');
  server.close(() => {
    console.log('🔴 Servidor V3.0 encerrado graciosamente');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🔴 SIGINT recebido - encerrando graciosamente V3.0');
  server.close(() => {
    console.log('🔴 Servidor V3.0 encerrado graciosamente');
    process.exit(0);
  });
});
