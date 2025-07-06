const express = require('express');
const { Client } = require('pg');
const app = express();

// DESABILITAR ETAG para evitar cache
app.disable('etag');

const PORT = process.env.PORT || 3000;

console.log('🚀 MILES DEAL API - ROTAS ORIGINAIS - DEBUG');
console.log('📊 DATABASE_URL:', process.env.DATABASE_URL ? 'CONFIGURADO' : 'NÃO CONFIGURADO');

app.use(express.json());

// Middleware anti-cache global
app.use((req, res, next) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'X-Timestamp': Date.now().toString()
  });
  console.log(`📡 REQUEST: ${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// ROTA RAIZ - HOME
app.get('/', (req, res) => {
  console.log('✅ Rota raiz executada');
  try {
    res.json({
      message: 'Miles Deal API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      database_status: process.env.DATABASE_URL ? 'configured' : 'not_configured',
      endpoints: {
        home: '/',
        setup: '/setup',
        health: '/health',
        flights: '/flights',
        search: '/search'
      }
    });
  } catch (error) {
    console.error('❌ Erro na rota raiz:', error);
    res.status(500).json({ error: error.message });
  }
});

// HEALTH - Status da API
app.get('/health', (req, res) => {
  console.log('✅ Health check executado');
  try {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'API funcionando!',
      database: process.env.DATABASE_URL ? 'configured' : 'not_configured',
      version: '1.0.0'
    });
  } catch (error) {
    console.error('❌ Erro no health:', error);
    res.status(500).json({ error: error.message });
  }
});

// SETUP - Configuração do banco
app.get('/setup', async (req, res) => {
  console.log('✅ Setup executado');
  
  try {
    if (!process.env.DATABASE_URL) {
      console.log('❌ DATABASE_URL não configurado');
      return res.status(500).json({
        success: false,
        error: 'DATABASE_URL not configured',
        timestamp: new Date().toISOString()
      });
    }
    
    console.log('🔌 Tentando conectar ao banco...');
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    });
    
    await client.connect();
    console.log('✅ Conectado ao banco');
    
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
    console.log('✅ Tabela flights criada');
    
    await client.end();
    console.log('✅ Conexão fechada');
    
    res.json({
      success: true,
      message: 'Database setup completed successfully!',
      timestamp: new Date().toISOString(),
      table_created: 'flights'
    });
    
  } catch (error) {
    console.error('❌ Erro no setup:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// FLIGHTS - Listar voos
app.get('/flights', async (req, res) => {
  console.log('✅ Flights executado');
  
  try {
    if (!process.env.DATABASE_URL) {
      console.log('❌ DATABASE_URL não configurado');
      return res.status(500).json({
        success: false,
        error: 'DATABASE_URL not configured',
        timestamp: new Date().toISOString()
      });
    }
    
    console.log('🔌 Conectando ao banco para listar voos...');
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    });
    
    await client.connect();
    console.log('✅ Conectado - executando query...');
    
    const result = await client.query('SELECT * FROM flights ORDER BY created_at DESC LIMIT 20');
    console.log(`✅ Query executada - ${result.rowCount} resultados`);
    
    await client.end();
    
    res.json({
      success: true,
      message: 'Flights retrieved successfully!',
      timestamp: new Date().toISOString(),
      total_flights: result.rowCount,
      flights: result.rows
    });
    
  } catch (error) {
    console.error('❌ Erro ao buscar voos:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// SEARCH - Buscar voos
app.get('/search', async (req, res) => {
  console.log('✅ Search executado');
  
  try {
    res.json({
      success: true,
      message: 'Search endpoint working!',
      timestamp: new Date().toISOString(),
      note: 'Full search functionality will be implemented after basic routes are working'
    });
  } catch (error) {
    console.error('❌ Erro no search:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Capturar erros não tratados
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('SIGTERM', () => {
  console.log('🔴 Recebido SIGTERM - ignorando...');
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('=================================');
  console.log(`🚀 MILES DEAL API - PORTA ${PORT}`);
  console.log('🗃️ DATABASE_URL:', process.env.DATABASE_URL ? 'CONFIGURADO' : 'NÃO CONFIGURADO');
  console.log('🚫 Cache desabilitado');
  console.log('📊 Rotas originais com debug:');
  console.log('  - GET / (home)');
  console.log('  - GET /setup (criar tabelas)');
  console.log('  - GET /health (status)');
  console.log('  - GET /flights (listar voos)');
  console.log('  - GET /search (buscar voos)');
  console.log('=================================');
});
