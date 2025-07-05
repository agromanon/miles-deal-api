const express = require('express');
const router = express.Router();

// Placeholder para alertas (implementar depois)
router.get('/', (req, res) => {
  res.json({ message: 'Alertas endpoint - em desenvolvimento' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Criar alerta - em desenvolvimento' });
});

module.exports = router;
