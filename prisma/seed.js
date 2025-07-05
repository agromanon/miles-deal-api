const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Populando database...');

  // Seed destinos principais
  const destinations = [
    // Brasil
    { city: 'São Paulo', country: 'Brasil', continent: 'América do Sul', isHub: true },
    { city: 'Rio de Janeiro', country: 'Brasil', continent: 'América do Sul', isHub: true },
    { city: 'Brasília', country: 'Brasil', continent: 'América do Sul', isHub: false },
    { city: 'Salvador', country: 'Brasil', continent: 'América do Sul', isHub: false },
    { city: 'Recife', country: 'Brasil', continent: 'América do Sul', isHub: false },
    { city: 'Fortaleza', country: 'Brasil', continent: 'América do Sul', isHub: false },
    
    // Europa
    { city: 'Lisboa', country: 'Portugal', continent: 'Europa', isHub: true },
    { city: 'Madrid', country: 'Espanha', continent: 'Europa', isHub: true },
    { city: 'Barcelona', country: 'Espanha', continent: 'Europa', isHub: false },
    { city: 'Paris', country: 'França', continent: 'Europa', isHub: true },
    { city: 'Roma', country: 'Itália', continent: 'Europa', isHub: false },
    { city: 'Londres', country: 'Reino Unido', continent: 'Europa', isHub: true },
    { city: 'Amsterdam', country: 'Holanda', continent: 'Europa', isHub: true },
    { city: 'Frankfurt', country: 'Alemanha', continent: 'Europa', isHub: true },
    
    // América do Norte
    { city: 'Miami', country: 'Estados Unidos', continent: 'América do Norte', isHub: true },
    { city: 'Nova York', country: 'Estados Unidos', continent: 'América do Norte', isHub: true },
    { city: 'Los Angeles', country: 'Estados Unidos', continent: 'América do Norte', isHub: true },
    { city: 'Toronto', country: 'Canadá', continent: 'América do Norte', isHub: true },
    
    // América do Sul
    { city: 'Buenos Aires', country: 'Argentina', continent: 'América do Sul', isHub: true },
    { city: 'Santiago', country: 'Chile', continent: 'América do Sul', isHub: true },
    { city: 'Lima', country: 'Peru', continent: 'América do Sul', isHub: true },
    
    // Ásia
    { city: 'Tóquio', country: 'Japão', continent: 'Ásia', isHub: true },
    { city: 'Dubai', country: 'Emirados Árabes Unidos', continent: 'Ásia', isHub: true },
    { city: 'Singapura', country: 'Singapura', continent: 'Ásia', isHub: true }
  ];

  for (const dest of destinations) {
    await prisma.destination.upsert({
      where: { city: dest.city },
      update: {},
      create: dest
    });
  }

  console.log(`✅ ${destinations.length} destinos criados!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
