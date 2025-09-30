"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

import { Sun, Zap, DollarSign, Leaf, Shield, Award, Star, Phone, Mail, MapPin, Users } from "lucide-react";
import Chatbot from "@/components/Chatbot";
import Carousel from "@/components/Carousel";

// Interface para o Supabase client
interface SupabaseClient {
  from: (table: string) => {
    insert: (data: Record<string, unknown>[]) => Promise<{
      data: Record<string, unknown>[] | null;
      error: { message: string } | null;
    }>;
  };
}

interface WindowWithSupabase extends Window {
  supabaseClient?: SupabaseClient;
}

// Interface para resultados da simulação
interface SimulationResults {
  panels: number;
  systemSize: number;
  monthlyProduction: number;
  monthlySavings: number;
  annualSavings: number;
  paybackPeriod: number;
  co2Reduction: number;
  savingsPercentage: number;
  payback: number;
  systemCost: number;
  roi: number;
  savingsIn25Years: number;
  regionFactor: number;
}

// Hook para animação de contagem
const useCountUp = (end: number, duration: number = 2000, shouldStart: boolean = false) => {
  const [count, setCount] = useState(0);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!shouldStart || hasStartedRef.current) return;

    hasStartedRef.current = true;
    let startTime: number | null = null;
    const startValue = 0;
    let animationId: number | null = null;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = startValue + (end - startValue) * easeOutQuart;
      
      setCount(currentCount);
      
      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [shouldStart]);

  return count;
};

