// src/server.js

// 1. Carrega as variáveis de ambiente do arquivo .env
// Isso é crucial para que process.env.PORT e process.env.DATABASE_URL funcionem.
require('dotenv').config();

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors'); // Importa o pacote cors

const app = express();
const prisma = new PrismaClient();

// Configurações do servidor
const PORT = process.env.PORT || 3000; // Usa a porta do ambiente ou 3000 como padrão
const HEALTHCHECK_ENDPOINT = process.env.HEALTHCHECK_ENDPOINT || '/health';

// Middleware
app.use(express.json({ limit: '50mb' })); // Aumenta o limite para JSON para dados de bulk
app.use(cors()); // Habilita CORS para todas as rotas

// Função para calcular o dealScore
const calculateDealScore = (flight) => {
    // Implemente sua lógica de cálculo de dealScore aqui
    // Exemplo simplificado, usando os campos do seu schema.prisma
    const baseScore = 100;
    
    // Usando milesPrice e taxesFees do seu schema
    const milesPriceFactor = flight.milesPrice ? flight.milesPrice / 1000 : 0; // Quanto menor o preço em milhas, maior o score
    const taxesFeesFactor = flight.taxesFees ? flight.taxesFees / 100 : 0; // Quanto menor as taxas, maior o score
    
    // Se houver um campo de duração no JSON de entrada (como durationHours), use-o
    // Caso contrário, ele será 0 e não afetará o score.
    const durationFactor = flight.durationHours ? flight.durationHours / 24 : 0; 

    // Adapte esta fórmula à sua estratégia de negócio
    return Math.max(0, baseScore - (milesPriceFactor * 10) - (taxesFeesFactor * 5) - (durationFactor * 2));
};


// Endpoint para receber dados em massa do n8n
app.post('/api/flights/bulk', async (req, res) => {
    try {
        const flightsData = req.body;

        if (!Array.isArray(flightsData) || flightsData.length === 0) {
            return res.status(400).json({ error: 'O corpo da requisição deve ser um array de dados de voo não vazio.' });
        }

        const flightsToCreate = flightsData.map(flight => ({
            airline: flight.airline,
            milesProgram: flight.milesProgram, // Adicionado conforme schema
            originCity: flight.originCity, // Adicionado conforme schema
            destinationCity: flight.destinationCity, // Adicionado conforme schema
            destinationCountry: flight.destinationCountry, // Adicionado conforme schema
            destinationContinent: flight.destinationContinent, // Adicionado conforme schema
            milesPrice: parseInt(flight.milesPrice, 10), // Usar milesPrice e garantir que é int
            taxesFees: parseFloat(flight.taxesFees), // Usar taxesFees e garantir que é float
            flightDate: new Date(flight.flightDate),
            returnDate: flight.returnDate ? new Date(flight.returnDate) : null,
            flightClass: flight.flightClass, // Adicionado conforme schema
            availability: parseInt(flight.availability, 10), // Adicionado conforme schema
            isDomestic: flight.isDomestic, // Adicionado conforme schema
            dealScore: calculateDealScore(flight), // Calcula o dealScore
            scrapedAt: new Date(),
        }));

        // Limpa a tabela antes de inserir novos dados (opcional, dependendo da sua estratégia)
        // await prisma.flight.deleteMany({});
        // console.log('Dados de voo existentes deletados.');

        const result = await prisma.flight.createMany({
            data: flightsToCreate,
            skipDuplicates: true, // Opcional: ignora duplicatas se houver chaves únicas
        });

        console.log(`Recebidos e processados ${flightsData.length} voos. Inseridos: ${result.count}`);
        res.status(200).json({ message: 'Dados de voo recebidos e processados com sucesso!', count: result.count });

    } catch (error) {
        console.error('Erro ao processar dados de voo:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao processar dados de voo.' });
    }
});


// Endpoint de Health Check
app.get(HEALTHCHECK_ENDPOINT, async (req, res) => {
    console.log('✅ HEALTH CHECK RECEBIDO (Endpoint /health)!'); // Log para confirmar que a rota foi atingida
    try {
        // Tenta fazer uma query simples no banco de dados para verificar a conexão
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({
            status: 'ok',
            message: 'API e conexão com o banco de dados estão funcionando.',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Health check falhou:', error);
        res.status(500).json({
            status: 'error',
            message: 'API está funcionando, mas a conexão com o banco de dados falhou.',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Tratamento de rotas não encontradas
app.use((req, res, next) => {
    res.status(404).json({ message: 'Rota não encontrada.' });
});

// Tratamento de erros gerais
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo deu errado no servidor!' });
});

// Inicia o servidor
const server = app.listen(PORT, () => {
    console.log('🚀 MILES DEAL API - FRESH START');
    console.log(`📍 PORT: ${PORT}`);
    console.log(`📍 ENV PORT: ${process.env.PORT ? process.env.PORT : 'Não definida (usando padrão)'}`); // Ajustado para mostrar o valor da porta se definida
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`--- Servidor pronto para receber requisições ---`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM signal recebido: Encerrando o servidor...');
    await prisma.$disconnect(); // Desconecta o Prisma do banco de dados
    server.close(() => {
        console.log('Servidor HTTP encerrado.');
        process.exit(0);
    });
});

process.on('SIGINT', async () => {
    console.log('SIGINT signal recebido: Encerrando o servidor...');
    await prisma.$disconnect(); // Desconecta o Prisma do banco de dados
    server.close(() => {
        console.log('Servidor HTTP encerrado.');
        process.exit(0);
    });
});
