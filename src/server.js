const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

console.log('🚀 Miles Deal API iniciando...');

app.use(express.json());

// Health check
app.get('/health', async (req, res) => {
  try {
    await prisma.$connect();
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: error.message
    });
  }
});

// Melhores ofertas
app.get('/api/deals/best', async (req, res) => {
  try {
    const deals = await prisma.flight.findMany({
      orderBy: { dealScore: 'desc' },
      take: 20
    });
    res.json(deals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔴 Shutdown graceful...');
  prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Miles Deal API rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
