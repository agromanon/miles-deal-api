const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

console.log('🚀 MILES DEAL API - FRESH START');
console.log('📍 PORT:', PORT);

app.get('/', (req, res) => {
  res.json({
    message: 'Miles Deal API - Fresh Start',
    version: '1.0',
    timestamp: new Date().toISOString(),
    status: 'SUCCESS',
    port: PORT
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
});
