const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

console.log('🚀 Miles Deal API iniciando...');

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  console.log('Health check acessado');
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'API funcionando!',
    uptime: process.uptime()
  });
});

// Criar tabela
app.get('/setup/database', async (req, res) => {
  try {
    const { Client } = require('pg');
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    });
    
    await client.connect();
    
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
    await client.end();
    
    res.json({ 
      success: true, 
      message: 'Tabela flights criada com sucesso!' 
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
});

app.get('/test', (req, res) => {
  res.json({
    message: 'API está funcionando!',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Miles Deal API rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
