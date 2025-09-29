"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Bot, User } from "lucide-react";
import Image from 'next/image';
import OpenAI from 'openai';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou a Aurora, assistente virtual da Nova Era. Como posso ajudá-lo hoje? Posso responder sobre energia solar, nossos serviços e fazer orçamentos!',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Configuração do OpenAI
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
    dangerouslyAllowBrowser: true
  });

  const getBotResponse = async (userMessage: string): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    
    // Se não há chave da API ou é a chave padrão, usar sistema de fallback
    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      return getFallbackResponse(userMessage);
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Você é a Aurora, assistente virtual especializada da Nova Era Energia Solar. Suas informações:
            
            EMPRESA: Nova Era Energia Solar
            LOCALIZAÇÃO: Rua Coronel Joaquim Piza, 581 - Garça/SP - CEP: 17.400-084
            TELEFONES: (14) 9 9820-5972 e (43) 9 9617-5005
            EMAIL: novaera.solar.projetos@gmail.com
            
            SERVIÇOS:
            - Instalação de sistemas de energia solar fotovoltaica
            - Economia de até 95% na conta de luz
            - Garantia de 25 anos nos painéis solares
            - Garantia de 10 anos nos inversores
            - Certificação INMETRO
            - Instalação gratuita (1 a 3 dias)
            - Orçamentos gratuitos
            - Retorno do investimento entre 4 a 6 anos
            - Suporte técnico especializado
            
            INSTRUÇÕES:
            - Seja sempre educado e prestativo
            - Foque apenas em energia solar e serviços da Nova Era
            - Incentive orçamentos e simulações gratuitas
            - Use linguagem brasileira e informal
            - Seja objetivo nas respostas
            - Se perguntarem sobre outros assuntos, redirecione para energia solar
            `
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      });

      return completion.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem. Pode tentar novamente?';
    } catch (error) {
      console.error('Erro ao chamar OpenAI:', error);
      // Em caso de erro na API, usar fallback
      return getFallbackResponse(userMessage);
    }
  };

  // Sistema de fallback inteligente
  const getFallbackResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Saudações
    if (message.includes('oi') || message.includes('olá') || message.includes('bom dia') || 
        message.includes('boa tarde') || message.includes('boa noite') || message.includes('hello')) {
      return 'Olá! 👋 Sou a Aurora, assistente virtual da Nova Era Energia Solar! Como posso ajudá-lo hoje? Posso falar sobre nossos sistemas solares, preços, instalação e muito mais!';
    }
    
    // Preços e orçamentos
    if (message.includes('preço') || message.includes('valor') || message.includes('custo') || 
        message.includes('orçamento') || message.includes('quanto custa')) {
      return 'Os preços dos nossos sistemas solares variam conforme o tamanho e necessidades da sua propriedade! 💰\n\n✅ Orçamento 100% GRATUITO\n✅ Economia de até 95% na conta de luz\n✅ Retorno do investimento em 4-6 anos\n\nEntre em contato para um orçamento personalizado:\n📞 (14) 9 9820-5972\n📞 (43) 9 9617-5005';
    }
    
    // Instalação
    if (message.includes('instalação') || message.includes('instalar') || message.includes('como funciona') ||
        message.includes('processo')) {
      return 'Nossa instalação é rápida e profissional! ⚡\n\n🔧 Instalação gratuita\n⏱️ Processo de 1 a 3 dias\n🏆 Equipe certificada\n📋 Certificação INMETRO\n\nTodo o processo é acompanhado por nossos técnicos especializados. Entre em contato para agendar uma visita técnica!';
    }
    
    // Garantia
    if (message.includes('garantia') || message.includes('warranty')) {
      return 'Oferecemos as melhores garantias do mercado! 🛡️\n\n✅ 25 anos de garantia nos painéis solares\n✅ 10 anos de garantia nos inversores\n✅ Certificação INMETRO\n✅ Suporte técnico especializado\n\nSua tranquilidade é nossa prioridade!';
    }
    
    // Economia
    if (message.includes('economia') || message.includes('economizar') || message.includes('conta de luz') ||
        message.includes('energia elétrica')) {
      return 'Com energia solar você pode economizar até 95% na sua conta de luz! 💡\n\n💰 Retorno do investimento: 4-6 anos\n📉 Redução drástica na conta de energia\n🌱 Energia limpa e sustentável\n📈 Valorização do seu imóvel\n\nQuer saber quanto você pode economizar? Entre em contato!';
    }
    
    // Contato
    if (message.includes('contato') || message.includes('telefone') || message.includes('whatsapp') ||
        message.includes('falar') || message.includes('ligar')) {
      return 'Entre em contato conosco! 📞\n\n🏢 Nova Era Energia Solar\n📍 Rua Coronel Joaquim Piza, 581 - Garça/SP\n📮 CEP: 17.400-084\n\n📞 Telefones:\n• (14) 9 9820-5972\n• (43) 9 9617-5005\n\n📧 Email: novaera.solar.projetos@gmail.com\n\nEstamos prontos para atendê-lo!';
    }
    
    // Localização
    if (message.includes('onde') || message.includes('localização') || message.includes('endereço') ||
        message.includes('garça')) {
      return 'Estamos localizados em Garça/SP! 📍\n\n🏢 Nova Era Energia Solar\n📍 Rua Coronel Joaquim Piza, 581\n🏙️ Garça/SP - CEP: 17.400-084\n\nAtendemos toda a região com excelência! Entre em contato para agendar uma visita.';
    }
    
    // Agradecimentos
    if (message.includes('obrigado') || message.includes('obrigada') || message.includes('valeu') ||
        message.includes('thanks')) {
      return 'Por nada! 😊 Foi um prazer ajudá-lo! Se tiver mais dúvidas sobre energia solar, estarei aqui. A Nova Era está sempre pronta para transformar sua energia em economia!';
    }
    
    // Resposta padrão
    return 'Olá! Sou a Aurora, assistente da Nova Era Energia Solar! 🌞\n\nPosso ajudá-lo com informações sobre:\n• Preços e orçamentos\n• Processo de instalação\n• Garantias e certificações\n• Economia na conta de luz\n• Localização e contato\n\nComo posso ajudá-lo hoje? Ou entre em contato diretamente:\n📞 (14) 9 9820-5972 | (43) 9 9617-5005';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    const messageToSend = inputMessage;
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Chamar ChatGPT
      const botResponseText = await getBotResponse(messageToSend);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Desculpe, ocorreu um erro. Tente novamente ou entre em contato pelos nossos telefones: (14) 9 9820-5972 ou (43) 9 9617-5005.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Botão flutuante do chatbot */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110"
          >
            <Image 
              src="/whatsapp-icon.svg" 
              alt="WhatsApp" 
              width={40} 
              height={40} 
              className="text-white"
            />
          </Button>
          {/* Indicador de notificação */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">1</span>
          </div>
        </div>
      )}

      {/* Interface do chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden">
          {/* Header do chat */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Aurora - Nova Era</h3>
                <p className="text-blue-100 text-sm">Online agora</p>
              </div>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Área de mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user' 
                      ? 'bg-blue-600' 
                      : 'bg-gradient-to-r from-green-500 to-green-600'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Indicador de digitação */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white rounded-2xl px-4 py-2 border border-gray-200">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input de mensagem */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white placeholder:text-gray-500"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-700 px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by Nova Era - Energia Solar
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;