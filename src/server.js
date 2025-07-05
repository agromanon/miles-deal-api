const express = require('express');
const { Client } = require('pg');
const app = express();

// DESABILITAR ETAG para evitar cache
app.disable('etag');

const PORT = process.env.PORT || 3000;

console.log('🚀 MILES DEAL API - ROTAS ORIGINAIS');

app.use(express.json());

// Middleware anti-cache global
app.use((req, res, next) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'X-Timestamp': Date.now().toString()
  });
  console.log(`📡 REQUEST: ${req.method} ${req.url}`);
  next();
});

// ROTA RAIZ - HOME
app.get('/', (req, res) => {
  console.log('✅ Rota raiz executada');
  res.json({
    message: 'Miles Deal API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      home: '/',
      setup: '/setup',
      health: '/health',
      flights: '/flights',
      search: '/search'
    }
  });
});

// SETUP - Configuração do banco
app.get('/setup', async (req, res) => {
  console.log('✅ Setup executado');
  
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    });
    
    await client.connect();
    console.log('🔌 Conectado ao banco');
    
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

// HEALTH - Status da API
app.get('/health', (req, res) => {
  console.log('✅ Health check executado');
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'API funcionando!',
    database: process.env.DATABASE_URL ? 'configured' : 'not_configured'
  });
});

// FLIGHTS - Listar voos
app.get('/flights', async (req, res) => {
  console.log('✅ Flights executado');
  
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    });
    
    await client.connect();
    
    const result = await client.query('SELECT * FROM flights ORDER BY created_at DESC LIMIT 20');
    
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
  
  const { origin, destination, max_miles, min_miles } = req.query;
  
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    });
    
    await client.connect();
    
    let query = 'SELECT * FROM flights WHERE 1=1';
    const params = [];
    let paramCount = 0;
    
    if (origin) {
      paramCount++;
      query += ` AND origin_city ILIKE $${paramCount}`;
      params.push(`%${origin}%`);
    }
    
    if (destination) {
      paramCount++;
      query += ` AND destination_city ILIKE $${paramCount}`;
      params.push(`%${destination}%`);
    }
    
    if (max_miles) {
      paramCount++;
      query += ` AND miles_price <= $${paramCount}`;
      params.push(parseInt(max_miles));
    }
    
    if (min_miles) {
      paramCount++;
      query += ` AND miles_price >= $${paramCount}`;
      params.push(parseInt(min_miles));
    }
    
    query += ' ORDER BY created_at DESC LIMIT 20';
    
    const result = await client.query(query, params);
    
    await client.end();
    
    res.json({
      success: true,
      message: 'Search completed successfully!',
      timestamp: new Date().toISOString(),
      filters: { origin, destination, max_miles, min_miles },
      total_results: result.rowCount,
      flights: result.rows
    });
    
  } catch (error) {
    console.error('❌ Erro na busca:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// ADD FLIGHT - Adicionar voo
app.post('/flights', async (req, res) => {
  console.log('✅ Add flight executado');
  
  try {
    const flightData = req.body;
    
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    });
    
    await client.connect();
    
    const insertQuery = `
      INSERT INTO flights (
        airline, miles_program, origin_city, destination_city, 
        destination_country, destination_continent, miles_price, 
        taxes_fees, flight_date, flight_class, availability, is_domestic
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id;
    `;
    
    const values = [
      flightData.airline,
      flightData.miles_program,
      flightData.origin_city,
      flightData.destination_city,
      flightData.destination_country,
      flightData.destination_continent,
      flightData.miles_price,
      flightData.taxes_fees,
      flightData.flight_date,
      flightData.flight_class,
      flightData.availability,
      flightData.is_domestic
    ];
    
    const result = await client.query(insertQuery, values);
    
    await client.end();
    
    res.json({
      success: true,
      message: 'Flight added successfully!',
      timestamp: new Date().toISOString(),
      flight_id: result.rows[0].id,
      data: flightData
    });
    
  } catch (error) {
    console.error('❌ Erro ao adicionar voo:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

process.on('SIGTERM', () => {
  console.log('🔴 Recebido SIGTERM - ignorando...');
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('=================================');
  console.log(`🚀 MILES DEAL API - PORTA ${PORT}`);
  console.log('🗃️ Banco de dados configurado');
  console.log('🚫 Cache desabilitado');
  console.log('📊 Rotas originais:');
  console.log('  - GET / (home)');
  console.log('  - GET /setup (criar tabelas)');
  console.log('  - GET /health (status)');
  console.log('  - GET /flights (listar voos)');
  console.log('  - GET /search (buscar voos)');
  console.log('  - POST /flights (adicionar voo)');
  console.log('=================================');
});