export default function Home() {
  // Campos básicos obrigatórios
  const [monthlyBill, setMonthlyBill] = useState("");
  const [location, setLocation] = useState("");
  const [installationType, setInstallationType] = useState("");
  // Campos opcionais
  const [monthlyConsumption] = useState("");
  // Campos estratégicos para leads
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  // Resultados
  const [simulationResults, setSimulationResults] = useState<SimulationResults | null>(null);
  
  // Estados para o formulário de leads
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    message: '',
    consumption: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados para animação dos números
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const statsRef = useRef(null);
  
  // Animações dos números
  const economyCount = useCountUp(48252, 2500, isStatsVisible);
  const powerCount = useCountUp(40.47, 2000, isStatsVisible);
  const modulesCount = useCountUp(71, 1500, isStatsVisible);
  const clientsCount = useCountUp(100, 2000, isStatsVisible);
  
  // Intersection Observer para detectar quando a seção aparece
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isStatsVisible) {
          setIsStatsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  // Event listener para o formulário de orçamento
  useEffect(() => {
    const formularioOrcamento = document.getElementById('formularioOrcamento');
    
    const handleFormSubmit = (e: Event) => {
      e.preventDefault(); // Evita reload da página
      
      // Captura os dados
      const dados = {
        nome: (document.getElementById('nome') as HTMLInputElement)?.value || '',
        email: (document.getElementById('email') as HTMLInputElement)?.value || '',
        telefone: (document.getElementById('telefone') as HTMLInputElement)?.value || '',
        consumo: (document.getElementById('consumo') as HTMLInputElement)?.value || '',
        tipo: (document.getElementById('tipo') as HTMLSelectElement)?.value || ''
      };
      
      console.log('Dados capturados:', dados);
       
       // Redireciona para WhatsApp com mensagem
       const mensagem = `Olá! Gostaria de um orçamento:
Nome: ${dados.nome}
Email: ${dados.email}
Telefone: ${dados.telefone}
${dados.consumo ? `Consumo: ${dados.consumo} kWh` : ''}
Tipo: ${dados.tipo}`;
       
       const whatsappURL = `https://wa.me/330783837981?text=${encodeURIComponent(mensagem)}`;
       window.open(whatsappURL, '_blank');
       
       // Mostra mensagem de sucesso
       const mensagemSucesso = document.getElementById('mensagemSucesso');
       if (mensagemSucesso) {
         mensagemSucesso.style.display = 'block';
       }
       
       // Reset do formulário
       const formulario = document.getElementById('formularioOrcamento') as HTMLFormElement;
       if (formulario) {
         formulario.reset();
       }
    };
    
    if (formularioOrcamento) {
      formularioOrcamento.addEventListener('submit', handleFormSubmit);
      
      // Cleanup
      return () => {
        formularioOrcamento.removeEventListener('submit', handleFormSubmit);
      };
    }
  }, []);

  // Intersection Observer para fade-in sections
  useEffect(() => {
    const fadeInObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const fadeInElements = document.querySelectorAll('.fade-in-section');
    fadeInElements.forEach((element) => {
      fadeInObserver.observe(element);
    });

    return () => {
      fadeInElements.forEach((element) => {
        fadeInObserver.unobserve(element);
      });
    };
  }, []);

  const scooters = [
    {
      id: 1,
      name: "Patinete Eletrico WX-01",
      image: "/patinete-wx01.png",
      price: "R$ 1.299",
      features: ["Autonomia 25km", "Velocidade 25km/h", "Peso 12kg"]
    },
    {
      id: 2,
      name: "Bike Eletrica WX-03",
      image: "/bike-wx03.png",
      price: "R$ 2.499",
      features: ["Autonomia 50km", "Velocidade 35km/h", "Bateria removivel"]
    },
    {
      id: 3,
      name: "Scooter WX-05",
      image: "/scooter-wx05.png",
      price: "R$ 3.299",
      features: ["Autonomia 60km", "Velocidade 45km/h", "Duplo assento"]
    },
    {
      id: 4,
      name: "Scooter WX-10",
      image: "/scooter-wx10.png",
      price: "R$ 4.999",
      features: ["Autonomia 80km", "Velocidade 60km/h", "Sistema GPS"]
    }
  ];

  const testimonials = [
    {
      name: "Carlos M.",
      location: "",
      text: "Estou muito satisfeito com o serviço prestado! A equipe foi extremamente profissional, a instalação foi rápida e já estou vendo uma grande economia na minha conta de luz. Recomendo a todos!",
      rating: 5,
      savings: "Economiza 65% na conta"
    },
    {
      name: "Mariana Rodrigues",
      location: "",
      text: "Desde o primeiro contato, fui muito bem atendida. O sistema funciona perfeitamente, e agora posso gerar minha própria energia. Excelente investimento!",
      rating: 5,
      savings: "100% Energia Limpa"
    },
    {
      name: "João Pedro",
      location: "",
      text: "O suporte foi incrível, tiraram todas as minhas dúvidas e entregaram exatamente o que prometeram. Não tenho mais que me preocupar com energia, a economia é garantida!",
      rating: 5,
      savings: "Retorno em 5 anos"
    }
  ];

  const calculateSimulation = async () => {
    // Validação simplificada - apenas conta de luz é obrigatória
    if (!monthlyBill || parseFloat(monthlyBill) <= 0) {
      alert('Por favor, informe o valor da sua conta de luz para calcular a economia!');
      return;
    }
    
    const monthly = parseFloat(monthlyBill);
    
    // Parâmetros baseados no mercado solar brasileiro 2024
    const averageTariff = 0.75; // R$/kWh média nacional
    const consumption = monthlyConsumption ? parseFloat(monthlyConsumption) : monthly / averageTariff;
    
    // Fatores regionais de irradiação solar (kWh/kWp/dia)
    const regionFactors: { [key: string]: number } = {
      'norte': 4.8,
      'nordeste': 5.2,
      'centro-oeste': 5.0,
      'sudeste': 4.6,
      'sul': 4.2
    };
    
    // Detectar região pela localização ou usar média nacional
    let regionFactor = 4.7; // Média nacional
    if (location) {
      const loc = location.toLowerCase();
      if (loc.includes('sp') || loc.includes('são paulo') || loc.includes('rj') || loc.includes('rio') || loc.includes('mg') || loc.includes('minas') || loc.includes('es')) {
        regionFactor = regionFactors.sudeste;
      } else if (loc.includes('ba') || loc.includes('bahia') || loc.includes('ce') || loc.includes('pe') || loc.includes('pb') || loc.includes('rn') || loc.includes('al') || loc.includes('se') || loc.includes('ma') || loc.includes('pi')) {
        regionFactor = regionFactors.nordeste;
      } else if (loc.includes('rs') || loc.includes('sc') || loc.includes('pr')) {
        regionFactor = regionFactors.sul;
      } else if (loc.includes('mt') || loc.includes('ms') || loc.includes('go') || loc.includes('df')) {
        regionFactor = regionFactors['centro-oeste'];
      } else if (loc.includes('am') || loc.includes('pa') || loc.includes('ac') || loc.includes('ro') || loc.includes('rr') || loc.includes('ap') || loc.includes('to')) {
        regionFactor = regionFactors.norte;
      }
    }
    
    // Cálculos baseados em dados reais do mercado
    const monthlyGeneration = regionFactor * 30; // kWh/kWp/mês
    const systemEfficiency = 0.85; // 85% de eficiência do sistema (perdas)
    const systemSizeKwp = consumption / (monthlyGeneration * systemEfficiency);
    
    // Equipamentos baseados no mercado atual
    const panelPower = 0.55; // 550W por painel (padrão atual)
    const estimatedPanels = Math.ceil(systemSizeKwp / panelPower);
    const actualSystemSize = estimatedPanels * panelPower;
    
    // Geração mensal real considerando eficiência
    const monthlyProduction = actualSystemSize * monthlyGeneration * systemEfficiency;
    
    // Economia considerando taxa mínima da distribuidora
    const minimumFee = installationType === 'comercial' ? 100 : 30; // Taxa mínima
    const maxSavings = Math.max(0, monthly - minimumFee);
    const monthlySavings = Math.min(maxSavings, monthlyProduction * averageTariff);
    const savingsPercentage = Math.round((monthlySavings / monthly) * 100);
    
    // Custos baseados no mercado atual (R$/kWp instalado)
    const costPerKwp = installationType === 'residencial' ? 4800 : 
                     installationType === 'comercial' ? 4200 : 
                     installationType === 'rural' ? 4500 : 4600;
    
    const systemCost = actualSystemSize * costPerKwp;
    const annualSavings = monthlySavings * 12;
    const paybackYears = systemCost / annualSavings;
    
    // Impacto ambiental (fator de emissão do SIN: 0.0817 tCO2/MWh)
    const co2Reduction = (monthlyProduction * 12 * 0.0817); // tCO2/ano
    
    // Benefícios adicionais
    const savingsIn25Years = annualSavings * 25; // Vida útil dos painéis
    const roi = ((savingsIn25Years - systemCost) / systemCost) * 100; // ROI em 25 anos
    
    const results = {
      panels: estimatedPanels,
      systemSize: actualSystemSize,
      monthlyProduction: monthlyProduction,
      monthlySavings: monthlySavings,
      annualSavings: annualSavings,
      savingsPercentage: savingsPercentage,
      payback: paybackYears,
      paybackPeriod: paybackYears,
      co2Reduction: co2Reduction,
      systemCost: systemCost,
      roi: roi,
      savingsIn25Years: savingsIn25Years,
      regionFactor: regionFactor
    };
    
    setSimulationResults(results);
    
    // Salvar lead no Supabase
    await saveLeadToSupabase({
      name: fullName,
      email: '', // Email não é obrigatório no simulador
      phone: phone,
      interest: `Simulação de ${installationType} - Conta: R$ ${monthlyBill}`,
      message: `Simulação realizada: ${estimatedPanels} painéis, economia de R$ ${monthlySavings.toFixed(2)}/mês`
    });
    
    // Salvar simulação no Supabase
    await saveSimulationToSupabase({
      monthlyEconomy: results.monthlySavings,
      totalEconomy: results.savingsIn25Years,
      systemPower: results.systemSize,
      panelCount: results.panels,
      roofArea: 50, // valor padrão
      co2Reduction: results.co2Reduction
    });
    
    // Scroll suave para os resultados
    setTimeout(() => {
      const resultsElement = document.querySelector('.animate-fade-in');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  };

  // Funções para o formulário de leads
  const handleLeadFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLeadForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para salvar lead no Supabase
  const saveLeadToSupabase = async (leadData: {
    name: string;
    email: string;
    phone: string;
    interest: string;
    message: string;
  }) => {
    console.log('🚀 Iniciando salvamento de lead no Supabase:', leadData);
    
    try {
      if (typeof window !== 'undefined' && (window as WindowWithSupabase).supabaseClient) {
        console.log('✅ Cliente Supabase encontrado, enviando dados...');
        
        const dataToInsert = {
          full_name: leadData.name,
          email: leadData.email || 'nao-informado@email.com',
          phone: leadData.phone,
          monthly_bill: parseFloat(monthlyBill || '0'),
          location: location || 'Não informado',
          installation_type: installationType || 'residencial',
          interest: leadData.interest,
          message: leadData.message,
          monthly_consumption: monthlyConsumption || '',
          residents: residents || '',
          roof_area: roofArea || '',
          source: 'website_form',
          created_at: new Date().toISOString()
        };
        
        console.log('📤 Dados a serem inseridos:', dataToInsert);
        
        const { data, error } = await (window as WindowWithSupabase).supabaseClient!
          .from('leads')
          .insert([dataToInsert]);
        
        console.log('📥 Resposta do Supabase:');
        console.log('- data:', data);
        console.log('- error:', error);
        
        if (error) {
          console.error('❌ Erro ao salvar lead no Supabase:', error);
          alert(`Erro ao salvar lead: ${error.message}`);
        } else {
          console.log('✅ Lead salvo no Supabase com sucesso:', data);
          alert('Lead salvo com sucesso!');
        }
      } else {
        console.error('❌ Cliente Supabase não encontrado!');
        alert('Erro: Cliente Supabase não está conectado. Verifique o console para mais detalhes.');
      }
    } catch (error) {
      console.error('❌ Erro na conexão com Supabase:', error);
      alert(`Erro na conexão: ${error}`);
    }
  };

  // Função para salvar simulação no Supabase
  const saveSimulationToSupabase = async (simulationData: {
    monthlyEconomy: number;
    totalEconomy: number;
    systemPower: number;
    panelCount: number;
    roofArea: number;
    co2Reduction: number;
  }) => {
    console.log('🚀 Iniciando salvamento de simulação no Supabase:');
    console.log('- simulationData:', simulationData);
    
    try {
      if (typeof window !== 'undefined' && (window as WindowWithSupabase).supabaseClient) {
        console.log('✅ Cliente Supabase encontrado, enviando dados...');
        
        const dataToInsert = {
          monthly_bill: parseFloat(monthlyBill || '0'),
          location: location || 'Não informado',
          installation_type: installationType || 'residencial',
          full_name: fullName || 'Não informado',
          phone: phone || 'Não informado',
          panels: simulationData.panelCount,
          system_size: simulationData.systemPower,
          monthly_production: simulationData.monthlyEconomy,
          monthly_savings: simulationData.monthlyEconomy,
          annual_savings: simulationData.monthlyEconomy * 12,
          system_cost: simulationData.systemPower * 4800,
          payback_years: (simulationData.systemPower * 4800) / (simulationData.monthlyEconomy * 12),
          roi: ((simulationData.totalEconomy - (simulationData.systemPower * 4800)) / (simulationData.systemPower * 4800)) * 100,
          co2_reduction: simulationData.co2Reduction,
          savings_in_25_years: simulationData.totalEconomy,
          region_factor: 4.7,
          source: 'website_simulator',
          created_at: new Date().toISOString()
        };
        
        console.log('📤 Dados a serem inseridos:', dataToInsert);
        
        const { data, error } = await (window as WindowWithSupabase).supabaseClient!
          .from('simulations')
          .insert([dataToInsert]);
        
        console.log('📥 Resposta do Supabase:');
        console.log('- data:', data);
        console.log('- error:', error);
        
        if (error) {
          console.error('❌ Erro ao salvar simulação no Supabase:', error);
          alert(`Erro ao salvar simulação: ${error.message}`);
        } else {
          console.log('✅ Simulação salva no Supabase com sucesso:', data);
          alert('Simulação salva com sucesso!');
        }
      } else {
        console.error('❌ Cliente Supabase não encontrado!');
        alert('Erro: Cliente Supabase não está conectado. Verifique o console para mais detalhes.');
      }
    } catch (error) {
      console.error('❌ Erro na conexão com Supabase:', error);
      alert(`Erro na conexão: ${error}`);
    }
  };

  const handleWhatsAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Salvar lead no Supabase
    await saveLeadToSupabase(leadForm);
    
    const message = `🌟 *Nova Solicitação de Orçamento - Energia Solar*\n\n` +
      `👤 *Nome:* ${leadForm.name}\n` +
      `📧 *Email:* ${leadForm.email}\n` +
      `📱 *WhatsApp:* ${leadForm.phone}\n` +
      `🎯 *Interesse:* ${leadForm.interest || 'Não especificado'}\n` +
      `💬 *Mensagem:* ${leadForm.message || 'Nenhuma mensagem adicional'}\n\n` +
      `🚀 *Enviado pelo site Nova Era Solar*`;
    
    const whatsappUrl = `https://wa.me/5514998205972?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    setLeadForm({ name: '', email: '', phone: '', interest: '', message: '', consumption: '' });
    setIsSubmitting(false);
    
    alert('Redirecionando para WhatsApp! Sua mensagem foi preparada automaticamente.');
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Salvar lead no Supabase
    await saveLeadToSupabase(leadForm);
    
    const subject = `Solicitação de Orçamento - ${leadForm.name}`;
    const body = `Olá Nova Era Solar!\n\n` +
      `Gostaria de receber um orçamento personalizado para energia solar.\n\n` +
      `Meus dados:\n` +
      `Nome: ${leadForm.name}\n` +
      `Email: ${leadForm.email}\n` +
      `WhatsApp: ${leadForm.phone}\n` +
      `Interesse Principal: ${leadForm.interest || 'Não especificado'}\n\n` +
      `Mensagem adicional:\n${leadForm.message || 'Nenhuma mensagem adicional'}\n\n` +
      `Aguardo retorno!\n\n` +
      `Enviado pelo site Nova Era Solar`;
    
    const mailtoUrl = `mailto:novaera.solar.projetos@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    
    // Reset form
    setLeadForm({ name: '', email: '', phone: '', interest: '', message: '', consumption: '' });
    setIsSubmitting(false);
    
    alert('Seu cliente de email será aberto com a mensagem preparada!');
  };





  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-blue-900 shadow-xl sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex justify-center items-center py-4">
            <div className="flex items-center mr-8">
              <Image
                src="/logo principal.png"
                alt="Nova Era"
                width={200}
                height={80}
                className="h-16 w-auto bg-transparent object-contain"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                priority
              />
            </div>
            <nav className="hidden lg:flex space-x-8">
              <a href="#home" className="text-yellow-300 hover:text-yellow-400 font-bold text-sm transition-colors uppercase tracking-wide">HOME</a>
              <a href="#about" className="text-yellow-300 hover:text-yellow-400 font-bold text-sm transition-colors uppercase tracking-wide">QUEM SOMOS</a>
              <a href="#services" className="text-yellow-300 hover:text-yellow-400 font-bold text-sm transition-colors uppercase tracking-wide">O QUE FAZEMOS</a>
              <a href="#energy" className="text-yellow-300 hover:text-yellow-400 font-bold text-sm transition-colors uppercase tracking-wide">ENERGIA FOTOVOLTAICA</a>
              <a href="#mobility" className="text-yellow-300 hover:text-yellow-400 font-bold text-sm transition-colors uppercase tracking-wide">MOBILIDADE ELÉTRICA</a>
              <a href="#projects" className="text-yellow-300 hover:text-yellow-400 font-bold text-sm transition-colors uppercase tracking-wide">PROJETOS</a>
              <a href="#educational" className="text-yellow-300 hover:text-yellow-400 font-bold text-sm transition-colors uppercase tracking-wide">EDUCACIONAL</a>
              <a href="#contact" className="text-yellow-300 hover:text-yellow-400 font-bold text-sm transition-colors uppercase tracking-wide">CONTATO</a>
            </nav>
          </div>
        </div>
      </header>



      {/* Hero Section */}
      <section id="home" className="pt-8 pb-16 container-padding relative overflow-hidden" style={{
        backgroundImage: 'url(/fundo-inicio.avif)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="animate-fadeInUp flex flex-col justify-between h-full">
              {/* Carrossel */}
              <div className="mb-8 animate-fadeInUp">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden max-w-md mx-auto">
                  <Carousel 
                    images={[
                      "/carrosel 1.png",
                      "/carrossel 2.png", 
                      "/carrosel 3.png"
                    ]}
                    autoPlay={true}
                    autoPlayInterval={5000}
                    className="w-full"
                  />
                </div>
              </div>
              
              {/* Texto movido para baixo do carrossel */}
              <div className="text-center">
                <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 mx-auto max-w-2xl">
                  <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4 leading-tight text-white animate-fadeInUp">
                    Energia Solar – 
                    <span className="text-yellow-400 animate-fadeInUp animate-delay-200">Reduza até 70% da sua conta de luz</span>
                  </h1>
                  <p className="text-lg mb-2 text-gray-100 font-light leading-relaxed animate-fadeInUp animate-delay-300">
                    Gere sua própria energia limpa e sustentável. Economia garantida desde o primeiro mês com tecnologia de ponta.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative max-w-md mx-auto animate-zoomIn animate-delay-700">
              <div className="bg-gradient-to-br from-blue-800/95 to-blue-900/95 backdrop-blur-sm rounded-xl p-6 border border-blue-600/50 shadow-2xl hover-lift">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-heading font-bold text-white mb-1">Simulador Solar</h3>
                  <p className="text-sm text-blue-200">Descubra sua economia em 30 segundos</p>
                  
                  {/* Indicador de Progresso */}
                  <div className="flex items-center justify-center mt-3 space-x-2">
                    <div className="flex space-x-1">
                      <div className={`w-2 h-2 rounded-full ${monthlyBill ? 'bg-green-400' : 'bg-blue-500'}`}></div>
                <div className={`w-2 h-2 rounded-full ${location && installationType ? 'bg-green-400' : 'bg-blue-500'}`}></div>
                <div className={`w-2 h-2 rounded-full ${fullName && phone ? 'bg-green-400' : 'bg-blue-500'}`}></div>
                    </div>
                    <span className="text-xs text-blue-300">Passo {monthlyBill ? (location && installationType ? (fullName && phone ? '3' : '2') : '2') : '1'} de 3</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Campos Principais */}
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="bill" className="text-sm text-blue-100 font-medium">Conta de luz (R$)</Label>
                      <Input
                        id="bill"
                        type="number"
                        placeholder="350"
                        value={monthlyBill}
                        onChange={(e) => setMonthlyBill(e.target.value)}
                        className="bg-blue-700/50 border-blue-500 text-white placeholder-blue-300 h-9 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location" className="text-sm text-blue-100 font-medium">Localização</Label>
                      <Input
                        id="location"
                        type="text"
                        placeholder="São Paulo/SP"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="bg-blue-700/50 border-blue-500 text-white placeholder-blue-300 h-9 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="installation-type" className="text-sm text-blue-100 font-medium">Tipo</Label>
                      <select
                        id="installation-type"
                        value={installationType}
                        onChange={(e) => setInstallationType(e.target.value)}
                        className="w-full bg-blue-700/50 border border-blue-500 text-white rounded-md px-3 py-2 h-9 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      >
                        <option value="" className="text-gray-900">Selecione</option>
                        <option value="residencial" className="text-gray-900">Residencial</option>
                        <option value="comercial" className="text-gray-900">Comercial</option>
                        <option value="rural" className="text-gray-900">Rural</option>
                      </select>
                    </div>
                  </div>

                  {/* Campos de Contato Simplificados */}
                  <div className="space-y-3 pt-2 border-t border-blue-600/50">
                    <div>
                      <Label htmlFor="fullName" className="text-sm text-blue-100 font-medium">Nome completo *</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Como podemos te chamar?"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="bg-blue-700/50 border-blue-500 text-white placeholder-blue-300 h-10 text-sm focus:border-yellow-400 transition-colors"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm text-blue-100 font-medium">WhatsApp *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(14) 99999-9999"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="bg-blue-700/50 border-blue-500 text-white placeholder-blue-300 h-10 text-sm focus:border-yellow-400 transition-colors"
                      />
                    </div>
                  </div>

                  <Button onClick={calculateSimulation} className="w-full gradient-solar hover-lift text-white font-semibold py-3 text-sm shadow-lg transition-all duration-300">
                    🚀 Quero Minha Economia Agora
                  </Button>

                  {/* Resultados Visuais */}
                  {simulationResults && (
                    <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded-xl p-5 border border-green-400/30 mt-4 animate-fade-in">
                      <h4 className="font-heading font-bold text-green-300 mb-4 text-center text-base">🎉 Sua Economia Calculada!</h4>
                      
                      {/* Cards Principais */}
                      <div className="space-y-3 mb-4">
                        {/* Economia em R$ */}
                        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg p-3 border border-green-400/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs text-green-200 font-medium">💰 Economia Mensal</div>
                              <div className="text-2xl font-heading font-bold text-green-300">R$ {simulationResults.monthlySavings.toFixed(2)}</div>
                            </div>
                            <div className="text-right">
                               <div className="text-xs text-green-200">Por ano</div>
                               <div className="text-lg font-bold text-green-300">R$ {simulationResults.annualSavings.toFixed(0)}</div>
                             </div>
                          </div>
                        </div>
                        
                        {/* Sistema e Investimento */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg p-3 border border-blue-400/30">
                            <div className="text-xs text-blue-200 font-medium text-center">⚡ Sistema</div>
                            <div className="text-lg font-heading font-bold text-blue-300 text-center">{simulationResults.systemSize.toFixed(1)} kWp</div>
                            <div className="text-xs text-blue-200 text-center">{simulationResults.panels} painéis</div>
                          </div>
                          <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-lg p-3 border border-orange-400/30">
                            <div className="text-xs text-orange-200 font-medium text-center">💸 Investimento</div>
                            <div className="text-lg font-heading font-bold text-orange-300 text-center">R$ {(simulationResults.systemCost / 1000).toFixed(0)}k</div>
                            <div className="text-xs text-orange-200 text-center">Payback {simulationResults.payback.toFixed(1)}a</div>
                          </div>
                        </div>
                        
                        {/* Performance e ROI */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center bg-blue-700/30 rounded p-2">
                            <div className="text-sm font-bold text-white">{simulationResults.savingsPercentage}%</div>
                            <div className="text-xs text-blue-200">Economia</div>
                          </div>
                          <div className="text-center bg-blue-700/30 rounded p-2">
                            <div className="text-sm font-bold text-white">{simulationResults.monthlyProduction.toFixed(0)}</div>
                            <div className="text-xs text-blue-200">kWh/mês</div>
                          </div>
                          <div className="text-center bg-blue-700/30 rounded p-2">
                            <div className="text-sm font-bold text-white">{simulationResults.roi.toFixed(0)}%</div>
                            <div className="text-xs text-blue-200">ROI 25a</div>
                          </div>
                        </div>
                        
                        {/* Impacto Ambiental */}
                        <div className="bg-gradient-to-r from-green-600/20 to-teal-600/20 rounded-lg p-3 border border-green-400/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs text-green-200 font-medium">🌱 Impacto Ambiental</div>
                              <div className="text-lg font-heading font-bold text-green-300">{simulationResults.co2Reduction.toFixed(1)} t CO₂/ano</div>
                            </div>
                            <div className="text-right">
                               <div className="text-xs text-green-200">Equivale a</div>
                               <div className="text-sm font-bold text-green-300">{Math.round(simulationResults.co2Reduction * 1000 / 22)} árvores</div>
                             </div>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={async () => {
                          // Salvar simulação no Supabase
                          await saveSimulationToSupabase({
                            monthlyEconomy: simulationResults.monthlySavings,
                            totalEconomy: simulationResults.savingsIn25Years,
                            systemPower: simulationResults.systemSize,
                            panelCount: simulationResults.panels,
                            roofArea: 50,
                            co2Reduction: simulationResults.co2Reduction
                          });
                          
                          const message = `Olá! Vi a simulação no site e gostaria de mais informações sobre o sistema solar de ${simulationResults.systemSize.toFixed(1)} kWp (${simulationResults.panels} painéis) que geraria ${simulationResults.monthlyProduction.toFixed(0)} kWh/mês com economia de R$ ${simulationResults.monthlySavings.toFixed(2)}/mês e payback de ${simulationResults.payback.toFixed(1)} anos. Investimento: R$ ${(simulationResults.systemCost / 1000).toFixed(0)}k. Pode me ajudar?`;
                          const whatsappURL = `https://wa.me/330783837981?text=${encodeURIComponent(message)}`;
                          window.open(whatsappURL, '_blank');
                        }}
                        className="w-full gradient-solar hover-lift text-white font-semibold py-3 text-sm shadow-lg"
                      >
                        💬 Quero Fechar Negócio Agora
                      </Button>
                      
                      <div className="mt-3 text-center">
                        <div className="text-xs text-blue-200">💡 Simulação baseada em dados reais do mercado solar 2024</div>
                        <div className="text-xs text-blue-300">Irradiação regional: {simulationResults.regionFactor.toFixed(1)} kWh/kWp/dia</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative w-full h-32 md:h-48 lg:h-64 rounded-2xl overflow-hidden shadow-lg hover-lift">
            <Image
              src="/banner 2.png"
              alt="Banner Nova Era Energia Solar"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="energy" className="section-padding container-padding bg-blue-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-in-section">
            <div className="mb-6">
              <span className="text-yellow-300 font-bold text-lg md:text-xl tracking-widest uppercase animate-fadeInUp block bg-yellow-300/10 rounded-full px-6 py-3 border border-yellow-300/30 backdrop-blur-sm mx-auto w-fit shadow-lg">ENERGIA FOTOVOLTAICA</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4 animate-fadeInUp">
              <span className="gradient-solar bg-clip-text text-transparent">Como Funciona?</span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto font-light animate-fadeInUp animate-delay-200">
              Descubra o processo revolucionário que transforma energia solar em economia real para você.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-lg hover-lift border border-orange-100 animate-zoomInUp overflow-hidden">
              <div className="relative w-full h-48 mb-4">
                <Image
                  src="/capitacao.webp"
                  alt="Captação Solar - Painéis Fotovoltaicos"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-heading font-bold mb-3 text-center text-gray-800">Captação Solar</h3>
                <p className="text-gray-600 text-sm leading-relaxed text-center">
                  Painéis de alta eficiência capturam a radiação solar ideal para gerar sua própria energia e <strong>reduzir até 70% da conta de luz</strong>. Equipamentos certificados com condições especiais de instalação.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg hover-lift border border-blue-100 animate-zoomInUp animate-delay-200 overflow-hidden">
              <div className="relative w-full h-48 mb-4">
                <Image
                  src="/comversao.jpg"
                  alt="Conversão Inteligente - Micro Inversores"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-heading font-bold mb-3 text-center text-gray-800">Conversão Inteligente</h3>
                <p className="text-gray-600 text-sm leading-relaxed text-center">
                  Micro inversores de última geração convertem energia solar em eletricidade. <strong>Equipamentos certificados INMETRO</strong> com total segurança e eficiência.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg hover-lift border border-purple-100 animate-zoomInUp animate-delay-300 overflow-hidden">
              <div className="relative w-full h-48 mb-4">
                <Image
                  src="/minitoramento.jpg"
                  alt="Monitoramento Total - Aplicativo de Controle"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-heading font-bold mb-3 text-center text-gray-800">Monitoramento Total</h3>
                <p className="text-gray-600 text-sm leading-relaxed text-center">
                  Acompanhe sua geração de energia em <strong>tempo real via app</strong>. Fazemos toda a burocracia com a concessionária para você focar apenas na economia.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg hover-lift border border-green-100 animate-zoomInUp animate-delay-500 overflow-hidden">
              <div className="relative w-full h-48 mb-4">
                <Image
                  src="/economia.avif"
                  alt="Economia Imediata - Redução na Conta de Luz"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-heading font-bold mb-3 text-center text-gray-800">Economia Imediata</h3>
                <p className="text-gray-600 text-sm leading-relaxed text-center">
                  <strong>Economize desde a primeira conta</strong> após a instalação. Retorno do investimento em 5-6 anos e proteção contra aumentos tarifários por 25 anos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Por que Escolher Energia Solar */}
      <section id="services" className="section-padding container-padding bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-in-section">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4 animate-fadeInUp">
              Por que Escolher Energia Solar?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light animate-fadeInUp animate-delay-200">
              Descubra todos os benefícios de investir em energia solar para sua casa ou empresa.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg hover-lift border border-green-100 animate-zoomInUp overflow-hidden">
              <div className="relative w-full h-48 mb-4">
                <Image
                  src="/economia.jpg"
                  alt="Economia com energia solar"
                  fill
                  className="object-cover rounded-t-2xl"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-heading font-bold mb-3 text-center text-gray-800">Economia Garantida</h3>
                <p className="text-gray-600 text-sm leading-relaxed text-center mb-4">
                  Reduza sua conta de luz em até <strong>70% e tenha retorno do investimento</strong> em poucos anos.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Economia imediata na conta de luz</li>
                  <li>• Proteção contra aumentos de tarifa</li>
                  <li>• Retorno do investimento garantido</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg hover-lift border border-blue-100 animate-zoomInUp animate-delay-200 overflow-hidden">
              <div className="relative w-full h-48 mb-4">
                <Image
                  src="/garantia.jpg"
                  alt="Garantia e qualidade em energia solar"
                  fill
                  className="object-cover rounded-t-2xl"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-heading font-bold mb-3 text-center text-gray-800">Garantia e Qualidade</h3>
                <p className="text-gray-600 text-sm leading-relaxed text-center mb-4">
                  Equipamentos de <strong>alta qualidade com garantia estendida</strong> e suporte técnico especializado.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 25 anos de garantia dos painéis</li>
                  <li>• Certificação INMETRO</li>
                  <li>• Suporte técnico especializado</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-lg hover-lift border border-emerald-100 animate-zoomInUp animate-delay-400 overflow-hidden">
              <div className="relative w-full h-48 mb-4">
                <Image
                  src="/sustentavel.jpg"
                  alt="Sustentabilidade com energia solar"
                  fill
                  className="object-cover rounded-t-2xl"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-heading font-bold mb-3 text-center text-gray-800">Sustentabilidade</h3>
                <p className="text-gray-600 text-sm leading-relaxed text-center mb-4">
                  Contribua para um <strong>futuro mais sustentável</strong> e reduza sua pegada de carbono.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Energia 100% limpa e renovável</li>
                  <li>• Redução da pegada de carbono</li>
                  <li>• Contribuição para o meio ambiente</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Portfólio de Projetos */}
      <section id="projects" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossos Projetos Realizados
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conheça alguns dos projetos de energia solar que transformaram a vida dos nossos clientes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Projeto Wilson Bauru */}
            <div className="bg-gradient-to-br from-white via-blue-50/30 to-yellow-50/30 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-blue-100/50">
              <div className="relative">
                <div className="h-64 relative overflow-hidden">
                  <Image
                    src="/wilson-projeto.png"
                    alt="Projeto Wilson Bauru - Sistema Solar Residencial"
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>
                <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  Wilson
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center group">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <DollarSign className="w-7 h-7 text-white mx-auto" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Economia Anual</p>
                    <p className="font-bold text-blue-600 text-lg">R$ 12.636,00</p>
                  </div>
                  <div className="text-center group">
                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <Zap className="w-7 h-7 text-white mx-auto" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Potência</p>
                    <p className="font-bold text-yellow-600 text-lg">10,26 kWp</p>
                  </div>
                  <div className="text-center group">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <div className="w-7 h-7 mx-auto bg-white rounded-lg grid grid-cols-3 gap-0.5 p-1.5">
                        <div className="bg-blue-600 rounded-sm"></div>
                        <div className="bg-blue-600 rounded-sm"></div>
                        <div className="bg-blue-600 rounded-sm"></div>
                        <div className="bg-blue-600 rounded-sm"></div>
                        <div className="bg-blue-600 rounded-sm"></div>
                        <div className="bg-blue-600 rounded-sm"></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Módulos</p>
                    <p className="font-bold text-blue-600 text-lg">18 x 570W</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 via-white to-yellow-50 rounded-xl p-4 border border-blue-100/50">
                  <p className="text-sm text-gray-700 text-center leading-relaxed">
                    <strong className="text-blue-700">Projeto residencial</strong> com excelente aproveitamento solar e economia significativa na conta de energia.
                  </p>
                </div>
              </div>
            </div>

            {/* Projeto Manos Distribuidora */}
            <div className="bg-gradient-to-br from-white via-blue-50/30 to-yellow-50/30 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-blue-100/50">
              <div className="relative">
                <div className="h-64 relative overflow-hidden">
                  <Image
                    src="/manos-projeto.jpg.png"
                    alt="Projeto Manos Distribuidora - Sistema Solar Comercial"
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>
                <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  Manos Distribuidora
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center group">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <DollarSign className="w-7 h-7 text-white mx-auto" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Economia Anual</p>
                    <p className="font-bold text-blue-600 text-lg">R$ 30.000,00</p>
                  </div>
                  <div className="text-center group">
                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <Zap className="w-7 h-7 text-white mx-auto" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Potência</p>
                    <p className="font-bold text-yellow-600 text-lg">25,65 kWp</p>
                  </div>
                  <div className="text-center group">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <div className="w-7 h-7 mx-auto bg-white rounded-lg grid grid-cols-3 gap-0.5 p-1.5">
                        <div className="bg-blue-600 rounded-sm"></div>
                        <div className="bg-blue-600 rounded-sm"></div>
                        <div className="bg-blue-600 rounded-sm"></div>
                        <div className="bg-blue-600 rounded-sm"></div>
                        <div className="bg-blue-600 rounded-sm"></div>
                        <div className="bg-blue-600 rounded-sm"></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Módulos</p>
                    <p className="font-bold text-blue-600 text-lg">45 x 570W</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 via-white to-yellow-50 rounded-xl p-4 border border-blue-100/50">
                  <p className="text-sm text-gray-700 text-center leading-relaxed">
                    <strong className="text-blue-700">Projeto comercial</strong> de grande porte, proporcionando economia substancial para o negócio.
                  </p>
                </div>
              </div>
            </div>

            {/* Projeto Agropecuária Santa Clara */}
            <div className="bg-gradient-to-br from-white via-blue-50/30 to-yellow-50/30 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-blue-100/50">
              <div className="relative">
                <div className="h-64 relative overflow-hidden">
                  <Image
                    src="/agropecuaria-projeto.jpg.png"
                    alt="Projeto Agropecuária Santa Clara - Sistema Solar Rural"
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>
                <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  Agropecuária Santa Clara
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center group">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <DollarSign className="w-7 h-7 text-white mx-auto" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Economia Anual</p>
                    <p className="font-bold text-blue-600 text-lg">R$ 5.616,00</p>
                  </div>
                  <div className="text-center group">
                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <Zap className="w-7 h-7 text-white mx-auto" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Potência</p>
                    <p className="font-bold text-yellow-600 text-lg">4,56 kWp</p>
                  </div>
                  <div className="text-center group">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <div className="w-7 h-7 mx-auto bg-white rounded-lg grid grid-cols-3 gap-0.5 p-1.5">
                        <div className="bg-blue-600 rounded-sm"></div>
                        <div className="bg-blue-600 rounded-sm"></div>
                        <div className="bg-blue-600 rounded-sm"></div>
                        <div className="bg-blue-600 rounded-sm"></div>
                        <div className="bg-blue-600 rounded-sm"></div>
                        <div className="bg-blue-600 rounded-sm"></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Módulos</p>
                    <p className="font-bold text-blue-600 text-lg">8 x 570W</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 via-white to-yellow-50 rounded-xl p-4 border border-blue-100/50">
                  <p className="text-sm text-gray-700 text-center leading-relaxed">
                    <strong className="text-blue-700">Projeto rural</strong> otimizado para as necessidades específicas do agronegócio.
                  </p>
                </div>
              </div>
            </div>

            {/* Projeto Leonardo Andirá */}
            <div className="bg-gradient-to-br from-white via-blue-50/30 to-yellow-50/30 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-blue-100/50">
              <div className="relative">
                <div className="h-64 relative overflow-hidden">
                  <Image
                    src="/leonardo .png"
                    alt="Projeto Leonardo Andirá - Sistema Solar Residencial"
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>
                <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  Leonardo - Andirá PR
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center group">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <DollarSign className="w-7 h-7 text-white mx-auto" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Economia Anual</p>
                    <p className="font-bold text-blue-600 text-lg">R$ 5.616,00</p>
                  </div>
                  <div className="text-center group">
                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <Zap className="w-7 h-7 text-white mx-auto" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Potência</p>
                    <p className="font-bold text-yellow-600 text-lg">4,56 kWp</p>
                  </div>
                  <div className="text-center group">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <div className="w-7 h-7 mx-auto bg-white rounded-lg grid grid-cols-3 gap-0.5 p-1.5">
                        <div className="bg-blue-600 rounded-sm"></div>
                        <div className="bg-blue-600 rounded-sm"></div>
                        <div className="bg-blue-600 rounded-sm"></div>
                        <div className="bg-blue-600 rounded-sm"></div>
                        <div className="bg-blue-600 rounded-sm"></div>
                        <div className="bg-blue-600 rounded-sm"></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Módulos</p>
                    <p className="font-bold text-blue-600 text-lg">08 x 570W</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 via-white to-yellow-50 rounded-xl p-4 border border-blue-100/50">
                  <p className="text-sm text-gray-700 text-center leading-relaxed">
                    <strong className="text-blue-700">Projeto residencial</strong> com excelente aproveitamento solar e economia significativa.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <div ref={statsRef} className="bg-white rounded-2xl shadow-lg p-8 max-w-6xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Resultados Comprovados</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                    <Image
                      src="/economia.jpg"
                      alt="Economia"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <h4 className="text-3xl font-bold text-green-600 mb-2">
                    R$ {economyCount.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                  </h4>
                  <p className="text-gray-600">Economia total anual gerada</p>
                </div>
                <div className="text-center">
                  <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                    <Image
                      src="/potencia total.webp"
                      alt="Potência Total"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <h4 className="text-3xl font-bold text-yellow-600 mb-2">
                    {powerCount.toFixed(2)} kWp
                  </h4>
                  <p className="text-gray-600">Potência total instalada</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                    <Image
                      src="/modulos solares.jpg"
                      alt="Módulos Solares"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <h4 className="text-3xl font-bold text-blue-600 mb-2">
                    {Math.floor(modulesCount)}
                  </h4>
                  <p className="text-gray-600">Módulos solares instalados</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                    <Image
                      src="/clientes felizes.avif"
                      alt="Clientes Felizes"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <h4 className="text-3xl font-bold text-purple-600 mb-2">
                    +{Math.floor(clientsCount)}
                  </h4>
                  <p className="text-gray-600">Clientes felizes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formulário de Captura de Leads */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-yellow-400/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full -translate-y-48 translate-x-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full translate-y-48 -translate-x-48 blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              🌟 Transforme Sua Energia Hoje!
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Descubra quanto você pode economizar com energia solar. Receba uma proposta personalizada em minutos!
            </p>
          </div>
          
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
             <form id="formularioOrcamento" className="space-y-6" onSubmit={handleWhatsAppSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="leadName" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Nome Completo *
                  </Label>
                  <Input
                     id="nome"
                     name="name"
                     type="text"
                     placeholder="Seu nome completo"
                     value={leadForm.name}
                     onChange={handleLeadFormChange}
                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 placeholder-gray-500"
                     required
                   />
                </div>
                
                <div>
                  <Label htmlFor="leadEmail" className="text-sm font-semibold text-gray-700 mb-2 block">
                    E-mail *
                  </Label>
                  <Input
                     id="email"
                     name="email"
                     type="email"
                     placeholder="seu@email.com"
                     value={leadForm.email}
                     onChange={handleLeadFormChange}
                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 placeholder-gray-500"
                     required
                   />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="leadPhone" className="text-sm font-semibold text-gray-700 mb-2 block">
                    WhatsApp *
                  </Label>
                  <Input
                     id="telefone"
                     name="phone"
                     type="tel"
                     placeholder="(00) 00000-0000"
                     value={leadForm.phone}
                     onChange={handleLeadFormChange}
                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 placeholder-gray-500"
                     required
                   />
                </div>
                
                <div>
                  <Label htmlFor="leadInterest" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Interesse Principal
                  </Label>
                  <select
                     id="tipo"
                     name="interest"
                     value={leadForm.interest}
                     onChange={handleLeadFormChange}
                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 bg-white"
                   >
                    <option value="">Selecione uma opção</option>
                    <option value="residencial">Energia Solar Residencial</option>
                    <option value="comercial">Energia Solar Comercial</option>
                    <option value="rural">Energia Solar Rural</option>
                    <option value="mobilidade">Mobilidade Elétrica</option>
                    <option value="orcamento">Orçamento Personalizado</option>
                  </select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="consumo" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Consumo Mensal (kWh)
                </Label>
                <Input
                   id="consumo"
                   name="consumption"
                   type="number"
                   placeholder="Ex: 300"
                   value={leadForm.consumption || ''}
                   onChange={handleLeadFormChange}
                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 placeholder-gray-500"
                 />
              </div>
              
              <div>
                <Label htmlFor="leadMessage" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Mensagem (Opcional)
                </Label>
                <textarea
                   id="leadMessage"
                   name="message"
                   rows={4}
                   placeholder="Conte-nos mais sobre seu projeto ou dúvidas..."
                   value={leadForm.message}
                   onChange={handleLeadFormChange}
                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none"
                 ></textarea>
              </div>
              
              {/* Mensagem de Sucesso */}
              <div id="mensagemSucesso" style={{display: 'none'}} className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-4">
                ✅ Formulário enviado com sucesso! Você será redirecionado para o WhatsApp.
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                   type="submit"
                   disabled={isSubmitting || !leadForm.name || !leadForm.email || !leadForm.phone}
                   className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-lg"
                 >
                   {isSubmitting ? '⏳ Enviando...' : '💬 Enviar via WhatsApp'}
                 </Button>
                 
                 <Button 
                   type="button"
                   onClick={handleEmailSubmit}
                   disabled={isSubmitting || !leadForm.name || !leadForm.email || !leadForm.phone}
                   className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-lg"
                 >
                   {isSubmitting ? '⏳ Enviando...' : '📧 Receber por E-mail'}
                 </Button>
              </div>
              
              <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                  🔒 Seus dados estão seguros conosco. Não compartilhamos informações pessoais.
                </p>
              </div>
            </form>
            
            {/* Benefícios em destaque */}
            <div className="grid md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Resposta Rápida</h4>
                <p className="text-sm text-gray-600">Retorno em até 2 horas úteis</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Proposta Personalizada</h4>
                <p className="text-sm text-gray-600">Solução ideal para seu perfil</p>
              </div>
              
              <div className="text-center">
                <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Sem Compromisso</h4>
                <p className="text-sm text-gray-600">Orçamento 100% gratuito</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Secao Scooters */}
      <section id="mobility" className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-blue-900 mb-6">
              Mobilidade Elétrica Sustentável
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-sans">
              Complete sua transição para energia limpa com nossos veículos elétricos de última geração.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {scooters.map((scooter, index) => (
              <div key={scooter.id} className="group animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <Card className="border-0 shadow-lg hover:shadow-xl bg-white overflow-hidden h-full rounded-xl transition-all duration-300 hover:-translate-y-1">
                  {/* Imagem do Produto - Grande no topo */}
                  <div className="relative overflow-hidden bg-white">
                    <Image 
                      src={scooter.image} 
                      alt={scooter.name}
                      width={400}
                      height={224}
                      className="w-full h-56 object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  <CardContent className="p-5">
                    {/* Nome do Produto em Destaque */}
                    <h3 className="text-lg font-bold text-blue-900 mb-3 font-sans leading-tight">
                      {scooter.name}
                    </h3>
                    
                    {/* 2-3 Características Principais */}
                    <div className="space-y-2 mb-4">
                      {scooter.features.slice(0, 3).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-900 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm font-sans leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Preço */}
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-blue-900 font-sans">
                        {scooter.price}
                      </span>
                    </div>
                    
                    {/* Botão de Ação Único em Amarelo */}
                    <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg font-sans">
                      Quero este produto
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          
          {/* CTA da Seção */}
          <div className="text-center mt-16">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-blue-100 max-w-2xl mx-auto">
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">
                🚗 Financiamento Facilitado
              </h3>
              <p className="text-gray-600 mb-6">
                Parcele seu veículo elétrico em até 48x sem juros e comece a economizar hoje mesmo!
              </p>
              <Button className="gradient-primary hover:shadow-lg transition-all duration-300 px-8 py-3 font-semibold">
                💰 Simular Financiamento
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos dos Clientes */}
      <section id="testimonials" className="py-20 px-4 bg-yellow-400 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Depoimentos dos Clientes
            </h2>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto">
              Veja o que nossos clientes falam sobre a experiencia com energia solar.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-white mb-4 italic font-bold">&quot;{testimonial.text}&quot;</p>
                  <div className="border-t pt-4">
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                    <div className="mt-2 inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                       {testimonial.savings}
                     </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Educacional */}
      <section id="educational" className="py-20 px-4 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Centro Educacional
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Aprenda tudo sobre energia sustentável e como ela pode transformar seu futuro.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Artigo 1 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="p-6">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  Como Funciona a Energia Solar?
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  Descubra o processo completo de conversão da luz solar em energia elétrica e como os painéis fotovoltaicos transformam sua casa em uma usina de energia limpa.
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Ler Artigo
                </Button>
              </CardContent>
            </Card>

            {/* Artigo 2 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="p-6">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  Economia com Energia Solar
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  Entenda como calcular o retorno do investimento em energia solar e descubra por que é uma das melhores aplicações financeiras do mercado.
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Ler Artigo
                </Button>
              </CardContent>
            </Card>

            {/* Artigo 3 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="p-6">
                <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Sun className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  Manutenção de Sistemas Solares
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  Aprenda as melhores práticas para manter seu sistema solar funcionando com máxima eficiência por décadas, garantindo o melhor retorno.
                </p>
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                  Ler Artigo
                </Button>
              </CardContent>
            </Card>

            {/* Artigo 4 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="p-6">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  Incentivos e Financiamentos
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  Conheça todas as linhas de crédito, incentivos fiscais e programas governamentais disponíveis para facilitar seu investimento em energia solar.
                </p>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Ler Artigo
                </Button>
              </CardContent>
            </Card>

            {/* Artigo 5 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="p-6">
                <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  Tecnologias Emergentes
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  Fique por dentro das últimas inovações em energia solar, baterias e sistemas inteligentes que estão revolucionando o setor energético.
                </p>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                  Ler Artigo
                </Button>
              </CardContent>
            </Card>

            {/* Artigo 6 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="p-6">
                <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  Casos de Sucesso
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  Histórias reais de clientes que transformaram suas vidas com energia solar, mostrando os benefícios práticos e financeiros alcançados.
                </p>
                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                  Ler Artigo
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* CTA da Seção Educacional */}
          <div className="text-center mt-16">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-green-100 max-w-2xl mx-auto">
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">
                📚 Quer Saber Mais?
              </h3>
              <p className="text-gray-600 mb-6">
                Receba conteúdos exclusivos sobre energia sustentável diretamente no seu e-mail!
              </p>
              <Button className="gradient-solar hover:shadow-lg transition-all duration-300 px-8 py-3 font-semibold">
                📧 Assinar Newsletter
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre a Nova Era */}
      <section id="about" className="py-20 px-4 bg-blue-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Sobre a Nova Era
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Pioneiros em soluções sustentáveis e inovação energética no Brasil.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">
                Nossa História
              </h3>
              <p className="text-blue-100 mb-6 leading-relaxed">
                A <strong>Nova Era</strong> nasceu da visão de transformar o cenário energético brasileiro através de tecnologias sustentáveis e acessíveis. Fundada pelos empreendedores <strong>Alexandre</strong> e <strong>Nilton</strong>, nossa empresa se dedica a oferecer soluções completas em energia solar fotovoltaica e mobilidade elétrica.
              </p>
              <p className="text-blue-100 mb-6 leading-relaxed">
                Acreditamos que a sustentabilidade não é apenas uma tendência, mas uma necessidade urgente para o futuro do nosso planeta. Por isso, trabalhamos incansavelmente para democratizar o acesso à energia limpa e renovável.
              </p>
              <p className="text-blue-100 leading-relaxed">
                <strong>Nossa missão</strong> vai além de simplesmente fornecer equipamentos - queremos ser parceiros na sua jornada rumo à independência energética e um estilo de vida mais sustentável.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-green-50 p-8 rounded-2xl">
              <h4 className="text-xl font-bold text-gray-900 mb-6">Nossos Valores</h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                    <Sun className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Inovação</h5>
                    <p className="text-sm text-gray-600">Sempre em busca das melhores tecnologias do mercado</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                    <Leaf className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Sustentabilidade</h5>
                    <p className="text-sm text-gray-600">Compromisso com o meio ambiente e futuras gerações</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-yellow-100 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                    <Award className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Excelência</h5>
                    <p className="text-sm text-gray-600">Qualidade superior em produtos e atendimento</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                    <Shield className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Confiança</h5>
                    <p className="text-sm text-gray-600">Transparência e honestidade em todas as relações</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
                <h5 className="font-semibold text-gray-900 mb-2">Fundadores</h5>
                <p className="text-sm text-gray-600">
                  <strong>Alexandre</strong> e <strong>Nilton</strong> - Visionários comprometidos com a transformação energética do Brasil.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contact" className="py-20 px-4 bg-blue-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Entre em Contato
            </h2>
            <p className="text-xl text-blue-100">
              Fale com nossos especialistas e tire todas as suas duvidas.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Telefone</h3>
              <div className="text-blue-100">
                <p>(14) 9 9820-5972</p>
                <p>(43) 9 9617-5005</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Email</h3>
              <p className="text-blue-100">novaera.solar.projetos@gmail.com</p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Endereco</h3>
              <div className="text-blue-100">
                <p>Rua Coronel Joaquim Piza, 581</p>
                <p>Garça / SP - 17.400-084</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Comece a Economizar Hoje!
          </h2>
          <p className="text-xl mb-8">
            Nao perca mais tempo pagando caro na conta de luz.
            Faca seu orcamento gratuito e descubra quanto voce pode economizar.
          </p>
          

          
          <div className="flex justify-center items-center space-x-6 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
              <span>Instalacao Gratuita</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Completo */}
      <footer className="bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        {/* Selos de Confiança */}
        <div className="border-b border-slate-700/50">
          <div className="max-w-6xl mx-auto container-padding py-8">
            <div className="text-center mb-6">
              <h3 className="font-heading font-bold text-lg mb-2">Certificações e Garantias</h3>
              <p className="text-slate-300 text-sm">Qualidade e segurança comprovadas</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center bg-slate-800/30 rounded-lg p-4 hover-lift">
                <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="font-semibold text-sm">INMETRO</div>
                <div className="text-xs text-slate-400">Certificado</div>
              </div>
              <div className="text-center bg-slate-800/30 rounded-lg p-4 hover-lift">
                <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="font-semibold text-sm">ANEEL</div>
                <div className="text-xs text-slate-400">Homologado</div>
              </div>
              <div className="text-center bg-slate-800/30 rounded-lg p-4 hover-lift">
                <Star className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="font-semibold text-sm">25 Anos</div>
                <div className="text-xs text-slate-400">Garantia</div>
              </div>
              <div className="text-center bg-slate-800/30 rounded-lg p-4 hover-lift">
                <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="font-semibold text-sm">+100</div>
                <div className="text-xs text-slate-400">Projetos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Links e Informações */}
        <div className="max-w-6xl mx-auto container-padding py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo e Descrição */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <Sun className="h-8 w-8 text-yellow-300" />
                <span className="text-xl font-heading font-bold">Nova Era</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Transformando energia solar em economia real para residências e empresas em Garça e região.
              </p>
              <div className="flex space-x-3">
                <div className="bg-blue-600 hover:bg-blue-700 rounded-full p-2 cursor-pointer transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="bg-green-600 hover:bg-green-700 rounded-full p-2 cursor-pointer transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Links Rápidos */}
            <div>
              <h4 className="font-heading font-bold mb-4">Links Rápidos</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#home" className="text-slate-300 hover:text-yellow-300 transition-colors">Início</a></li>
                <li><a href="#about" className="text-slate-300 hover:text-yellow-300 transition-colors">Quem Somos</a></li>
                <li><a href="#services" className="text-slate-300 hover:text-yellow-300 transition-colors">Serviços</a></li>
                <li><a href="#projects" className="text-slate-300 hover:text-yellow-300 transition-colors">Projetos</a></li>
                <li><a href="#contact" className="text-slate-300 hover:text-yellow-300 transition-colors">Contato</a></li>
              </ul>
            </div>

            {/* Serviços */}
            <div>
              <h4 className="font-heading font-bold mb-4">Serviços</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="text-slate-300">Energia Solar Residencial</span></li>
                <li><span className="text-slate-300">Energia Solar Comercial</span></li>
                <li><span className="text-slate-300">Energia Solar Rural</span></li>
                <li><span className="text-slate-300">Mobilidade Elétrica</span></li>
                <li><span className="text-slate-300">Manutenção e Suporte</span></li>
              </ul>
            </div>

            {/* Contato */}
            <div>
              <h4 className="font-heading font-bold mb-4">Contato</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-yellow-300 mt-0.5 flex-shrink-0" />
                  <div className="text-slate-300">
                    <div>Rua Coronel Joaquim Piza, 581</div>
                    <div>Garça / SP - 17.400-084</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-blue-300" />
                  <div className="text-slate-300">
                    <div>(14) 9 9820-5972</div>
                    <div>(43) 9 9617-5005</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-green-300" />
                  <span className="text-slate-300">novaera.solar.projetos@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-700/50">
          <div className="max-w-6xl mx-auto container-padding py-6">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
              <div>
                © 2024 Nova Era Energia Solar. Todos os direitos reservados.
              </div>
              <div className="flex space-x-4 mt-2 md:mt-0">
                <a href="#" className="hover:text-yellow-300 transition-colors">Política de Privacidade</a>
                <a href="#" className="hover:text-yellow-300 transition-colors">Termos de Uso</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
