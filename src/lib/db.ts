import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Previne múltiplas instâncias do Prisma Client em desenvolvimento
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Função para conectar ao banco de dados
export async function connectDB() {
  try {
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados');
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
    throw error;
  }
}

// Função para desconectar do banco de dados
export async function disconnectDB() {
  try {
    await prisma.$disconnect();
    console.log('✅ Desconectado do banco de dados');
  } catch (error) {
    console.error('❌ Erro ao desconectar do banco de dados:', error);
    throw error;
  }
}

// Função para verificar a saúde do banco de dados
export async function checkDBHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'healthy', message: 'Banco de dados funcionando corretamente' };
  } catch (error) {
    return { status: 'unhealthy', message: 'Erro na conexão com o banco de dados', error };
  }
}

// Função para limpar dados de desenvolvimento (use com cuidado!)
export async function clearDevData() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Não é possível limpar dados em produção!');
  }
  
  try {
    await prisma.simulation.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.product.deleteMany();
    console.log('✅ Dados de desenvolvimento limpos');
  } catch (error) {
    console.error('❌ Erro ao limpar dados:', error);
    throw error;
  }
}

// Função para popular dados iniciais
export async function seedDatabase() {
  try {
    // Criar usuário admin padrão
    const hashedPassword = await bcrypt.hash('password', 10);
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@energiasolar.com' },
      update: {},
      create: {
        email: 'admin@energiasolar.com',
        name: 'Administrador',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    // Criar produtos iniciais
    const products = [
      {
        name: 'Patinete Elétrico WX-01',
        type: 'PATINETE' as const,
        price: 1299,
        image: '/patinete-wx01.png',
        features: JSON.stringify(['Autonomia 25km', 'Velocidade 25km/h', 'Peso 12kg']),
        description: 'Patinete elétrico ideal para deslocamentos urbanos'
      },
      {
        name: 'Bike Elétrica WX-03',
        type: 'BIKE' as const,
        price: 2499,
        image: '/bike-wx03.png',
        features: JSON.stringify(['Autonomia 50km', 'Velocidade 35km/h', 'Bateria removível']),
        description: 'Bicicleta elétrica com excelente autonomia'
      },
      {
        name: 'Scooter WX-05',
        type: 'SCOOTER' as const,
        price: 3299,
        image: '/scooter-wx05.png',
        features: JSON.stringify(['Autonomia 60km', 'Velocidade 45km/h', 'Duplo assento']),
        description: 'Scooter elétrico para duas pessoas'
      },
      {
        name: 'Scooter WX-10',
        type: 'SCOOTER' as const,
        price: 4999,
        image: '/scooter-wx10.png',
        features: JSON.stringify(['Autonomia 80km', 'Velocidade 60km/h', 'Sistema GPS']),
        description: 'Scooter premium com GPS integrado'
      }
    ];

    for (const product of products) {
      await prisma.product.upsert({
        where: { name: product.name },
        update: product,
        create: product
      });
    }

    // Criar configurações iniciais
    const settings = [
      { key: 'site_name', value: 'Energia Solar' },
      { key: 'contact_email', value: 'contato@energiasolar.com' },
      { key: 'contact_phone', value: '(11) 99999-9999' },
      { key: 'kwh_price', value: '0.75' },
      { key: 'panel_generation', value: '30' },
      { key: 'installation_cost_per_kw', value: '4500' }
    ];

    for (const setting of settings) {
      await prisma.setting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: setting
      });
    }

    console.log('✅ Banco de dados populado com dados iniciais');
    console.log('👤 Usuário admin criado: admin@energiasolar.com / password');
    
  } catch (error) {
    console.error('❌ Erro ao popular banco de dados:', error);
    throw error;
  }
}

export default prisma;