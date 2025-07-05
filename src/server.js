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
      'GET /',
      'GET /setup/database'
    ]
  });
});

// Criar tabela no banco
app.get('/setup/database', async (req, res) => {
  try {
    const { Client } = require('pg');
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    });
    
    await client.connect();
    console.log('🔌 Conectado ao banco de dados');
    
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS flights (
        id SERIAL PRIMARY KEY,
        airline VARCHAR(100) NOT NULL,
        miles_program VARCHAR(100) NOT NULL,
        origin_city VARCHAR(100) NOT NULL,
        destination_city VARCHAR(100) NOT NULL,
        destination_country VARCHAR(100) NOT NULL,
        destination_continent VARCHAR(100) NOT NULL,
        miles_price INTEGER NOT NULL,
        taxes_fees DECIMAL(10,2) NOT NULL,
        flight_date TIMESTAMP NOT NULL,
        flight_class VARCHAR(50) NOT NULL,
        availability INTEGER NOT NULL,
        is_domestic BOOLEAN NOT NULL,
        deal_score DECIMAL(5,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await client.query(createTableQuery);
    console.log('✅ Tabela flights criada com sucesso');
    
    await client.end();
    
    res.json({ 
      success: true, 
      message: 'Tabela flights criada com sucesso!' 
    });
  } catch (error) {
    console.error('❌ Erro ao criar tabela:', error);
    res.status(500).json({ 
      error: error.message 
    });
  }
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
