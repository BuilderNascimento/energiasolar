import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';

// Schema de validação para leads
const leadSchema = z.object({
  fullName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  monthlyBill: z.string().min(1, 'Conta mensal é obrigatória'),
  location: z.string().min(2, 'Localização é obrigatória'),
  installationType: z.string().min(1, 'Tipo de instalação é obrigatório'),
  monthlyConsumption: z.string().optional(),
  residents: z.string().optional(),
  roofArea: z.string().optional(),
  interest: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar dados
    const validatedData = leadSchema.parse(body);
    
    // Salvar no banco de dados
    const savedLead = await prisma.lead.create({
      data: {
        ...validatedData,
        source: 'website'
      }
    });
    
    console.log('✅ Novo lead salvo:', savedLead.id);
    
    return NextResponse.json({
      success: true,
      message: 'Lead cadastrado com sucesso!',
      leadId: savedLead.id,
      data: savedLead
    }, { status: 201 });
    
  } catch (error) {
    console.error('Erro ao processar lead:', error);
    
    // Erro de validação
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Dados inválidos',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 });
    }
    
    // Erro interno do servidor
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor'
    }, { status: 500 });
  }
}

// GET - Listar leads (para dashboard administrativo)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    
    // Construir filtros
    const where: { status?: string } = {};
    if (status) {
      where.status = status.toUpperCase();
    }
    
    // Buscar leads do banco de dados
    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          simulations: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      }),
      prisma.lead.count({ where })
    ]);
    
    return NextResponse.json({
      success: true,
      data: leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      filters: {
        status
      }
    });
    
  } catch (error) {
    console.error('❌ Erro ao buscar leads:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao buscar leads'
    }, { status: 500 });
  }
}