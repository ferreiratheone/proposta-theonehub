import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  User, 
  Cpu, 
  CheckCircle2, 
  Server, 
  Globe, 
  ShoppingCart, 
  Users,
  ShieldCheck,
  Clock,
  Wrench,
  Download,
  Printer,
  FileImage
} from 'lucide-react';
// @ts-ignore
import html2canvas from 'html2canvas';
import SignatureCanvas from './components/SignatureCanvas';
import InfoBadge from './components/InfoBadge';
import { ProjectInfo, PricingItem, SignatureData } from './types';

const App: React.FC = () => {
  const [signatureData, setSignatureData] = useState<SignatureData>({
    name: '',
    role: '',
    date: new Date().toLocaleDateString('pt-BR'),
    signatureImage: null
  });
  const [isSigned, setIsSigned] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);

  const projectInfo: ProjectInfo = {
    developer: "Matheus Ferreira",
    company: "TheOneHub – Soluções Digitais",
    location: "Limeira - SP",
    date: "21 de Janeiro de 2026",
    client: "Dypper – Peças Automotivas"
  };

  const pricingItems: PricingItem[] = [
    { description: "Desenvolvimento e Setup Digital", value: "R$ 2.200,00" },
    { description: "Hospedagem Netlify", value: "R$ 0,00 (Isento/Grátis)", highlight: true },
    { description: "Configuração de Domínio", value: "Bonificado (R$ 0,00)", highlight: true },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = async () => {
    if (documentRef.current) {
      setIsDownloading(true);
      try {
        // Wait for a brief moment to ensure UI is stable
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const canvas = await html2canvas(documentRef.current, {
          scale: 2, // Higher quality
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: documentRef.current.scrollWidth,
          windowHeight: documentRef.current.scrollHeight
        });
        
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = image;
        link.download = `Proposta-Dypper-${new Date().toISOString().split('T')[0]}.png`;
        link.click();
      } catch (error) {
        console.error("Erro ao gerar imagem:", error);
        alert("Não foi possível gerar a imagem. Tente a opção de Imprimir (PDF).");
      } finally {
        setIsDownloading(false);
      }
    }
  };

  // Keyboard shortcut for Ctrl+P / Cmd+P
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlePrint();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCompleteSigning = () => {
    if (!signatureData.name || !signatureData.signatureImage) {
      alert("Por favor, preencha seu nome e assine digitalmente.");
      return;
    }
    setIsSigned(true);
    // In a real app, you would send this data to a backend here
    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0">
      {/* Action Bar (Hidden in Print) */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center no-print">
        <h1 className="text-xl font-bold text-slate-800 hidden sm:block">Painel de Assinatura Digital</h1>
        <div className="flex gap-3 ml-auto">
          <button 
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg shadow-sm hover:bg-slate-50 transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            title="Baixar como imagem (PNG)"
          >
            {isDownloading ? (
               <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-500 border-t-transparent"></div>
            ) : (
               <FileImage size={16} />
            )}
            <span className="hidden sm:inline">{isDownloading ? 'Gerando...' : 'Baixar Imagem'}</span>
          </button>

          <button 
            onClick={handlePrint}
            title="Atalho: Ctrl + P - Salvar como PDF"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg shadow-sm hover:bg-slate-50 transition-all font-medium text-sm group"
          >
            <Printer size={16} className="group-hover:text-brand-600 transition-colors" />
            <span className="hidden sm:inline">Imprimir / Salvar PDF</span>
            <span className="text-xs text-slate-400 font-mono hidden lg:inline border border-slate-200 rounded px-1 ml-1">Ctrl+P</span>
          </button>
          {isSigned && (
             <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg shadow-md hover:bg-brand-700 transition-all font-medium text-sm">
                <CheckCircle2 size={16} />
                <span>Documento Finalizado</span>
             </button>
          )}
        </div>
      </div>

      {/* Main Document Paper */}
      <main 
        ref={documentRef}
        className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden print:shadow-none print:rounded-none print-container"
      >
        {/* Banner / Header Status */}
        {isSigned && (
            <div className="bg-brand-50 border-b border-brand-100 p-4 text-center print:hidden">
                <p className="text-brand-700 font-medium flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Proposta aceita e assinada digitalmente em {signatureData.date}.
                </p>
            </div>
        )}

        <div className="p-8 md:p-12 space-y-10">
          
          {/* Header Section */}
          <header className="border-b border-slate-200 pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <p className="text-sm font-mono text-brand-600 font-semibold tracking-wider mb-2">PROPOSTA COMERCIAL #2026-DYP</p>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Plataforma Digital Dypper</h1>
                <p className="text-slate-500 mt-2 text-lg">Soluções de alta performance para e-commerce automotivo.</p>
              </div>
              <div className="text-right">
                <div className="inline-block bg-slate-900 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  TheOneHub
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <InfoBadge icon={User} label="Desenvolvedor" value={projectInfo.developer} />
              <InfoBadge icon={Building2} label="Empresa" value="TheOneHub Digital" />
              <InfoBadge icon={MapPin} label="Local" value={projectInfo.location} />
              <InfoBadge icon={Calendar} label="Data" value={projectInfo.date} />
            </div>
          </header>

          {/* AI Analysis Section */}
          <section className="bg-slate-50 rounded-xl p-6 border border-slate-200 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5">
                <Cpu size={120} />
             </div>
             <div className="relative z-10">
                <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wide flex items-center gap-2 mb-3">
                    <Cpu size={16} /> Parecer Técnico (Análise IA)
                </h3>
                <blockquote className="text-slate-700 italic border-l-4 border-indigo-500 pl-4 py-1">
                    "O ecossistema digital desenvolvido para a Dypper apresenta uma arquitetura de alta performance. O fluxo de navegação entre a Linha Leve e Linha Pesada foi validado como intuitivo, reduzindo o tempo de busca do usuário e aumentando a probabilidade de conversão no carrinho de orçamentos."
                </blockquote>
             </div>
          </section>

          {/* Scope Section */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Wrench className="text-slate-400" /> Escopo Técnico e Infraestrutura
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
                {[
                    { icon: Globe, title: "Desenvolvimento", desc: "Interface exclusiva focada em Peças de Alta Performance." },
                    { icon: Server, title: "Hospedagem (Netlify)", desc: "Servidor Netlify, custo zero, economia operacional vitalícia." },
                    { icon: Globe, title: "Domínio", desc: "Implementação e apontamento técnico realizados." },
                    { icon: ShoppingCart, title: "Orçamentos", desc: "Carrinho dinâmico com ID de usuário e auto-preenchimento (CEP)." },
                    { icon: Users, title: "Gestão de Leads", desc: "Encaminhamento direto de pedidos para equipe comercial." },
                ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center">
                            <item.icon size={20} />
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900">{item.title}</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
          </section>

          {/* Pricing Section */}
          <section className="bg-slate-900 rounded-xl p-8 text-white shadow-xl print:bg-white print:text-black print:border print:border-slate-300 print:shadow-none">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-white print:text-black">
                <span className="text-brand-400">💰</span> INVESTIMENTO (CONDIÇÃO ESPECIAL - AMIGO)
            </h2>
            <p className="text-slate-400 text-sm mb-6 print:text-slate-600">
                Valor único referente à montagem, configuração e licenciamento do projeto.
            </p>
            <div className="space-y-4">
                <div className="divide-y divide-slate-700 print:divide-slate-200">
                    {pricingItems.map((item, idx) => (
                        <div key={idx} className="py-3 flex justify-between items-center">
                            <span className={`text-sm md:text-base ${item.highlight ? 'text-brand-300 font-medium print:text-brand-600' : 'text-slate-300 print:text-slate-600'}`}>
                                {item.description}
                            </span>
                            <span className={`font-mono font-semibold ${item.highlight ? 'text-brand-400 print:text-brand-700' : 'text-white print:text-black'}`}>
                                {item.value}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="pt-4 mt-4 border-t border-slate-600 print:border-slate-300 flex justify-between items-start md:items-center">
                    <span className="text-lg font-bold">VALOR TOTAL</span>
                    <div className="text-right">
                        <span className="text-2xl font-bold text-brand-400 print:text-black">R$ 2.200,00</span>
                        <p className="text-sm text-brand-200 print:text-slate-600 font-medium mt-1">
                           * Sujeito a 5x parcelado
                        </p>
                    </div>
                </div>
            </div>
          </section>

          {/* Terms Section */}
          <section className="grid md:grid-cols-2 gap-8">
            <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <ShieldCheck className="text-slate-400" size={20} /> Termos de Teste, Garantia e Manutenção
                </h2>
                <ul className="space-y-4 text-sm text-slate-600">
                    <li className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                        <span className="font-bold text-slate-900 min-w-[140px]">Período de Experiência:</span>
                        <span>A plataforma terá 01 (um) mês de teste após a entrega oficial para validação de fluxos e usabilidade.</span>
                    </li>
                    <li className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                        <span className="font-bold text-slate-900 min-w-[140px]">Garantia Técnica:</span>
                        <span>Após o período de teste, inicia-se a garantia de 03 (três) meses contra falhas técnicas ou erros de sistema.</span>
                    </li>
                    <li className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                        <span className="font-bold text-slate-900 min-w-[140px]">Manutenções Gratuitas:</span>
                        <span>Estão inclusas 02 (duas) manutenções gratuitas dentro do período de 03 meses de garantia.</span>
                    </li>
                    <li className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                        <span className="font-bold text-slate-900 min-w-[140px]">Manutenção Pós-Garantia:</span>
                        <span>Após os 3 meses de garantia, será cobrado o valor fixo de R$ 70,00 por manutenção solicitada.</span>
                    </li>
                    <li className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                        <span className="font-bold text-slate-900 min-w-[140px]">Agendamento:</span>
                        <span>As datas para manutenções ficam sujeitas a consulta prévia e disponibilidade de agenda técnica.</span>
                    </li>
                </ul>
            </div>
            <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Clock className="text-slate-400" size={20} /> Cronograma de Entrega
                </h2>
                <div className="relative border-l-2 border-slate-200 ml-2 space-y-6">
                    {[
                        { title: "Publicação Final", desc: "Em até 24 horas após aprovação." },
                        { title: "Treinamento", desc: "Instruções rápidas de como gerir o catálogo em Limeira." }
                    ].map((step, i) => (
                        <div key={i} className="pl-6 relative">
                            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-brand-500 border-2 border-white shadow-sm"></div>
                            <h4 className="font-bold text-slate-900 text-sm">{step.title}</h4>
                            <p className="text-xs text-slate-500">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
          </section>

          {/* Signature Area */}
          <section className="mt-12 pt-8 border-t-2 border-slate-100 break-inside-avoid">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Aceite e Assinatura</h2>
            
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    Ao assinar este documento, a <strong>{projectInfo.client}</strong> concorda com todos os termos técnicos, 
                    financeiros e cronogramas estipulados acima por <strong>{projectInfo.company}</strong>.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Client Signature */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-slate-700">Assinatura do Cliente (Dypper)</label>
                        
                        <div className="space-y-3">
                            <input 
                                type="text" 
                                placeholder="Nome Completo do Responsável"
                                value={signatureData.name}
                                onChange={(e) => setSignatureData({...signatureData, name: e.target.value})}
                                disabled={isSigned}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:bg-slate-100 disabled:text-slate-500"
                            />
                            
                            <SignatureCanvas 
                                isLocked={isSigned}
                                onSave={(data) => setSignatureData(prev => ({...prev, signatureImage: data}))}
                            />
                        </div>
                        
                        <div className="text-xs text-slate-500 pt-2">
                            Data do aceite: {signatureData.date}
                        </div>
                    </div>

                    {/* Developer Signature (Pre-filled visually) */}
                    <div className="space-y-4 opacity-75 grayscale hover:grayscale-0 transition-all">
                        <label className="block text-sm font-medium text-slate-700">Contratado (TheOneHub)</label>
                        <div className="h-[200px] border-2 border-solid border-slate-200 rounded-lg flex items-center justify-center bg-white relative">
                            <div className="text-center">
                                <span className="font-mono text-4xl text-slate-800 opacity-80" style={{fontFamily: "'Mistral', 'Brush Script MT', cursive"}}>Matheus Ferreira</span>
                                <div className="w-32 h-0.5 bg-slate-800 mx-auto mt-1 opacity-50"></div>
                            </div>
                             <div className="absolute bottom-2 right-2 text-[10px] text-brand-600 font-bold border border-brand-200 px-2 py-0.5 rounded-full bg-brand-50">
                                ASSINADO DIGITALMENTE
                            </div>
                        </div>
                        <div className="text-xs text-slate-500 pt-2">
                             Data: 21/01/2026
                        </div>
                    </div>
                </div>

                {!isSigned && (
                    <div className="mt-8 flex justify-center no-print">
                        <button 
                            onClick={handleCompleteSigning}
                            className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-brand-500/30 transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
                        >
                            <CheckCircle2 size={20} />
                            Assinar e Concluir Proposta
                        </button>
                    </div>
                )}
            </div>
          </section>

          {/* Footer */}
          <footer className="text-center text-slate-400 text-xs mt-12 pt-8 border-t border-slate-100">
            <p>Documento gerado digitalmente por TheOneHub Soluções Digitais. ID: 9384-DYP-2026</p>
          </footer>

        </div>
      </main>
      
      <div className="h-12"></div>
    </div>
  );
};

export default App;