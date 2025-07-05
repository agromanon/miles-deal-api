class ScoringService {
  calculateDealScore(flight) {
    let score = 100;
    
    // Fator 1: Preço em milhas (peso: 40%)
    const milesPrice = flight.milesPrice || 0;
    if (milesPrice <= 25000) score -= 0;
    else if (milesPrice <= 40000) score -= 10;
    else if (milesPrice <= 60000) score -= 20;
    else if (milesPrice <= 80000) score -= 30;
    else score -= 40;
    
    // Fator 2: Relação taxas/milhas (peso: 20%)
    const taxesRatio = (flight.taxesFees || 0) / milesPrice;
    if (taxesRatio > 0.5) score -= 20;
    else if (taxesRatio > 0.3) score -= 12;
    else if (taxesRatio > 0.2) score -= 6;
    
    // Fator 3: Disponibilidade (peso: 15%)
    const availability = flight.availability || 0;
    if (availability < 1) score -= 15;
    else if (availability < 3) score -= 10;
    else if (availability < 5) score -= 5;
    
    // Fator 4: Classe do voo (peso: 10%)
    const flightClass = flight.flightClass || 'economy';
    if (flightClass.toLowerCase().includes('business')) score += 10;
    else if (flightClass.toLowerCase().includes('premium')) score += 5;
    
    // Fator 5: Destino hub (peso: 10%)
    const hubDestinations = [
      'Lisboa', 'Madrid', 'Paris', 'Londres', 'Amsterdam', 'Frankfurt',
      'Miami', 'Nova York', 'Toronto', 'Buenos Aires', 'Santiago'
    ];
    if (hubDestinations.includes(flight.destinationCity)) {
      score += 10;
    }
    
    // Fator 6: Sazonalidade (peso: 5%)
    const flightDate = new Date(flight.flightDate);
    const month = flightDate.getMonth() + 1;
    
    // Meses de alta temporada no hemisfério norte (Jun-Ago, Dez-Jan)
    if ([6, 7, 8, 12, 1].includes(month)) {
      score -= 5;
    }
    // Meses de baixa temporada
    else if ([3, 4, 5, 9, 10, 11].includes(month)) {
      score += 5;
    }
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }
  
  getDealCategory(score) {
    if (score >= 90) return 'Excelente';
    if (score >= 80) return 'Muito Bom';
    if (score >= 70) return 'Bom';
    if (score >= 60) return 'Regular';
    return 'Ruim';
  }
}

module.exports = new ScoringService();
