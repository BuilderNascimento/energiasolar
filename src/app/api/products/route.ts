import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';

// Schema de validação para produtos
const productSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  type: z.enum(['PATINETE', 'BIKE', 'SCOOTER']),
  price: z.number().positive('Preço deve ser positivo'),
  image: z.string().url('URL da imagem inválida'),
  features: z.array(z.string()).min(1, 'Pelo menos uma característica é obrigatória'),
  description: z.string().optional(),
  inStock: z.boolean().default(true)
});

// GET - Listar produtos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type');
    const inStock = searchParams.get('inStock');
    
    // Construir filtros
    const where: any = {};
    if (type) {
      where.type = type.toUpperCase();
    }
    if (inStock !== null) {
      where.inStock = inStock === 'true';
    }
    
    // Buscar produtos do banco de dados
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.product.count({ where })
    ]);
    
    // Converter features de JSON string para array
    const productsWithFeatures = products.map(product => ({
      ...product,
      features: JSON.parse(product.features)
    }));
    
    return NextResponse.json({
      success: true,
      data: productsWithFeatures,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      filters: {
        type,
        inStock
      }
    });
    
  } catch (error) {
    console.error('❌ Erro ao buscar produtos:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao buscar produtos'
    }, { status: 500 });
  }
}

// POST - Criar novo produto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar dados
    const validatedData = productSchema.parse(body);
    
    // Salvar produto no banco de dados
    const savedProduct = await prisma.product.create({
      data: {
        ...validatedData,
        features: JSON.stringify(validatedData.features)
      }
    });
    
    console.log('✅ Novo produto criado:', savedProduct.id);
    
    return NextResponse.json({
      success: true,
      message: 'Produto criado com sucesso!',
      data: {
        ...savedProduct,
        features: JSON.parse(savedProduct.features)
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('❌ Erro ao criar produto:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Dados inválidos',
        errors: error.errors
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor'
    }, { status: 500 });
  }
}