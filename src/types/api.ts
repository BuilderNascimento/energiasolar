// Tipos para API de Leads
export interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  monthlyBill: string;
  location: string;
  installationType: string;
  monthlyConsumption?: string;
  residents?: string;
  roofArea?: string;
  interest?: string;
  message?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  source: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateLeadRequest {
  fullName: string;
  email: string;
  phone: string;
  monthlyBill: string;
  location: string;
  installationType: string;
  monthlyConsumption?: string;
  residents?: string;
  roofArea?: string;
  interest?: string;
  message?: string;
}

export interface LeadResponse {
  success: boolean;
  message: string;
  leadId?: string;
  data?: {
    name: string;
    email: string;
    phone: string;
    createdAt: string;
  };
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface LeadsListResponse {
  success: boolean;
  leads: Lead[];
  total: number;
  message?: string;
}

// Tipos para API de Simulação
export interface SimulationInput {
  monthlyBill: number;
  location: string;
  installationType: 'residencial' | 'comercial' | 'industrial';
  monthlyConsumption?: number;
  roofArea?: number;
  residents?: number;
}

export interface SimulationResult {
  panels: number;
  monthlyProduction: number;
  monthlySavings: number;
  annualSavings: number;
  paybackPeriod: number;
  co2Reduction: number;
  savingsPercentage: number;
  installationCost: number;
  systemPower: number;
  region: string;
  locationFactor: number;
}

export interface Simulation {
  id: string;
  input: SimulationInput;
  result: SimulationResult;
  leadId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SimulationResponse {
  success: boolean;
  message: string;
  simulationId?: string;
  data?: SimulationResult;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface SimulationsListResponse {
  success: boolean;
  simulations: Array<{
    id: string;
    monthlyBill: number;
    location: string;
    panels: number;
    monthlySavings: number;
    annualSavings: number;
    paybackPeriod: number;
    createdAt: string;
  }>;
  total: number;
  message?: string;
}

// Tipos para Dashboard
export interface DashboardStats {
  totalLeads: number;
  totalSimulations: number;
  conversionRate: number;
  averageMonthlyBill: number;
  totalPotentialSavings: number;
  leadsThisMonth: number;
  simulationsThisMonth: number;
  topLocations: Array<{
    location: string;
    count: number;
  }>;
}

// Tipos para Autenticação
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'viewer';
  createdAt: string;
  lastLogin?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

// Tipos para Produtos
export interface Product {
  id: string;
  name: string;
  type: 'patinete' | 'bike' | 'scooter';
  price: number;
  image: string;
  features: string[];
  description?: string;
  inStock: boolean;
  createdAt: string;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
  total: number;
  message?: string;
}

// Tipos para Erros da API
export interface ApiError {
  success: false;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// Tipos para Respostas Genéricas
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Tipos para Filtros e Paginação
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface LeadFilters extends PaginationParams {
  status?: Lead['status'];
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  source?: string;
}

export interface SimulationFilters extends PaginationParams {
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  minBill?: number;
  maxBill?: number;
}

// Tipos para Webhooks e Integrações
export interface WebhookPayload {
  event: string;
  data: Record<string, unknown>;
  timestamp: string;
  source: string;
}

export interface CrmIntegration {
  provider: 'hubspot' | 'pipedrive' | 'rdstation';
  apiKey: string;
  enabled: boolean;
  lastSync?: string;
}

export interface EmailIntegration {
  provider: 'mailchimp' | 'sendgrid' | 'ses';
  apiKey: string;
  enabled: boolean;
  templates: {
    welcome: string;
    followup: string;
    simulation: string;
  };
}