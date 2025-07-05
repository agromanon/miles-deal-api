const express = require('express');
const { query } = require('express-validator');
const dealsController = require('../controllers/dealsController');

const router = express.Router();

// Validações comuns
const validateLimit = query('limit').optional().isInt({ min: 1, max: 100 });
const validateContinent = query('continent').optional().isIn([
  'Europa', 'América do Norte', 'América do Sul', 'Ásia', 'África', 'Oceania'
]);
const validateMaxMiles = query('maxMiles').optional().isInt({ min: 1 });
const validateIsDomestic = query('isDomestic').optional().isBoolean();

// GET /api/deals/best
router.get('/best', [
  validateLimit,
  validateContinent,
  validateMaxMiles,
  validateIsDomestic,
  query('minDealScore').optional().isFloat({ min: 0, max: 100 })
], dealsController.getBestDeals);

// GET /api/deals/domestic
router.get('/domestic', (req, res, next) => {
  req.query.isDomestic = 'true';
  next();
}, dealsController.getBestDeals);

// GET /api/deals/international
router.get('/international', (req, res, next) => {
  req.query.isDomestic = 'false';
  next();
}, dealsController.getBestDeals);

// GET /api/deals/stats
router.get('/stats', dealsController.getStats);

// POST /api/deals/bulk (para n8n)
router.post('/bulk', dealsController.bulkCreateFlights);

module.exports = router;
