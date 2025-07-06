const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

console.log('🚀 MILES DEAL API - FRESH START');
console.log('📍 PORT:', PORT);
console.log('📍 DATABASE_URL:', process.env.DATABASE_URL ? 'CONFIGURADO' : 'NÃO CONFIGURADO');

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Miles Deal API - Fresh Start',
    version: '1.0',
    timestamp: new Date().toISOString(),
    status: 'SUCCESS',
    port: PORT,
    database: process.env.DATABASE_URL ? 'CONECTADO' : 'NÃO CONECTADO'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    version: '1.0',
    port: PORT,
    database: process.env.DATABASE_URL ? 'OK' : 'ERRO'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log('✅ Database configurado:', process.env.DATABASE_URL ? 'SIM' : 'NÃO');
  console.log('✅ Servidor estável - sem graceful shutdown');
});

// REMOVER GRACEFUL SHUTDOWN TEMPORARIAMENTE
console.log('⚠️ Graceful shutdown desabilitado para teste');
