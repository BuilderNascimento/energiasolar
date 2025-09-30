import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';

// Schema de validação para simulação
const simulationSchema = z.object({
  monthlyBill: z.number().min(50, 'Conta mensal deve ser pelo menos R$ 50'),
  location: z.string().min(2, 'Localização é obrigatória'),
  installationType: z.enum(['residencial', 'comercial', 'industrial']),
  monthlyConsumption: z.number().optional(),
  roofArea: z.number().optional(),
  residents: z.number().optional(),
  leadId: z.string().optional(),
});

// Função para calcular simulação de energia solar
function calculateSolarSimulation(data: z.infer<typeof simulationSchema>) {
  const { monthlyBill, location, installationType, monthlyConsumption } = data;
  
  // Fatores de cálculo baseados na localização (simplificado)
  const locationFactors: Record<string, number> = {
    'norte': 1.2,
    'nordeste': 1.3,
    'centro-oeste': 1.1,
    'sudeste': 1.0,
    'sul': 0.9,
  };
  
  // Detectar região pela localização (simplificado)
  const region = location.toLowerCase().includes('sp') || location.toLowerCase().includes('são paulo') ? 'sudeste' :
                location.toLowerCase().includes('rj') || location.toLowerCase().includes('rio') ? 'sudeste' :
                location.toLowerCase().includes('mg') || location.toLowerCase().includes('minas') ? 'sudeste' :
                location.toLowerCase().includes('ba') || location.toLowerCase().includes('bahia') ? 'nordeste' :
                location.toLowerCase().includes('ce') || location.toLowerCase().includes('ceará') ? 'nordeste' :
                location.toLowerCase().includes('pe') || location.toLowerCase().includes('pernambuco') ? 'nordeste' :
                location.toLowerCase().includes('rs') || location.toLowerCase().includes('rio grande') ? 'sul' :
                location.toLowerCase().includes('pr') || location.toLowerCase().includes('paraná') ? 'sul' :
                location.toLowerCase().includes('sc') || location.toLowerCase().includes('santa catarina') ? 'sul' :
                'sudeste'; // default
  
  const locationFactor = locationFactors[region] || 1.0;
  
  // Cálculos básicos
  const averageKwhPrice = 0.75; // R$ por kWh (média Brasil)
  const estimatedConsumption = monthlyConsumption || (monthlyBill / averageKwhPrice);
  
  // Fator de instalação
  const installationFactors = {
    'residencial': 1.0,
    'comercial': 0.9,
    'industrial': 0.8
  };
  
  const installationFactor = installationFactors[installationType] || 1.0;
  
  // Cálculo do número de painéis (cada painel gera ~30 kWh/mês)
  const panelGeneration = 30 * locationFactor;
  const panels = Math.ceil(estimatedConsumption / panelGeneration);
  
  // Produção mensal estimada
  const monthlyProduction = panels * panelGeneration;
  
  // Economia mensal (considerando 95% de eficiência)
  const efficiency = 0.95;
  const monthlySavings = Math.min(monthlyProduction * efficiency * averageKwhPrice, monthlyBill * 0.95);
  
  // Economia anual
  const annualSavings = monthlySavings * 12;
  
  // Custo estimado da instalação (R$ 4.500 por kW instalado)
  const systemPower = panels * 0.4; // cada painel ~400W
  const installationCost = systemPower * 4500 * installationFactor;
  
  // Período de retorno do investimento
  const paybackPeriod = installationCost / annualSavings;
  
  // Redução de CO2 (cada kWh solar evita ~0.5kg CO2)
  const co2Reduction = monthlyProduction * 12 * 0.5;
  
  // Porcentagem de economia
  const savingsPercentage = (monthlySavings / monthlyBill) * 100;
  
  return {
    panels: Math.round(panels),
    monthlyProduction: Math.round(monthlyProduction),
    monthlySavings: Math.round(monthlySavings),
    annualSavings: Math.round(annualSavings),
    paybackPeriod: Math.round(paybackPeriod * 10) / 10,
    co2Reduction: Math.round(co2Reduction),
    savingsPercentage: Math.round(savingsPercentage),
    installationCost: Math.round(installationCost),
    systemPower: Math.round(systemPower * 10) / 10,
    region,
    locationFactor
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar dados de entrada
    const validatedData = simulationSchema.parse(body);
    
    // Calcular simulação
    const results = calculateSolarSimulation(validatedData);
    
    // Salvar simulação no banco de dados
    const savedSimulation = await prisma.simulation.create({
      data: {
        monthlyBill: validatedData.monthlyBill,
        location: validatedData.location,
        installationType: validatedData.installationType.toUpperCase() as 'RESIDENCIAL' | 'COMERCIAL' | 'INDUSTRIAL',
        monthlyConsumption: validatedData.monthlyConsumption,
        roofArea: validatedData.roofArea,
        residents: validatedData.residents,
        leadId: validatedData.leadId,
        
        // Resultados da simulação
        panels: results.panels,
        monthlyProduction: results.monthlyProduction,
        monthlySavings: results.monthlySavings,
        annualSavings: results.annualSavings,
        paybackPeriod: results.paybackPeriod,
        co2Reduction: results.co2Reduction,
        savingsPercentage: results.savingsPercentage,
        installationCost: results.installationCost,
        systemPower: results.systemPower,
        region: results.region,
        locationFactor: results.locationFactor
      }
    });
    
    console.log('✅ Nova simulação salva:', savedSimulation.id);
    
    return NextResponse.json({
      success: true,
      message: 'Simulação calculada com sucesso!',
      simulationId: savedSimulation.id,
      data: {
        input: validatedData,
        results,
        simulation: savedSimulation
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('❌ Erro ao calcular simulação:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Dados de entrada inválidos',
        errors: error.errors
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor'
    }, { status: 500 });
  }
}

// GET - Listar simulações (para dashboard administrativo)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const location = searchParams.get('location');
    const installationType = searchParams.get('installationType');
    
    // Construir filtros
    const where: { location?: { contains: string; mode: string }; installationType?: 'RESIDENCIAL' | 'COMERCIAL' } = {};
    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive'
      };
    }
    if (installationType) {
      where.installationType = installationType.toUpperCase() as 'RESIDENCIAL' | 'COMERCIAL';
    }
    
    // Buscar simulações do banco de dados
    const [simulations, total] = await Promise.all([
      prisma.simulation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          lead: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true
            }
          }
        }
      }),
      prisma.simulation.count({ where })
    ]);
    
    return NextResponse.json({
      success: true,
      data: simulations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      filters: {
        location,
        installationType
      }
    });
    
  } catch (error) {
    console.error('❌ Erro ao buscar simulações:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao buscar simulações'
    }, { status: 500 });
  }
}