Miles Deal API
API para encontrar as melhores ofertas de passagens aéreas com milhas.

🚀 Endpoints
Deals
GET /api/deals/best - Melhores ofertas
GET /api/deals/domestic - Voos nacionais
GET /api/deals/international - Voos internacionais
GET /api/deals/stats - Estatísticas
POST /api/deals/bulk - Bulk insert (n8n)
Health
GET /health - Status da API
🔧 Integração com n8n
json
Copiar

POST /api/deals/bulk
{
  "flights": [
    {
      "airline": "LATAM",
      "milesProgram": "LATAM Pass",
      "originCity": "São Paulo",
      "destinationCity": "Madrid",
      "destinationCountry": "Espanha",
      "destinationContinent": "Europa",
      "milesPrice": 35000,
      "taxesFees": 280.50,
      "flightDate": "2024-06-15T10:00:00Z",
      "flightClass": "economy",
      "availability": 5,
      "isDomestic": false
    }
  ]
}
📊 Sistema de Pontuação
Avalia ofertas de 0-100 baseado em:

Preço em milhas (40%)
Relação taxas/milhas (20%)
Disponibilidade (15%)
Classe do voo (10%)
Destino hub (10%)
Sazonalidade (5%)
