const express = require('express');
const app = express();
const PORT = 3000;

console.log('🚀 DIAGNÓSTICO - INICIANDO SERVIDOR');
console.log('📍 PORT:', PORT);
console.log('📍 ENV PORT:', process.env.PORT);

// Middleware super simples
app.use((req, res, next) => {
  console.log(`🔥 ${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('🔥 Headers:', req.headers);
  console.log('🔥 IP:', req.ip);
  next();
});

// Rota raiz
app.get('/', (req, res) => {
  console.log('✅ EXECUTANDO ROTA /');
  const response = {
    message: 'DIAGNÓSTICO FUNCIONANDO',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    headers: req.headers,
    ip: req.ip
  };
  console.log('✅ RESPOSTA:', response);
  res.json(response);
});

// Rota de teste
app.get('/test', (req, res) => {
  console.log('✅ EXECUTANDO ROTA /test');
  res.json({
    message: 'TESTE FUNCIONANDO',
    timestamp: new Date().toISOString(),
    random: Math.random()
  });
});

// Iniciar servidor
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('=================================');
  console.log(`🚀 SERVIDOR ESCUTANDO NA PORTA ${PORT}`);
  console.log('🌐 HOST: 0.0.0.0 (todas as interfaces)');
  console.log('📡 Endereço completo: http://0.0.0.0:3000');
  console.log('=================================');
});

// Verificar se realmente está escutando
server.on('listening', () => {
  const address = server.address();
  console.log('✅ SERVIDOR CONFIRMADO ESCUTANDO:');
  console.log('   - Address:', address.address);
  console.log('   - Port:', address.port);
  console.log('   - Family:', address.family);
});

// Logs de erro
server.on('error', (error) => {
  console.error('❌ ERRO NO SERVIDOR:', error);
});
