const express = require('express');
const app = express();

// Define a porta do servidor. Prioriza a variável de ambiente PORT, caso contrário, usa 4000.
const PORT = process.env.PORT || 4000;

// Middleware para logar todas as requisições recebidas
app.use((req, res, next) => {
  console.log(`📥 Requisição recebida: ${req.method} ${req.url} de ${req.ip}`);
  next(); // Continua para a próxima rota ou middleware
});

// Endpoint de Health Check
// Este endpoint é crucial para o EasyPanel/Traefik verificar a saúde da aplicação.
// Deve ser o mais leve e rápido possível.
app.get('/health', (req, res) => {
  console.log('✅ HEALTH CHECK RECEBIDO (Endpoint /health)!');
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'Miles Deal API is healthy and running!',
    port: PORT,
    pid: process.pid,
    uptime: process.uptime() // Tempo que o processo está rodando em segundos
  });
});

// Endpoint de Ping
// Um endpoint simples para verificar conectividade.
app.get('/ping', (req, res) => {
  console.log('✅ PING RECEBIDO (Endpoint /ping)!');
  res.status(200).send('pong');
});

// Rota base da API
app.get('/', (req, res) => {
  console.log('🏠 Requisição recebida na URL base (/)!');
  res.status(200).json({
    message: 'Bem-vindo à MILES DEAL API!',
    version: '1.0.0',
    status: 'Online',
    port: PORT,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Middleware para lidar com rotas não encontradas (404)
app.use((req, res, next) => {
  console.warn(`⚠️ Rota não encontrada: ${req.method} ${req.url}`);
  res.status(404).json({
    error: 'Not Found',
    message: `A rota ${req.originalUrl} não foi encontrada neste servidor.`
  });
});

// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
  console.error('❌ Erro interno do servidor:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Ocorreu um erro inesperado no servidor.',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Inicia o servidor
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('\n🚀 MILES DEAL API - FRESH START');
  console.log(`📍 PORT: ${PORT}`);
  console.log(`📍 ENV PORT: ${process.env.PORT || 'Não definida (usando padrão)'}`);
  console.log('🔍 Verificando se porta está livre...');
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log('✅ Host: 0.0.0.0 - todas as interfaces');
  console.log('✅ PID:', process.pid);
  console.log('✅ Porta livre e funcionando!');
  console.log('--- Servidor pronto para receber requisições ---');
});

// Lidar com erros do servidor (ex: porta já em uso)
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Erro: A porta ${PORT} já está em uso.`);
    console.error('Por favor, libere a porta ou configure outra.');
  } else {
    console.error('❌ Erro inesperado no servidor:', error);
  }
  process.exit(1); // Encerra o processo com erro
});

// Tratamento de SIGTERM para encerramento gracioso (Graceful Shutdown)
// Isso é o que o EasyPanel/Docker envia para parar a aplicação.
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM recebido - fechando servidor graciosamente');
  server.close(() => {
    console.log('✅ Servidor fechado');
    process.exit(0); // Encerra o processo sem erro
  });
});

// Tratamento de SIGINT (Ctrl+C) para encerramento gracioso
process.on('SIGINT', () => {
  console.log('👋 SIGINT recebido (Ctrl+C) - fechando servidor graciosamente');
  server.close(() => {
    console.log('✅ Servidor fechado');
    process.exit(0);
  });
});

// Captura de exceções não tratadas para evitar que o processo caia
process.on('uncaughtException', (err) => {
  console.error('💥 Exceção não tratada:', err.message);
  console.error(err.stack);
  // Opcional: Encerre o processo após logar para evitar estados inconsistentes
  // process.exit(1); 
});

// Captura de rejeições de Promise não tratadas
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Rejeição de Promise não tratada:', reason);
  console.error('Promise:', promise);
  // Opcional: Encerre o processo após logar
  // process.exit(1);
});
