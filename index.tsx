import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Settings, Database, ShoppingCart, Box, Truck, Wrench, DollarSign, 
  Menu, Bell, Search, Plus, Edit2, Trash2, Copy, Save, X, 
  Building2, Users, FileText, PieChart, Sliders, ChevronDown, ChevronRight, Check, AlertCircle, Upload,
  Shield, Lock, FolderTree, Banknote, Percent, Calendar, UserPlus, Filter, MapPin, Phone, Mail,
  Package, Beer, Tag, ClipboardList, Activity, Navigation, FileDigit, BarChart2, Eye, Grid, List,
  ArrowRight, ArrowLeft, Printer, Send, CreditCard, Wallet, Smartphone, Bike, Store,
  PackageCheck, ArrowRightLeft, Clipboard, AlertTriangle, TrendingUp, TrendingDown, Clock,
  MoreVertical, FileCheck, XCircle, LayoutGrid, Calculator, ScanBarcode, Factory, Archive, Download, FileSpreadsheet,
  ArrowDownLeft, Recycle, Briefcase, FileBadge, Hammer, CheckCircle, Map, PlayCircle, StopCircle, User, Star, Camera, QrCode,
  Folder, File, ToggleLeft, ToggleRight, Layers, Image as ImageIcon, Key, ShoppingBag, ListChecks, Warehouse
} from 'lucide-react';

// --- Shared Utilities & Types ---

type Status = 'ATIVA' | 'INATIVA' | 'ATIVO' | 'INATIVO' | 'BLOQUEADO' | 'DISPONIVEL' | 'EM_USO' | 'MANUTENCAO' | 'BAIXADO' | 'PENDENTE' | 'APROVADO' | 'CANCELADO' | 'PAGO' | 'VENCIDO' | 'ENTREGUE' | 'EM_TRANSITO' | 'EM_ROTA' | 'AGUARDANDO_ROTEIRIZACAO' | 'EM_MONTAGEM' | 'NO_PRAZO' | 'ATRASADA' | 'URGENTE';

const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-BR');
const formatDateTime = (date: string) => new Date(date).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute:'2-digit' });

const StatusBadge = ({ status }: { status: string }) => {
  const s = status ? status.toUpperCase() : 'N/A';
  const colors: Record<string, string> = {
    'ATIVO': 'bg-green-100 text-green-800 border-green-200', 'ATIVA': 'bg-green-100 text-green-800 border-green-200', 
    'DISPONIVEL': 'bg-green-100 text-green-800 border-green-200', 'CONCLUIDA': 'bg-green-100 text-green-800 border-green-200',
    'PAGO': 'bg-green-100 text-green-800 border-green-200', 'APROVADO': 'bg-green-100 text-green-800 border-green-200',
    'ENTREGUE': 'bg-green-100 text-green-800 border-green-200', 'NO_PRAZO': 'bg-green-100 text-green-800 border-green-200',
    'INATIVO': 'bg-red-100 text-red-800 border-red-200', 'INATIVA': 'bg-red-100 text-red-800 border-red-200', 
    'BLOQUEADO': 'bg-red-100 text-red-800 border-red-200', 'CANCELADO': 'bg-red-100 text-red-800 border-red-200',
    'VENCIDO': 'bg-red-100 text-red-800 border-red-200', 'DANIFICADO': 'bg-red-100 text-red-800 border-red-200',
    'ATRASADA': 'bg-red-100 text-red-800 border-red-200', 'URGENTE': 'bg-red-100 text-red-800 border-red-200',
    'PENDENTE': 'bg-yellow-100 text-yellow-800 border-yellow-200', 'EM_USO': 'bg-yellow-100 text-yellow-800 border-yellow-200', 
    'MANUTENCAO': 'bg-orange-100 text-orange-800 border-orange-200', 'AGUARDANDO': 'bg-orange-100 text-orange-800 border-orange-200',
    'AGUARDANDO_ROTEIRIZACAO': 'bg-yellow-100 text-yellow-800 border-yellow-200', 'EM_MONTAGEM': 'bg-orange-100 text-orange-800 border-orange-200',
    'EM_TRANSITO': 'bg-blue-100 text-blue-800 border-blue-200', 'NOVO': 'bg-blue-100 text-blue-800 border-blue-200', 'EM_ROTA': 'bg-blue-100 text-blue-800 border-blue-200'
  };
  const style = colors[s] || 'bg-gray-100 text-gray-800 border-gray-200';
  return <span className={`px-2 py-0.5 rounded text-xs font-bold border ${style}`}>{status.replace('_', ' ')}</span>;
};

const SidebarItem = ({ icon: Icon, label, active, onClick, hasSubItems }: any) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors ${active ? 'bg-blue-800 text-white border-r-4 border-yellow-400' : 'text-blue-100 hover:bg-blue-800 hover:text-white'}`}>
    <div className="flex items-center gap-3">
      <Icon size={20} />
      {label && <span>{label}</span>}
    </div>
    {hasSubItems && label && <ChevronRight size={14} className={`transition-transform ${active ? 'rotate-90' : ''}`} />}
  </button>
);

const SubMenuItem = ({ label, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full text-left pl-12 pr-4 py-2 text-sm transition-colors ${active ? 'text-yellow-400 font-bold bg-blue-900/50' : 'text-blue-200 hover:text-white hover:bg-blue-900/30'}`}>
    {label}
  </button>
);

