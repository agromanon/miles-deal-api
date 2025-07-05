const express = require('express');
const { Client } = require('pg');
const app = express();
const PORT = process.env.PORT || 3000;

console.log('🚀 MILES DEAL API - VERSÃO COM BANCO');

app.use(express.json());

// HEALTH - API INFO E MENU PRINCIPAL
app.get('/health', (req, res) => {
  console.log('✅ Health/Menu executado');
  res.status(200).json({
    message: 'Miles Deal API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    database: process.env.DATABASE_URL ? 'configured' : 'not_configured',
    menu: {
      api_info: 'GET /health',
      main_functions: 'GET /test',
      setup_database: 'GET /test?action=setup',
      create_database: 'GET /test?action=database',
      list_flights: 'GET /test?action=flights',
      add_flight: 'POST /test (with flight data)'
    },
    usage: 'Use /test com parâmetros ?action= para diferentes funções'
  });
});

// TEST - TODAS AS FUNCIONALIDADES PRINCIPAIS
app.get('/test', async (req, res) => {
  const action = req.query.action;
  
  console.log(`✅ Test executado - action: ${action || 'default'}`);
  
  if (action === 'setup') {
    res.json({
      message: 'Database Setup Info',
      timestamp: new Date().toISOString(),
      database_url: process.env.DATABASE_URL ? 'configured' : 'NOT CONFIGURED',
      next_step: 'Use ?action=database para criar tabelas',
      table_to_create: 'flights'
    });
  } 
  else if (action === 'database') {
    try {
      console.log('🔧 Criando tabela flights...');
      
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
        message: 'Tabela flights criada com sucesso!',
        timestamp: new Date().toISOString(),
        next_step: 'Use ?action=flights para listar voos'
      });
      
    } catch (error) {
      console.error('❌ Erro ao criar tabela:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
  else if (action === 'flights') {
    try {
      console.log('📋 Listando voos...');
      
      const client = new Client({
        connectionString: process.env.DATABASE_URL
      });
      
      await client.connect();
      
      const result = await client.query('SELECT * FROM flights ORDER BY created_at DESC LIMIT 10');
      
      await client.end();
      
      res.json({
        success: true,
        message: 'Voos listados com sucesso!',
        timestamp: new Date().toISOString(),
        total_flights: result.rowCount,
        flights: result.rows
      });
      
    } catch (error) {
      console.error('❌ Erro ao listar voos:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
  else {
    res.json({
      message: 'Miles Deal API - Main Functions',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      available_actions: [
        '?action=setup - Database info',
        '?action=database - Create tables',
        '?action=flights - List flights'
      ],
      usage: 'Add ?action=NOME to use different functions'
    });
  }
});

// POST para adicionar voos
app.post('/test', async (req, res) => {
  console.log('✅ POST Test executado - add flight');
  
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
      message: 'Voo adicionado com sucesso!',
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
  console.log('📊 Rotas funcionais:');
  console.log('  - GET /health (menu principal)');
  console.log('  - GET /test?action=setup (info do banco)');
  console.log('  - GET /test?action=database (criar tabelas)');
  console.log('  - GET /test?action=flights (listar voos)');
  console.log('  - POST /test (adicionar voo)');
  console.log('=================================');
});
