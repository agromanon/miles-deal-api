const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

console.log('🚀 MILES DEAL API - VERSÃO FINAL');

app.use(express.json());

// HEALTH - API INFO E MENU PRINCIPAL
app.get('/health', (req, res) => {
  console.log('✅ Health/Menu executado');
  res.status(200).json({
    message: 'Miles Deal API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
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
app.get('/test', (req, res) => {
  const action = req.query.action;
  
  console.log(`✅ Test executado - action: ${action || 'default'}`);
  
  if (action === 'setup') {
    res.json({
      message: 'Database Setup Ready!',
      timestamp: new Date().toISOString(),
      next_step: 'Use ?action=database para criar tabelas'
    });
  } 
  else if (action === 'database') {
    res.json({
      message: 'Database Creation Ready!',
      timestamp: new Date().toISOString(),
      info: 'Aqui vamos criar a tabela flights',
      status: 'ready_to_create'
    });
  }
  else if (action === 'flights') {
    res.json({
      message: 'Flights List Ready!',
      timestamp: new Date().toISOString(),
      info: 'Aqui vamos listar os voos',
      flights: []
    });
  }
  else {
    res.json({
      message: 'Miles Deal API - Main Functions',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      available_actions: [
        '?action=setup - Setup database',
        '?action=database - Create tables',
        '?action=flights - List flights'
      ],
      usage: 'Add ?action=NOME to use different functions'
    });
  }
});

// POST para adicionar voos
app.post('/test', (req, res) => {
  console.log('✅ POST Test executado - add flight');
  res.json({
    message: 'Flight Add Ready!',
    timestamp: new Date().toISOString(),
    received_data: req.body,
    status: 'ready_to_process'
  });
});

process.on('SIGTERM', () => {
  console.log('🔴 Recebido SIGTERM - ignorando...');
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('=================================');
  console.log(`🚀 MILES DEAL API - PORTA ${PORT}`);
  console.log('📊 Rotas funcionais:');
  console.log('  - GET /health (menu principal)');
  console.log('  - GET /test (funções principais)');
  console.log('  - POST /test (adicionar dados)');
  console.log('=================================');
});