// ================= STANDARD PAGE ENGINE (List + Full Screen Form) =================

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'email' | 'password' | 'toggle' | 'textarea' | 'color' | 'upload' | 'multi-select' | 'radio';
  options?: string[]; // For select, radio
  required?: boolean;
  mask?: string;
  width?: 'full' | 'half' | 'third';
}

interface FormSection {
  title: string;
  fields: FormField[];
}

interface PageConfig {
  title: string;
  filters: { type: 'search' | 'select' | 'date'; placeholder?: string; options?: string[] }[];
  columns: { header: string; accessor: string; type?: 'text' | 'badge' | 'currency' | 'date' | 'actions' | 'image' | 'icon_text' }[];
  data: any[];
  formSections: FormSection[];
  kpis?: { label: string; value: string; sub?: string; color: string; icon: any; bg: string; border: string }[];
}

const StandardPage = ({ config }: { config: PageConfig }) => {
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [formData, setFormData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState(config.data);

  const filteredData = data.filter(item => 
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleSave = () => {
    // Simulate save
    if (formData.id) {
       setData(data.map(d => d.id === formData.id ? formData : d));
    } else {
       setData([...data, { ...formData, id: Math.floor(Math.random() * 10000) }]);
    }
    setViewMode('list');
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza? Esta ação não pode ser desfeita.')) {
      setData(data.filter(d => d.id !== id));
    }
  };

  if (viewMode === 'form') {
    return (
      <div className="flex flex-col h-full bg-gray-50 overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
        <div className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800">{formData.id ? `Editar ${config.title.slice(0,-1)}` : `Nova ${config.title.slice(0,-1)}`}</h2>
          <div className="flex gap-3">
            <button onClick={() => setViewMode('list')} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"><X size={18}/> Cancelar</button>
            <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm flex items-center gap-2"><Save size={18}/> Salvar</button>
          </div>
        </div>
        
        <div className="p-8 max-w-5xl mx-auto w-full space-y-8 pb-20">
          {config.formSections.map((section, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">{section.title}</h3>
              <div className="grid grid-cols-12 gap-6">
                {section.fields.map((field, fIdx) => (
                  <div key={fIdx} className={`${field.width === 'half' ? 'col-span-6' : field.width === 'third' ? 'col-span-4' : 'col-span-12'}`}>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{field.label} {field.required && <span className="text-red-500">*</span>}</label>
                    {field.type === 'select' ? (
                      <select 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={formData[field.name] || ''}
                        onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                      >
                        <option value="">Selecione...</option>
                        {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : field.type === 'toggle' ? (
                       <div className="flex items-center gap-3">
                          <button 
                            onClick={() => setFormData({...formData, [field.name]: !formData[field.name]})}
                            className={`w-12 h-6 rounded-full transition-colors relative ${formData[field.name] ? 'bg-green-500' : 'bg-gray-300'}`}
                          >
                            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${formData[field.name] ? 'left-7' : 'left-1'}`}/>
                          </button>
                          <span className="text-sm font-medium text-gray-600">{formData[field.name] ? 'Ativo' : 'Inativo'}</span>
                       </div>
                    ) : field.type === 'radio' ? (
                       <div className="flex gap-4">
                          {field.options?.map(opt => (
                            <label key={opt} className="flex items-center gap-2 cursor-pointer">
                               <input type="radio" name={field.name} checked={formData[field.name] === opt} onChange={() => setFormData({...formData, [field.name]: opt})} className="w-4 h-4 text-blue-600"/>
                               <span className="text-sm text-gray-700">{opt}</span>
                            </label>
                          ))}
                       </div>
                    ) : field.type === 'textarea' ? (
                       <textarea 
                          className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                          placeholder={field.label}
                          value={formData[field.name] || ''}
                          onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                       />
                    ) : (
                      <input 
                        type={field.type} 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder={field.mask || field.label}
                        value={formData[field.name] || ''}
                        onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 animate-in fade-in duration-300">
      {/* Header & KPIs */}
      <div className="bg-white border-b p-6">
         <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{config.title}</h1>
            <button 
              onClick={() => { setFormData({}); setViewMode('form'); }}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow hover:bg-blue-700 transition-all hover:scale-105"
            >
              <Plus size={20}/> Novo Registro
            </button>
         </div>
         {config.kpis && (
            <div className="grid grid-cols-4 gap-4 mb-2">
               {config.kpis.map((k, i) => (
                  <div key={i} className={`${k.bg} p-4 rounded-xl border ${k.border} flex flex-col justify-between`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold uppercase opacity-70">{k.label}</span>
                      <k.icon size={16} className={k.color}/>
                    </div>
                    <div>
                      <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
                      {k.sub && <p className="text-xs text-gray-500 mt-1">{k.sub}</p>}
                    </div>
                  </div>
               ))}
            </div>
         )}
         {/* Filters */}
         <div className="flex flex-wrap gap-4 items-center">
            {config.filters.map((f, i) => (
              <div key={i} className="relative">
                {f.type === 'search' ? (
                  <div className="relative w-72">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                    <input 
                      className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none transition-all" 
                      placeholder={f.placeholder || 'Buscar...'} 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                ) : (
                  <select className="px-4 py-2 border rounded-lg bg-gray-50 focus:bg-white text-sm text-gray-600 focus:ring-2 focus:ring-blue-200 outline-none cursor-pointer">
                    <option value="">{f.placeholder || 'Filtrar'}</option>
                    {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                )}
              </div>
            ))}
         </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b uppercase text-xs text-gray-500 font-bold tracking-wider">
              <tr>
                {config.columns.map((c, i) => <th key={i} className="p-4">{c.header}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((row, i) => (
                <tr key={i} className="hover:bg-blue-50/50 transition-colors">
                  {config.columns.map((col, idx) => (
                    <td key={idx} className="p-4 align-middle">
                      {col.type === 'badge' ? <StatusBadge status={row[col.accessor]}/> :
                       col.type === 'image' ? <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 overflow-hidden">{row[col.accessor] ? <img src={row[col.accessor]} className="w-full h-full object-cover"/> : <ImageIcon size={20}/>}</div> :
                       col.type === 'icon_text' ? <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">{row[col.accessor].charAt(0)}</div><span className="font-medium">{row[col.accessor]}</span></div> :
                       col.type === 'actions' ? (
                         <div className="flex gap-2">
                           <button onClick={() => { setFormData(row); setViewMode('form'); }} className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"><Edit2 size={16}/></button>
                           <button onClick={() => handleDelete(row.id)} className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"><Trash2 size={16}/></button>
                         </div>
                       ) :
                       <span className={idx === 0 ? "font-semibold text-gray-900" : "text-gray-600"}>{row[col.accessor]}</span>}
                    </td>
                  ))}
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr><td colSpan={config.columns.length} className="p-12 text-center text-gray-400 flex flex-col items-center gap-2"><div className="p-4 bg-gray-100 rounded-full"><Search size={24}/></div>Nenhum registro encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
           <span>Mostrando {filteredData.length} registros</span>
           <div className="flex gap-1">
              <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50">Anterior</button>
              <button className="px-3 py-1 border rounded bg-blue-50 text-blue-600 font-bold">1</button>
              <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50">Próxima</button>
           </div>
        </div>
      </div>
    </div>
  );
};

// ... (Previous User/Permissions/Params Modules) ...

// ================= CUSTOM MODULE: PÁTIO (YARD MANAGEMENT) =================

// Mock Data for Patio
const PATIO_MOCK = {
    carregamentos: [
        { id: 125, rota: 'ROTA-0125', data: '06/02 08:00', veiculo: 'ABC-1234', motorista: 'Carlos Silva', status: 'PENDENTE', pedidos: 3, volume: '135L', ativos: 15 },
        { id: 126, rota: 'ROTA-0126', data: '06/02 12:00', veiculo: 'XYZ-9876', motorista: 'João Santos', status: 'PENDENTE', pedidos: 5, volume: '210L', ativos: 23 },
    ],
    descarregamentos: [
        { id: 120, rota: 'ROTA-0120', retorno: '05/02 11:45', veiculo: 'ABC-1234', motorista: 'Carlos Silva', status: 'PENDENTE', recolhidos: '31 barris' },
        { id: 121, rota: 'ROTA-0121', retorno: '05/02 16:30', veiculo: 'XYZ-9876', motorista: 'João Santos', status: 'PENDENTE', recolhidos: '18 barris' },
    ],
    historico: [
        { id: 5042, data: '05/02 08:30', tipo: 'Carregamento', desc: 'ROTA-0125 ABC-1234', resp: 'Maria Santos', status: 'CONCLUIDA' },
        { id: 5041, data: '05/02 11:45', tipo: 'Descarregamento', desc: 'ROTA-0120 ABC-1234', resp: 'João Silva', status: 'CONCLUIDA' },
        { id: 5040, data: '05/02 14:30', tipo: 'Entr. Vasilhame', desc: 'Cliente Bar do Zé', resp: 'Pedro Costa', status: 'VALIDADO' },
    ]
};

// Placeholders for missing modules
const EntradaVasilhameModule = () => <div className="p-8"><h2 className="text-xl font-bold">Entrada de Vasilhame</h2><p>Módulo de entrada de vasilhames e conferência.</p></div>;
const UsersModule = () => <div className="p-8"><h2 className="text-xl font-bold">Usuários & Permissões</h2></div>;
const FinancialCategoriesPage = () => <div className="p-8"><h2 className="text-xl font-bold">Categorias Financeiras</h2></div>;
const GeneralParametersPage = () => <div className="p-8"><h2 className="text-xl font-bold">Parâmetros Gerais</h2></div>;
const SalesOrderModule = () => <div className="p-8"><h2 className="text-xl font-bold">Pedidos Distribuidor</h2></div>;
const MovimentacaoModule = () => <div className="p-8"><h2 className="text-xl font-bold">Movimentação de Estoque</h2></div>;
const RoteirizacaoModule = () => <div className="p-8"><h2 className="text-xl font-bold">Roteirização</h2></div>;
const RotasAtivasModule = () => <div className="p-8"><h2 className="text-xl font-bold">Rotas Ativas</h2></div>;
const HistoricoEntregasModule = () => <div className="p-8"><h2 className="text-xl font-bold">Histórico de Entregas</h2></div>;
const AppMotoristaModule = () => <div className="p-8"><h2 className="text-xl font-bold">App Motorista</h2></div>;
const TransferenciasModule = () => <div className="p-8"><h2 className="text-xl font-bold">Transferências</h2></div>;
const InventarioModule = () => <div className="p-8"><h2 className="text-xl font-bold">Inventário</h2></div>;
const RelatorioEstoqueModule = () => <div className="p-8"><h2 className="text-xl font-bold">Relatório de Estoque</h2></div>;

const PatioDashboard = ({ navigate }: { navigate: (tab: string) => void }) => {
    return (
        <div className="flex flex-col h-full bg-gray-50 p-8 space-y-8 animate-in fade-in duration-300 overflow-y-auto">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard do Pátio</h1>
            
            {/* KPIs */}
            <div className="grid grid-cols-5 gap-4">
                {[
                    { label: 'Carregam. Pendentes', val: '5', icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Descarreg. Pendentes', val: '3', icon: ArrowDownLeft, color: 'text-orange-600', bg: 'bg-orange-50' },
                    { label: 'Entrada Vasilhame', val: '2', icon: Recycle, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Recebim. Fornecedor', val: '1', icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Total Pendências', val: '11', icon: Activity, color: 'text-gray-600', bg: 'bg-gray-100' },
                ].map((k, i) => (
                    <div key={i} className={`${k.bg} p-4 rounded-xl border border-white shadow-sm flex flex-col justify-between h-32`}>
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-bold uppercase opacity-70 text-gray-600">{k.label}</span>
                            <k.icon size={20} className={k.color}/>
                        </div>
                        <p className={`text-4xl font-bold ${k.color}`}>{k.val}</p>
                    </div>
                ))}
            </div>

            {/* Pendências Sections */}
            <div className="space-y-6">
                <div className="bg-white rounded-xl border shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2"><Truck className="text-blue-600"/> Carregamentos Pendentes</h3>
                        <button onClick={() => navigate('Carregamentos')} className="text-sm text-blue-600 font-bold hover:underline">Ver Todos</button>
                    </div>
                    <div className="space-y-3">
                        {PATIO_MOCK.carregamentos.map(c => (
                            <div key={c.id} className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-gray-800">{c.rota}</span>
                                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">Veículo: {c.veiculo}</span>
                                    </div>
                                    <p className="text-sm text-gray-500">📅 {c.data} • 👤 {c.motorista}</p>
                                    <p className="text-xs text-gray-400 mt-1">📦 {c.pedidos} pedidos • {c.volume} • {c.ativos} barris</p>
                                </div>
                                <button onClick={() => navigate('Carregamentos')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700">Iniciar</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border shadow-sm p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2"><ArrowDownLeft className="text-orange-600"/> Descarregamentos</h3>
                            <button onClick={() => navigate('Descarregamentos')} className="text-sm text-blue-600 font-bold hover:underline">Ver Todos</button>
                        </div>
                        {PATIO_MOCK.descarregamentos.map(d => (
                            <div key={d.id} className="border rounded-lg p-4 mb-3 flex justify-between items-center hover:bg-gray-50">
                                <div>
                                    <p className="font-bold text-gray-800">{d.rota}</p>
                                    <p className="text-sm text-gray-500">Chegada: {d.retorno}</p>
                                    <p className="text-xs text-orange-600 font-bold mt-1">🛢️ {d.recolhidos}</p>
                                </div>
                                <button onClick={() => navigate('Descarregamentos')} className="bg-orange-500 text-white px-3 py-1.5 rounded-lg font-bold text-sm hover:bg-orange-600">Descarregar</button>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-xl border shadow-sm p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2"><Recycle className="text-green-600"/> Entrada de Vasilhame</h3>
                            <button onClick={() => navigate('Entrada de Vasilhame')} className="text-sm text-blue-600 font-bold hover:underline">Ver Todos</button>
                        </div>
                        <div className="border rounded-lg p-4 mb-3 flex justify-between items-center hover:bg-gray-50">
                            <div>
                                <p className="font-bold text-gray-800">#1058 - Bar do Zé</p>
                                <p className="text-sm text-gray-500">10 barris 30L + 5 barris 20L</p>
                                <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded font-bold">Aguardando Validação</span>
                            </div>
                            <button onClick={() => navigate('Entrada de Vasilhame')} className="bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold text-sm hover:bg-green-700">Validar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PatioLoading = ({ onCancel }: { onCancel: () => void }) => {
    const [step, setStep] = useState(0); // 0: List, 1: Wizard
    const [selectedRoute, setSelectedRoute] = useState<any>(null);

    const handleStart = (rota: any) => {
        setSelectedRoute(rota);
        setStep(1);
    };

    if (step === 0) {
        return (
            <div className="flex flex-col h-full bg-gray-50 p-6 animate-in fade-in duration-300">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Carregamentos Pendentes</h1>
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b font-bold text-gray-600">
                            <tr><th className="p-4">Rota</th><th className="p-4">Data/Hora</th><th className="p-4">Veículo</th><th className="p-4">Motorista</th><th className="p-4">Status</th><th className="p-4 text-right">Ações</th></tr>
                        </thead>
                        <tbody className="divide-y">
                            {PATIO_MOCK.carregamentos.map(c => (
                                <tr key={c.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-bold">{c.rota}</td>
                                    <td className="p-4">{c.data}</td>
                                    <td className="p-4">{c.veiculo}</td>
                                    <td className="p-4">{c.motorista}</td>
                                    <td className="p-4"><StatusBadge status={c.status}/></td>
                                    <td className="p-4 text-right"><button onClick={() => handleStart(c)} className="bg-blue-600 text-white px-3 py-1.5 rounded font-bold hover:bg-blue-700">Iniciar</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gray-50 animate-in slide-in-from-right-8 duration-300">
            {/* Wizard Header */}
            <div className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => setStep(0)} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={20}/></button>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Carregamento - {selectedRoute.rota}</h2>
                        <p className="text-sm text-gray-500">{selectedRoute.veiculo} • {selectedRoute.motorista}</p>
                    </div>
                </div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded font-bold text-sm">Em Andamento</div>
            </div>

            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Orders */}
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-xl border shadow-sm p-6">
                            <div className="flex justify-between items-start mb-4 border-b pb-2">
                                <h3 className="font-bold text-lg text-gray-800">PED-004{4+i} - Cliente Exemplo {i}</h3>
                                <button className="text-blue-600 text-sm font-bold flex items-center gap-1"><FileText size={16}/> Romaneio</button>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded border flex items-center justify-center cursor-pointer ${i===1 ? 'bg-green-500 border-green-600 text-white' : 'bg-white border-gray-300'}`}>
                                        {i===1 && <Check size={16}/>}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-700">10 un Chopp Pilsen 30L</p>
                                        <p className="text-xs text-gray-500">Ativos: 10 barris 30L (Seriais: BAR30-001 a 010)</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center cursor-pointer bg-white"></div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-700">5 un Chopp IPA 30L</p>
                                        <p className="text-xs text-gray-500">Ativos: 5 barris 30L (Aguardando seleção)</p>
                                    </div>
                                    <button className="text-sm bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">Selecionar Ativos</button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="bg-white rounded-xl border shadow-sm p-6">
                        <h3 className="font-bold text-gray-800 mb-4">Resumo</h3>
                        <div className="grid grid-cols-4 gap-4 text-center">
                            <div className="bg-gray-50 p-3 rounded">
                                <p className="text-xs text-gray-500 font-bold uppercase">Volume</p>
                                <p className="text-xl font-bold text-gray-800">{selectedRoute.volume}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                                <p className="text-xs text-gray-500 font-bold uppercase">Ativos</p>
                                <p className="text-xl font-bold text-gray-800">{selectedRoute.ativos}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded col-span-2">
                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Progresso</p>
                                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                    <div className="bg-blue-600 h-full w-1/3"></div>
                                </div>
                                <p className="text-xs text-right mt-1 text-blue-600 font-bold">33%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border-t p-4 flex justify-between items-center px-8">
                <button onClick={() => setStep(0)} className="px-6 py-2 border rounded-lg font-bold text-gray-600 hover:bg-gray-50">Cancelar</button>
                <button className="px-8 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow flex items-center gap-2"><Check size={18}/> FINALIZAR CARREGAMENTO</button>
            </div>
        </div>
    );
};

const PatioUnloading = ({ onCancel }: { onCancel: () => void }) => {
    const [step, setStep] = useState(0);
    const [selectedRoute, setSelectedRoute] = useState<any>(null);

    const handleStart = (rota: any) => {
        setSelectedRoute(rota);
        setStep(1);
    };

    if (step === 0) {
        return (
            <div className="flex flex-col h-full bg-gray-50 p-6 animate-in fade-in duration-300">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Descarregamentos Pendentes</h1>
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b font-bold text-gray-600">
                            <tr><th className="p-4">Rota</th><th className="p-4">Retorno</th><th className="p-4">Veículo</th><th className="p-4">Motorista</th><th className="p-4">Recolhidos</th><th className="p-4 text-right">Ações</th></tr>
                        </thead>
                        <tbody className="divide-y">
                            {PATIO_MOCK.descarregamentos.map(d => (
                                <tr key={d.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-bold">{d.rota}</td>
                                    <td className="p-4">{d.retorno}</td>
                                    <td className="p-4">{d.veiculo}</td>
                                    <td className="p-4">{d.motorista}</td>
                                    <td className="p-4 text-orange-600 font-bold">{d.recolhidos}</td>
                                    <td className="p-4 text-right"><button onClick={() => handleStart(d)} className="bg-orange-500 text-white px-3 py-1.5 rounded font-bold hover:bg-orange-600">Descarregar</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gray-50 animate-in slide-in-from-right-8 duration-300">
            <div className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => setStep(0)} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={20}/></button>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Descarregamento - {selectedRoute.rota}</h2>
                        <p className="text-sm text-gray-500">Chegada: {selectedRoute.retorno}</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="bg-white rounded-xl border shadow-sm p-6">
                        <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Conferência de Vasilhames</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center"><Recycle size={32} className="text-gray-400"/></div>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-800">Barril 30L Inox</p>
                                    <p className="text-xs text-gray-500">Declarado pelo motorista: 26 un</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-gray-600">Contagem:</span>
                                    <input type="number" className="w-20 border rounded p-2 text-center font-bold" defaultValue={26} />
                                </div>
                                <button className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"><ScanBarcode size={20}/></button>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center"><Recycle size={32} className="text-gray-400"/></div>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-800">Barril 20L Inox</p>
                                    <p className="text-xs text-gray-500">Declarado pelo motorista: 5 un</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-gray-600">Contagem:</span>
                                    <input type="number" className="w-20 border rounded p-2 text-center font-bold" defaultValue={5} />
                                </div>
                                <button className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"><ScanBarcode size={20}/></button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border shadow-sm p-6">
                        <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Condição dos Ativos</h3>
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded"/>
                                <span className="font-medium text-gray-700">Todos em bom estado (Liberar para estoque)</span>
                            </label>
                            <div className="pl-7 text-sm text-gray-500">
                                Se desmarcar, abrirá opção para selecionar quantidade suja/danificada.
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Observações do Pátio</label>
                            <textarea className="w-full border rounded p-2 h-20 resize-none" placeholder="Ocorrências, danos visíveis..."></textarea>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border-t p-4 flex justify-end px-8 gap-3">
                <button onClick={() => setStep(0)} className="px-6 py-2 border rounded-lg font-bold text-gray-600 hover:bg-gray-50">Cancelar</button>
                <button className="px-8 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 shadow flex items-center gap-2"><Check size={18}/> CONFIRMAR RECEBIMENTO</button>
            </div>
        </div>
    );
};

const PatioKegExit = () => {
    return (
        <div className="flex flex-col h-full bg-gray-50 animate-in fade-in duration-300">
            <div className="bg-white border-b p-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Saída de Vasilhame</h1>
                <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow hover:bg-blue-700"><Plus size={20}/> Nova Saída</button>
            </div>
            <div className="flex-1 p-6">
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b font-bold text-gray-600">
                            <tr><th className="p-4">ID</th><th className="p-4">Data/Hora</th><th className="p-4">Tipo</th><th className="p-4">Destino</th><th className="p-4">Qtd</th><th className="p-4">Status</th><th className="p-4">Ações</th></tr>
                        </thead>
                        <tbody className="divide-y">
                            {[
                                { id: 1025, data: '05/02 14:30', tipo: 'Manutenção', destino: 'Barris Norte Ind.', qtd: '5 barris', status: 'CONCLUIDA' },
                                { id: 1024, data: '05/02 10:00', tipo: 'Transferência', destino: 'Filial SP', qtd: '15 barris', status: 'CONCLUIDA' },
                            ].map(row => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    <td className="p-4">{row.id}</td>
                                    <td className="p-4">{row.data}</td>
                                    <td className="p-4">{row.tipo}</td>
                                    <td className="p-4">{row.destino}</td>
                                    <td className="p-4">{row.qtd}</td>
                                    <td className="p-4"><StatusBadge status={row.status}/></td>
                                    <td className="p-4 flex gap-2"><button className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Eye size={16}/></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const PatioHistory = () => {
    return (
        <div className="flex flex-col h-full bg-gray-50 animate-in fade-in duration-300">
            <div className="bg-white border-b p-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Histórico de Movimentações</h1>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-50"><Filter size={16}/> Filtros</button>
                    <button className="px-4 py-2 border rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-50"><Download size={16}/> Exportar</button>
                </div>
            </div>
            <div className="flex-1 p-6">
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b font-bold text-gray-600">
                            <tr><th className="p-4">ID</th><th className="p-4">Data/Hora</th><th className="p-4">Tipo</th><th className="p-4">Descrição</th><th className="p-4">Responsável</th><th className="p-4">Status</th></tr>
                        </thead>
                        <tbody className="divide-y">
                            {PATIO_MOCK.historico.map(h => (
                                <tr key={h.id} className="hover:bg-gray-50">
                                    <td className="p-4">{h.id}</td>
                                    <td className="p-4">{h.data}</td>
                                    <td className="p-4"><span className="font-bold">{h.tipo}</span></td>
                                    <td className="p-4">{h.desc}</td>
                                    <td className="p-4">{h.resp}</td>
                                    <td className="p-4"><StatusBadge status={h.status}/></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const PAGE_CONFIGS: Record<string, PageConfig> = {
    'Empresas': {
        title: 'Empresas',
        filters: [{ type: 'search', placeholder: 'Buscar empresa...' }],
        columns: [
            { header: 'Nome', accessor: 'nome' },
            { header: 'CNPJ', accessor: 'cnpj' },
            { header: 'Cidade', accessor: 'cidade' },
            { header: 'Status', accessor: 'status', type: 'badge' },
            { header: 'Ações', accessor: 'id', type: 'actions' }
        ],
        data: [
            { id: 1, nome: 'Chopp & Cia Matriz', cnpj: '12.345.678/0001-90', cidade: 'São Paulo', status: 'ATIVA' },
            { id: 2, nome: 'Filial Zona Sul', cnpj: '12.345.678/0002-71', cidade: 'São Paulo', status: 'ATIVA' }
        ],
        formSections: [
            { 
                title: 'Dados da Empresa', 
                fields: [
                    { name: 'nome', label: 'Razão Social / Fantasia', type: 'text', required: true },
                    { name: 'cnpj', label: 'CNPJ', type: 'text', width: 'half' },
                    { name: 'status', label: 'Status', type: 'select', options: ['ATIVA', 'INATIVA'], width: 'half' }
                ]
            },
            {
                title: 'Endereço',
                fields: [
                    { name: 'cep', label: 'CEP', type: 'text', width: 'third' },
                    { name: 'endereco', label: 'Logradouro', type: 'text', width: 'half' },
                    { name: 'numero', label: 'Número', type: 'text', width: 'third' },
                    { name: 'cidade', label: 'Cidade', type: 'text', width: 'half' },
                    { name: 'uf', label: 'UF', type: 'text', width: 'third' }
                ]
            }
        ]
    },
    'Clientes': {
        title: 'Clientes',
        filters: [{ type: 'search', placeholder: 'Buscar cliente...' }],
        columns: [
            { header: 'Nome / Razão', accessor: 'nome' },
            { header: 'Contato', accessor: 'contato' },
            { header: 'Telefone', accessor: 'telefone' },
            { header: 'Status', accessor: 'status', type: 'badge' },
            { header: 'Ações', accessor: 'id', type: 'actions' }
        ],
        data: [
            { id: 1, nome: 'Bar do Zé', contato: 'José Silva', telefone: '(11) 99999-9999', status: 'ATIVO' },
            { id: 2, nome: 'Restaurante Sabor', contato: 'Maria Oliveira', telefone: '(11) 88888-8888', status: 'ATIVO' }
        ],
        formSections: [
            {
                title: 'Dados Principais',
                fields: [
                    { name: 'nome', label: 'Nome do Cliente', type: 'text', required: true },
                    { name: 'contato', label: 'Nome do Contato', type: 'text', width: 'half' },
                    { name: 'telefone', label: 'Telefone/WhatsApp', type: 'text', width: 'half' },
                    { name: 'email', label: 'Email', type: 'email', width: 'half' },
                    { name: 'status', label: 'Status', type: 'select', options: ['ATIVO', 'INATIVO', 'BLOQUEADO'], width: 'half' }
                ]
            }
        ]
    },
    'Produtos Líquidos': {
        title: 'Produtos Líquidos',
        filters: [{ type: 'search' }],
        columns: [
            { header: 'Nome', accessor: 'nome' },
            { header: 'Estilo', accessor: 'estilo' },
            { header: 'Preço/L', accessor: 'preco', type: 'currency' },
            { header: 'Status', accessor: 'status', type: 'badge' },
            { header: 'Ações', accessor: 'id', type: 'actions' }
        ],
        data: [
            { id: 1, nome: 'Chopp Pilsen', estilo: 'Pilsen', preco: 12.50, status: 'ATIVO' },
            { id: 2, nome: 'Chopp IPA', estilo: 'India Pale Ale', preco: 18.00, status: 'ATIVO' }
        ],
        formSections: [
            {
                title: 'Detalhes do Produto',
                fields: [
                    { name: 'nome', label: 'Nome do Produto', type: 'text', required: true },
                    { name: 'estilo', label: 'Estilo', type: 'select', options: ['Pilsen', 'IPA', 'Weiss', 'Stout', 'Lager'], width: 'half' },
                    { name: 'preco', label: 'Preço por Litro (Custo)', type: 'number', width: 'half' },
                    { name: 'status', label: 'Status', type: 'toggle' }
                ]
            }
        ]
    },
    'Ativos (Vasilhames)': {
        title: 'Cadastro de Barris',
        filters: [{ type: 'search' }, { type: 'select', options: ['30L', '50L', '20L'], placeholder: 'Capacidade' }],
        columns: [{ header: 'Serial', accessor: 'serial' }, { header: 'Tipo', accessor: 'tipo' }, { header: 'Capacidade', accessor: 'cap' }, { header: 'Status', accessor: 'status', type: 'badge' }, { header: 'Ações', accessor: 'id', type: 'actions' }],
        data: [
            { id: 1, serial: 'B30-00105', tipo: 'Inox', cap: '30L', status: 'DISPONIVEL' },
            { id: 2, serial: 'B50-00203', tipo: 'Inox', cap: '50L', status: 'EM_USO' },
            { id: 3, serial: 'B30-00199', tipo: 'Inox', cap: '30L', status: 'MANUTENCAO' }
        ],
        formSections: [{ title: 'Ativo', fields: [{ name: 'serial', label: 'Serial', type: 'text' }, { name: 'tipo', label: 'Tipo', type: 'select', options: ['Inox', 'Plástico'] }] }]
    },
    'Veículos': {
        title: 'Frota',
        filters: [{ type: 'search' }],
        columns: [{ header: 'Placa', accessor: 'placa' }, { header: 'Modelo', accessor: 'modelo' }, { header: 'Motorista', accessor: 'motorista' }, { header: 'Status', accessor: 'status', type: 'badge' }, { header: 'Ações', accessor: 'id', type: 'actions' }],
        data: [
            { id: 1, placa: 'ABC-1234', modelo: 'VUC HR', motorista: 'Carlos Silva', status: 'DISPONIVEL' },
            { id: 2, placa: 'XYZ-9876', modelo: 'Fiorino', motorista: 'João Santos', status: 'EM_ROTA' }
        ],
        formSections: [{ title: 'Veículo', fields: [{ name: 'placa', label: 'Placa', type: 'text' }] }]
    }
};

// Renamed and updated to accept initialTab prop
const PatioModule = ({ initialTab }: { initialTab: string }) => {
    const [activeTab, setActiveTab] = useState(initialTab);

    // Sync state with props if prop changes (optional but good for sidebar navigation)
    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    return (
        <div className="flex flex-col h-full">
            {activeTab === 'Pendências' && <PatioDashboard navigate={setActiveTab} />}
            {activeTab === 'Carregamentos' && <PatioLoading onCancel={() => setActiveTab('Pendências')} />}
            {activeTab === 'Descarregamentos' && <PatioUnloading onCancel={() => setActiveTab('Pendências')} />}
            {activeTab === 'Saída de Vasilhame' && <PatioKegExit />}
            {activeTab === 'Histórico de Movimentações' && <PatioHistory />}
            {activeTab === 'Entrada de Vasilhame' && <EntradaVasilhameModule />}
            {activeTab === 'Recebimento de Produtos' && <div className="p-8 text-center text-gray-500">Módulo de Recebimento (Integrado com Estoque)</div>}
        </div>
    );
};

const App = () => {
  const [activeCategory, setActiveCategory] = useState('CONFIGURAÇÕES DO SISTEMA');
  const [activeTab, setActiveTab] = useState('Empresas');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const categories = [
    { title: 'CONFIGURAÇÕES DO SISTEMA', icon: Settings, tabs: ['Empresas', 'Usuários & Permissões', 'Categorias Financeiras', 'Centros de Custo', 'Parâmetros Gerais'] },
    { title: 'CADASTROS', icon: Database, tabs: ['Clientes', 'Fornecedores', 'Produtos Líquidos', 'Ativos (Vasilhames)', 'Equipamentos', 'Veículos', 'Tabelas de Preço'] },
    { title: 'VENDAS', icon: ShoppingCart, tabs: ['Pedidos Distribuidor', 'Pedidos PDV', 'Histórico de Vendas'] },
    { title: 'ESTOQUE & COMPRAS', icon: Box, tabs: ['Pedidos de Compra', 'Recebimento', 'Movimentação', 'Transferências', 'Inventário', 'Relatório de Estoque', 'Entrada de Vasilhame'] },
    { title: 'PÁTIO', icon: Warehouse, tabs: ['Pendências', 'Carregamentos', 'Descarregamentos', 'Entrada de Vasilhame', 'Saída de Vasilhame', 'Recebimento de Produtos', 'Histórico de Movimentações'] },
    { title: 'LOGÍSTICA', icon: Truck, tabs: ['Roteirização', 'Rotas Ativas', 'Histórico', 'App Motorista'] },
    { title: 'ORDENS DE SERVIÇO', icon: Wrench, tabs: ['Manutenção de Equipamentos', 'Limpeza de Barris', 'Solicitações'] },
    { title: 'FINANCEIRO', icon: DollarSign, tabs: ['Contas a Pagar', 'Contas a Receber', 'Fluxo de Caixa', 'Conciliação', 'Relatórios'] },
  ];

  const handleCategoryClick = (categoryTitle: string) => {
    if (activeCategory === categoryTitle) setActiveCategory('');
    else {
      setActiveCategory(categoryTitle);
      const cat = categories.find(c => c.title === categoryTitle);
      if (cat && cat.tabs.length > 0) setActiveTab(cat.tabs[0]);
    }
  };

  const renderContent = () => {
    if (activeCategory === 'PÁTIO') {
        // Pass activeTab as initialTab so PatioModule knows what to show.
        // Also use key to force re-render if needed, although passing prop is usually enough if handled in useEffect.
        return <PatioModule initialTab={activeTab} />; 
    }

    if (activeTab === 'Usuários & Permissões') return <UsersModule />;
    if (activeTab === 'Categorias Financeiras') return <FinancialCategoriesPage />;
    if (activeTab === 'Parâmetros Gerais') return <GeneralParametersPage />;
    if (activeTab === 'Pedidos Distribuidor') return <SalesOrderModule />;

    if (activeTab === 'Movimentação') return <MovimentacaoModule />;
    if (activeTab === 'Roteirização') return <RoteirizacaoModule />;
    if (activeTab === 'Rotas Ativas') return <RotasAtivasModule />;
    if (activeTab === 'Histórico') return <HistoricoEntregasModule />;
    if (activeTab === 'App Motorista') return <AppMotoristaModule />;
    if (activeTab === 'Transferências') return <TransferenciasModule />;
    if (activeTab === 'Inventário') return <InventarioModule />;
    if (activeTab === 'Relatório de Estoque') return <RelatorioEstoqueModule />;
    if (activeTab === 'Entrada de Vasilhame') return <EntradaVasilhameModule />;

    const config = PAGE_CONFIGS[activeTab];
    if (config) {
      return <StandardPage config={config} />;
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50">
        <div className="bg-white p-8 rounded-full shadow-sm mb-4">
          <Wrench size={48} className="text-blue-200"/>
        </div>
        <h2 className="text-xl font-bold text-gray-600 mb-2">{activeTab}</h2>
        <p className="text-sm text-gray-500 max-w-md text-center">
          Este módulo está mapeado no sistema mas aguardando implementação da configuração de página.
        </p>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden font-sans">
      <div className={`${sidebarOpen ? 'w-72' : 'w-0 md:w-20'} bg-blue-900 flex flex-col transition-all duration-300 shadow-2xl z-20 overflow-hidden`}>
        <div className="h-16 flex items-center justify-center border-b border-blue-800 bg-blue-950 shrink-0">
           {sidebarOpen ? (
             <div className="flex items-center gap-2">
               <Beer className="text-yellow-400" size={24}/>
               <h1 className="text-white font-bold text-xl tracking-wider">CHOPP ERP</h1>
             </div>
           ) : <h1 className="text-white font-bold">CH</h1>}
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-blue-700">
          {categories.map((cat) => (
            <div key={cat.title}>
              <SidebarItem 
                icon={cat.icon} 
                label={sidebarOpen ? cat.title : ''} 
                active={activeCategory === cat.title} 
                onClick={() => handleCategoryClick(cat.title)} 
                hasSubItems={true}
              />
              {activeCategory === cat.title && sidebarOpen && (
                <div className="bg-blue-950/30 mb-1 py-1 animate-in slide-in-from-top-2 duration-200">
                  {cat.tabs.map(tab => (
                    <SubMenuItem 
                      key={tab} 
                      label={tab} 
                      active={activeTab === tab} 
                      onClick={() => setActiveTab(tab)} 
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-blue-800 bg-blue-900 shrink-0">
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center font-bold text-blue-900 border-2 border-white/20">A</div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-bold">Administrador</p>
                <p className="text-xs text-blue-300">admin@chopp.com</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10 border-b shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-600">
              <span className="font-semibold">{activeCategory}</span>
              <ChevronRight size={14} className="text-gray-400"/>
              <span className="text-blue-600 font-bold">{activeTab}</span>
            </div>
            <div className="w-px h-6 bg-gray-200 mx-2 hidden md:block"></div>
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-hidden relative bg-gray-100">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);