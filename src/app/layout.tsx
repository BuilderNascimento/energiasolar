import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers/session-provider";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Energia Solar - Simulador e Vendas",
  description: "Plataforma completa para simulação de energia solar e gestão de leads",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <Script 
          src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2" 
          strategy="beforeInteractive"
        />
        <Script id="supabase-config" strategy="beforeInteractive">
          {`
            // Configuração Supabase
            const SUPABASE_URL = 'https://kjjybkcycorwzrboutui.supabase.co';
            const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqanlia2N5Y29yd3pyYm91dHVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNjc4MTcsImV4cCI6MjA3NDc0MzgxN30.KyUB1WLqHzaYwqUKikqOh01V8cG-3Lf-_oKP2Ske_9I';
            
            console.log('🔄 Iniciando configuração do Supabase...');
            
            // Função para tentar conectar ao Supabase
            function connectSupabase() {
              console.log('🔍 Verificando se window.supabase existe:', !!window.supabase);
              
              if (window.supabase) {
                try {
                  window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
                  console.log('✅ Supabase conectado com sucesso!');
                  console.log('📊 Cliente Supabase:', window.supabaseClient);
                  
                  // Testar conexão
                  window.supabaseClient.from('leads').select('count').limit(1)
                    .then(result => {
                      console.log('🧪 Teste de conexão com tabela leads:', result);
                    })
                    .catch(err => {
                      console.error('❌ Erro no teste de conexão:', err);
                    });
                } catch (error) {
                  console.error('❌ Erro ao criar cliente Supabase:', error);
                }
              } else {
                console.log('⏳ Supabase ainda não carregou, tentando novamente em 500ms...');
                setTimeout(connectSupabase, 500);
              }
            }
            
            // Aguardar o carregamento do Supabase
            window.addEventListener('DOMContentLoaded', connectSupabase);
            
            // Também tentar imediatamente caso já esteja carregado
            if (document.readyState === 'loading') {
              console.log('📄 Documento ainda carregando...');
            } else {
              console.log('📄 Documento já carregado, conectando imediatamente...');
              connectSupabase();
            }
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
        
        <Script id="lead-capture" strategy="afterInteractive">
          {`
            document.addEventListener('DOMContentLoaded', function() {
              // Aguardar um pouco para garantir que o formulário foi renderizado
              setTimeout(function() {
                const form = document.querySelector('form');
                if (form) {
                  form.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    
                    // Capturar os dados com os IDs corretos
                    const dados = {
                      data: new Date().toLocaleString('pt-BR'),
                      nome: document.getElementById('fullName')?.value || '',
                      whatsapp: document.getElementById('phone')?.value || '',
                      conta_luz: document.getElementById('bill')?.value || '',
                      localizacao: document.getElementById('location')?.value || '',
                      tipo: document.getElementById('installation-type')?.value || ''
                    };
                    
                    // Enviar para Make.com
                    try {
                      await fetch('https://hook.us2.make.com/r2xd623jbg2gtrt1y4ganx754bam51xy', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(dados)
                      });
                      
                      console.log('✅ Lead capturado com sucesso!', dados);
                    } catch (error) {
                      console.error('❌ Erro ao capturar lead:', error);
                    }
                    
                    // Continuar com a lógica normal do formulário
                    // Disparar o evento de submit original
                    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                    Object.defineProperty(submitEvent, 'target', { value: form });
                    
                    // Remover temporariamente este listener para evitar loop
                    form.removeEventListener('submit', arguments.callee);
                    
                    // Simular o submit original
                    const calculateButton = form.querySelector('button[type="submit"], button:not([type])');
                    if (calculateButton && calculateButton.onclick) {
                      calculateButton.click();
                    }
                    
                    // Reativar o listener após um tempo
                    setTimeout(() => {
                      form.addEventListener('submit', arguments.callee);
                    }, 100);
                  });
                }
              }, 1000);
            });
          `}
        </Script>
      </body>
    </html>
  );
}
