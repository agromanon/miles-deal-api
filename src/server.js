const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

console.log('🚀 Miles Deal API iniciando...');
console.log('🔧 NODE_ENV:', process.env.NODE_ENV);
console.log('🔧 PORT:', PORT);

app.use(express.json());

// Health check robusto
app.get('/health', (req, res) => {
  console.log('Health check acessado de:', req.ip);
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'API funcionando!',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    pid: process.pid
  });
});

// Rota de teste
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
    status: 'running',
    endpoints: [
      'GET /health',
      'GET /test',
      'GET /'
    ]
  });
});

// Tratamento melhor de sinais
process.on('SIGTERM', () => {
  console.log('🔴 Recebido SIGTERM - ignorando...');
  // Não fazer nada - deixar o processo continuar
});

process.on('SIGINT', () => {
  console.log('🔴 Recebido SIGINT - shutdown graceful...');
  process.exit(0);
});

// Capturar erros não tratados
process.on('uncaughtException', (error) => {
  console.error('🚨 Erro não tratado:', error);
  // Não fazer exit - continuar rodando
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Promise rejeitada:', reason);
  // Não fazer exit - continuar rodando
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Miles Deal API rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log('✅ Servidor pronto para receber conexões!');
});

// Manter o servidor vivo
server.keepAliveTimeout = 120000;
server.headersTimeout = 120000;
