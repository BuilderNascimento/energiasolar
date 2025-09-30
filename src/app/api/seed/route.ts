import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/db';

// POST - Popular banco de dados com dados iniciais
export async function POST() {
  try {
    // Verificar se é ambiente de desenvolvimento
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({
        success: false,
        message: 'Seed não permitido em produção'
      }, { status: 403 });
    }

    await seedDatabase();

    return NextResponse.json({
      success: true,
      message: 'Banco de dados populado com sucesso!',
      data: {
        adminUser: 'admin@energiasolar.com',
        password: 'password',
        productsCreated: 4,
        settingsCreated: 6
      }
    });

  } catch (error) {
    console.error('❌ Erro ao popular banco de dados:', error);

    return NextResponse.json({
      success: false,
      message: 'Erro ao popular banco de dados',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

// GET - Verificar status do banco de dados
export async function GET() {
  try {
    const { prisma, checkDBHealth } = await import('@/lib/db');
    
    const health = await checkDBHealth();
    
    // Contar registros
    const [leadsCount, simulationsCount, usersCount, productsCount] = await Promise.all([
      prisma.lead.count(),
      prisma.simulation.count(),
      prisma.user.count(),
      prisma.product.count()
    ]);

    return NextResponse.json({
      success: true,
      health,
      stats: {
        leads: leadsCount,
        simulations: simulationsCount,
        users: usersCount,
        products: productsCount
      }
    });

  } catch (error) {
    console.error('❌ Erro ao verificar status do banco:', error);

    return NextResponse.json({
      success: false,
      message: 'Erro ao verificar status do banco de dados',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}