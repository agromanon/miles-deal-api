const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080; // Porta padrão containers

console.log('🚀 MILES DEAL API - FRESH START');
console.log('📍 PORT:', PORT);
console.log('📍 ENV PORT:', process.env.PORT);

app.use(express.json());

app.get('/', (req, res) => {
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

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    version: '1.0',
    port: PORT
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log('✅ Host: 0.0.0.0 - todas as interfaces');
});
