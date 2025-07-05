const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');

const prisma = new PrismaClient();

class DealsController {
  // GET /api/deals/best
  async getBestDeals(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { 
        limit = 20, 
        continent, 
        country, 
        maxMiles, 
        isDomestic,
        minDealScore = 0 
      } = req.query;
      
      const whereClause = {
        dealScore: { gte: parseFloat(minDealScore) },
        ...(continent && { destinationContinent: continent }),
        ...(country && { destinationCountry: country }),
        ...(maxMiles && { milesPrice: { lte: parseInt(maxMiles) } }),
        ...(isDomestic !== undefined && { isDomestic: isDomestic === 'true' })
      };

      const deals = await prisma.flight.findMany({
        where: whereClause,
        orderBy: { dealScore: 'desc' },
        take: parseInt(limit)
      });

      res.json({
        success: true,
        data: deals,
        count: deals.length,
        filters: {
          continent,
          country,
          maxMiles,
          isDomestic,
          minDealScore
        }
      });
    } catch (error) {
      console.error('Erro ao buscar melhores ofertas:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // POST /api/deals/bulk - Endpoint para n8n
  async bulkCreateFlights(req, res) {
    try {
      const { flights, source = 'n8n' } = req.body;
      
      if (!flights || !Array.isArray(flights)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Campo flights deve ser um array' 
        });
      }

      const scoringService = require('../services/scoringService');
      
      const processedFlights = flights.map(flight => ({
        ...flight,
        dealScore: scoringService.calculateDealScore(flight),
        scrapedAt: new Date()
      }));

      await prisma.flight.createMany({
        data: processedFlights,
        skipDuplicates: true
      });

      // Log da execução
      await prisma.scrapingLog.create({
        data: {
          airline: flights[0]?.airline || 'Unknown',
          status: 'success',
          message: `Bulk insert de ${flights.length} voos`,
          flightsFound: flights.length,
          executionTime: Math.round(Date.now() / 1000)
        }
      });

      res.json({
        success: true,
        message: `${processedFlights.length} voos processados com sucesso`,
        source,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Erro no bulk insert:', error);
      
      // Log do erro
      await prisma.scrapingLog.create({
        data: {
          airline: 'Unknown',
          status: 'error',
          message: error.message,
          flightsFound: 0,
          executionTime: 0
        }
      });

      res.status(500).json({ success: false, error: error.message });
    }
  }

  // GET /api/deals/stats
  async getStats(req, res) {
    try {
      const stats = await prisma.$transaction([
        prisma.flight.count(),
        prisma.flight.count({ where: { isDomestic: true } }),
        prisma.flight.count({ where: { isDomestic: false } }),
        prisma.flight.findFirst({ orderBy: { scrapedAt: 'desc' } })
      ]);

      const [totalFlights, domesticFlights, internationalFlights, lastFlight] = stats;

      res.json({
        success: true,
        data: {
          totalFlights,
          domesticFlights,
          internationalFlights,
          lastScrapedAt: lastFlight?.scrapedAt
        }
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new DealsController();
