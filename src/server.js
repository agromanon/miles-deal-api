const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

console.log('🚀 Miles Deal API iniciando...');

app.use(express.json());

// Health check simples
app.get('/health', (req, res) => {
  console.log('Health check acessado');
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'API funcionando!'
  });
});

// Rota de teste
app.get('/test', (req, res) => {
  res.json({
    message: 'API está funcionando!',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Miles Deal API rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
