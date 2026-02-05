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
  ArrowDownLeft, Recycle, Briefcase, FileBadge, Hammer, CheckCircle, Map, PlayCircle, StopCircle, User, Star, Camera, QrCode
} from 'lucide-react';

// --- Shared Utilities & Types ---

type Status = 'ATIVA' | 'INATIVA' | 'ATIVO' | 'INATIVO' | 'BLOQUEADO' | 'DISPONIVEL' | 'EM_USO' | 'MANUTENCAO' | 'BAIXADO' | 'PENDENTE' | 'APROVADO' | 'CANCELADO' | 'PAGO' | 'VENCIDO' | 'ENTREGUE' | 'EM_TRANSITO' | 'EM_ROTA' | 'AGUARDANDO_ROTEIRIZACAO' | 'EM_MONTAGEM' | 'NO_PRAZO' | 'ATRASADA' | 'URGENTE';

const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-BR');
const formatDateTime = (date: string) => new Date(date).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute:'2-digit' });
const formatTime = (date: string) => new Date(date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' });

// ================= UNIVERSAL PAGE ENGINE (Keep existing) =================

interface PageConfig {
  title: string;
  icon?: any;
  kpis: { label: string; value: string; sub?: string; color: string; icon: any; bg: string; border: string }[];
  filters: { type: 'search' | 'select' | 'date'; placeholder?: string; options?: string[] }[];
  columns: { header: string; accessor: string; type?: 'text' | 'badge' | 'currency' | 'date' | 'actions' | 'image' }[];
  data: any[];
  formFields: { name: string; label: string; type: 'text' | 'number' | 'select' | 'date' | 'email'; options?: string[]; required?: boolean }[];
}

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

const UniversalPage = ({ config }: { config: PageConfig }) => {
    // ... (Keep existing implementation)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [searchTerm, setSearchTerm] = useState('');
  
    const filteredData = config.data.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  
    return (
      <div className="flex flex-col h-full bg-gray-50">
        {/* KPIs */}
        {config.kpis.length > 0 && (
          <div className={`grid grid-cols-${config.kpis.length} gap-4 p-6 border-b bg-white`}>
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
  
        {/* Toolbar */}
        <div className="p-4 flex flex-wrap gap-4 justify-between items-center sticky top-0 bg-gray-50 z-10">
          <div className="flex gap-2 flex-1">
            {config.filters.map((f, i) => (
              <div key={i} className="relative">
                {f.type === 'search' ? (
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                    <input 
                      className="w-full pl-9 pr-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-200 outline-none" 
                      placeholder={f.placeholder || 'Buscar...'} 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                ) : f.type === 'select' ? (
                  <select className="pl-3 pr-8 py-2 border rounded-lg bg-white text-sm text-gray-600 focus:ring-2 focus:ring-blue-200 outline-none cursor-pointer">
                    <option value="">{f.placeholder}</option>
                    {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type="date" className="px-3 py-2 border rounded-lg bg-white text-sm text-gray-600"/>
                )}
              </div>
            ))}
          </div>
          <button 
            onClick={() => { setFormData({}); setIsModalOpen(true); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow hover:bg-blue-700 transition-colors"
          >
            <Plus size={20}/> Novo Registro
          </button>
        </div>
  
        {/* Data Grid */}
        <div className="flex-1 overflow-auto px-4 pb-4">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b uppercase text-xs text-gray-500 font-semibold">
                <tr>
                  {config.columns.map((c, i) => <th key={i} className="p-4">{c.header}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredData.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    {config.columns.map((col, idx) => (
                      <td key={idx} className="p-4">
                        {col.type === 'badge' ? <StatusBadge status={row[col.accessor]}/> :
                         col.type === 'currency' ? formatCurrency(row[col.accessor]) :
                         col.type === 'date' ? formatDate(row[col.accessor]) :
                         col.type === 'image' ? <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">{String(row[col.accessor]).charAt(0)}</div> :
                         col.type === 'actions' ? (
                           <div className="flex gap-2">
                             <button className="p-1.5 hover:bg-blue-50 text-blue-600 rounded"><Edit2 size={16}/></button>
                             <button className="p-1.5 hover:bg-red-50 text-red-600 rounded"><Trash2 size={16}/></button>
                           </div>
                         ) :
                         <span className={idx === 0 ? "font-medium text-gray-900" : "text-gray-600"}>{row[col.accessor]}</span>}
                      </td>
                    ))}
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr><td colSpan={config.columns.length} className="p-8 text-center text-gray-400">Nenhum registro encontrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
};

// ================= LOGISTICS TYPES & MOCKS =================

interface Order {
  id: string;
  client: string;
  address: string;
  items: string;
  volume: number;
  period: 'Manhã' | 'Tarde';
  distance: number;
  status: 'URGENTE' | 'NORMAL';
  lat: number;
  lng: number;
}

interface Route {
  id: string;
  vehicle: string;
  driver: string;
  date: string;
  period: 'Manhã' | 'Tarde';
  status: 'EM_MONTAGEM' | 'ATIVA' | 'CONCLUIDA' | 'NO_PRAZO' | 'ATRASADA';
  orders: Order[];
  totalVolume: number;
  capacity: number;
  totalDistance: number;
  totalTime: number;
  eta?: string;
  next?: string;
  progress?: number;
  completed?: number;
  total?: number;
  delay?: string;
}

const MOCK_PENDING_ORDERS: Order[] = [
  { id: 'PED-0045', client: 'Bar do Zé', address: 'Rua das Flores, 123', items: '3 itens', volume: 45, period: 'Manhã', distance: 5.2, status: 'URGENTE', lat: 20, lng: 30 },
  { id: 'PED-0046', client: 'Restaurante Sabor', address: 'Av. Paulista, 500', items: '5 itens', volume: 90, period: 'Tarde', distance: 8.7, status: 'NORMAL', lat: 60, lng: 50 },
  { id: 'PED-0048', client: 'Mercado Sol', address: 'Rua Augusta, 100', items: '2 itens', volume: 30, period: 'Manhã', distance: 3.8, status: 'NORMAL', lat: 25, lng: 35 },
  { id: 'PED-0051', client: 'Bar Alegria', address: 'Rua Harmonia, 50', items: '4 itens', volume: 60, period: 'Manhã', distance: 7.1, status: 'URGENTE', lat: 40, lng: 40 },
];

const SimulatedMap = ({ markers }: { markers: any[] }) => (
  <div className="relative w-full h-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200 group">
    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
      <path d="M 50 50 Q 150 150 300 100 T 500 200" stroke="#64748b" strokeWidth="4" fill="none" />
      <path d="M 100 300 Q 200 200 400 300" stroke="#64748b" strokeWidth="4" fill="none" />
    </svg>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
      <div className="w-8 h-8 bg-blue-900 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white"><Factory size={16}/></div>
      <span className="text-[10px] font-bold bg-white px-1 rounded shadow mt-1">Depósito</span>
    </div>
    {markers.map((m, i) => (
      <div key={i} className="absolute transition-all duration-500" style={{ top: `${m.lat}%`, left: `${m.lng}%` }}>
        <div className={`w-6 h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white text-[10px] font-bold ${m.status === 'URGENTE' ? 'bg-red-500' : m.inRoute ? 'bg-blue-500' : 'bg-yellow-500'}`}>
          {i + 1}
        </div>
      </div>
    ))}
  </div>
);

// ================= MODULE: ROTEIRIZAÇÃO (MANAGER) =================

const RoteirizacaoModule = () => {
  const [pendingOrders, setPendingOrders] = useState<Order[]>(MOCK_PENDING_ORDERS);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [showNewRouteModal, setShowNewRouteModal] = useState(false);
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);

  const handleCreateRoute = () => {
    const newRoute: Route = {
      id: `ROTA-2026-01${25 + routes.length}`,
      vehicle: 'Fiat Ducato (ABC-1234)',
      driver: 'Carlos Silva',
      date: '06/02/2026',
      period: 'Manhã',
      status: 'EM_MONTAGEM',
      orders: [],
      totalVolume: 0,
      capacity: 500,
      totalDistance: 0,
      totalTime: 0
    };
    setRoutes([...routes, newRoute]);
    setShowNewRouteModal(false);
  };

  const addToRoute = (order: Order, routeId: string) => {
    const routeIndex = routes.findIndex(r => r.id === routeId);
    if (routeIndex === -1) return;
    const updatedRoutes = [...routes];
    const route = updatedRoutes[routeIndex];
    if (route.totalVolume + order.volume > route.capacity) {
      alert("⚠️ Capacidade do veículo excedida!");
      return;
    }
    route.orders.push(order);
    route.totalVolume += order.volume;
    route.totalDistance += order.distance;
    route.totalTime += 15;
    setRoutes(updatedRoutes);
    setPendingOrders(pendingOrders.filter(o => o.id !== order.id));
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
      <div className="grid grid-cols-5 gap-4 p-4 bg-white border-b shrink-0">
        {[
          { l: 'Pendentes', v: pendingOrders.length, c: 'text-yellow-600', bg: 'bg-yellow-50' },
          { l: 'Em Montagem', v: routes.filter(r=>r.status==='EM_MONTAGEM').length, c: 'text-blue-600', bg: 'bg-blue-50' },
          { l: 'Previstas', v: '42', c: 'text-gray-600', bg: 'bg-gray-50' },
          { l: 'Veículos', v: '8', c: 'text-green-600', bg: 'bg-green-50' },
          { l: 'Eficiência', v: '94%', c: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((k, i) => (
          <div key={i} className={`${k.bg} p-3 rounded-lg border text-center`}>
            <p className="text-xs uppercase font-bold opacity-60">{k.l}</p>
            <p className={`text-xl font-bold ${k.c}`}>{k.v}</p>
          </div>
        ))}
      </div>
      <div className="flex-1 p-4 grid grid-cols-12 gap-4 overflow-hidden">
        <div className="col-span-3 bg-gray-100 rounded-xl flex flex-col overflow-hidden border">
          <div className="p-3 bg-white border-b font-bold text-gray-700 flex justify-between items-center">
            <span>Pendentes ({pendingOrders.length})</span>
            <Filter size={16} className="text-gray-400"/>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
             {pendingOrders.map(order => (
               <div key={order.id} className="bg-white p-3 rounded-lg shadow-sm border hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-blue-900">{order.id}</span>
                    {order.status === 'URGENTE' && <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded">URGENTE</span>}
                  </div>
                  <p className="text-sm font-medium truncate">{order.client}</p>
                  <p className="text-xs text-gray-500 truncate mb-2">{order.address}</p>
                  <div className="flex justify-between text-xs text-gray-400 mb-3"><span>{order.volume}L • {order.items}</span><span>{order.period}</span></div>
                  {routes.some(r => r.status === 'EM_MONTAGEM') ? (
                    <div className="grid grid-cols-1 gap-1">
                        {routes.filter(r => r.status === 'EM_MONTAGEM').map(r => (
                            <button key={r.id} onClick={() => addToRoute(order, r.id)} className="w-full bg-blue-50 text-blue-600 py-1 rounded text-xs font-bold hover:bg-blue-100 border border-blue-200">+ Add à {r.id.split('-')[2]}</button>
                        ))}
                    </div>
                  ) : <div className="text-[10px] text-center text-gray-400 italic">Crie uma rota para adicionar</div>}
               </div>
             ))}
          </div>
        </div>
        <div className="col-span-4 bg-gray-100 rounded-xl flex flex-col overflow-hidden border">
          <div className="p-3 bg-white border-b font-bold text-gray-700 flex justify-between items-center">
            <span>Rotas em Montagem</span>
            <button onClick={() => setShowNewRouteModal(true)} className="bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1 hover:bg-blue-700"><Plus size={14}/> Nova</button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
             {routes.filter(r => r.status === 'EM_MONTAGEM').map(route => (
                <div key={route.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                   <div className="p-3 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
                      <div><p className="font-bold text-blue-900">{route.id}</p><p className="text-[10px] text-blue-700">{route.vehicle} • {route.driver}</p></div>
                      <div className="flex gap-1"><button className="p-1 hover:bg-white rounded text-gray-500"><Edit2 size={14}/></button><button className="p-1 hover:bg-white rounded text-red-500"><Trash2 size={14}/></button></div>
                   </div>
                   <div className="p-3">
                      <p className="text-xs font-bold text-gray-500 mb-2 uppercase">Pedidos ({route.orders.length})</p>
                      {route.orders.length === 0 ? <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center text-gray-400 text-xs mb-3">Adicione pedidos</div> : (
                          <div className="space-y-2 mb-3">{route.orders.map((o, idx) => (<div key={o.id} className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded"><span className="font-medium text-gray-700">{idx+1}. {o.client}</span><button onClick={() => { setPendingOrders([...pendingOrders, o]); setRoutes(routes.map(r => r.id === route.id ? {...r, orders: r.orders.filter(ord => ord.id !== o.id), totalVolume: r.totalVolume - o.volume} : r)); }} className="text-red-400 hover:text-red-600"><X size={12}/></button></div>))}</div>
                      )}
                      <div className="bg-gray-50 rounded p-2 mb-3">
                          <div className="flex justify-between text-xs mb-1"><span>Ocupação</span><span className="font-bold">{Math.round((route.totalVolume/route.capacity)*100)}%</span></div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden"><div className={`h-full rounded-full ${route.totalVolume > route.capacity ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${Math.min(100, (route.totalVolume/route.capacity)*100)}%`}}></div></div>
                      </div>
                      <div className="flex gap-2"><button onClick={() => setShowOptimizeModal(true)} className="flex-1 border border-blue-200 text-blue-600 py-1.5 rounded text-xs font-bold hover:bg-blue-50 flex items-center justify-center gap-1"><Map size={12}/> Otimizar</button><button onClick={() => {const updatedRoutes = routes.map(r => r.id === route.id ? {...r, status: 'ATIVA' as const} : r); setRoutes(updatedRoutes); alert(`Rota ${route.id} enviada!`);}} className="flex-1 bg-green-600 text-white py-1.5 rounded text-xs font-bold hover:bg-green-700 flex items-center justify-center gap-1"><CheckCircle size={12}/> Finalizar</button></div>
                   </div>
                </div>
             ))}
          </div>
        </div>
        <div className="col-span-5 bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col">
            <div className="p-3 border-b font-bold text-gray-700">Mapa de Roteirização</div>
            <div className="flex-1 relative">
                <SimulatedMap markers={[...pendingOrders.map(o => ({...o, inRoute: false})), ...routes.flatMap(r => r.orders.map(o => ({...o, inRoute: true})))]} />
            </div>
        </div>
      </div>
      {showNewRouteModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                  <h3 className="font-bold text-lg mb-4">Nova Rota</h3>
                  <div className="space-y-3">
                      <div><label className="text-xs font-bold text-gray-500">Data</label><input type="date" className="w-full border rounded p-2" defaultValue="2026-02-06"/></div>
                      <div><label className="text-xs font-bold text-gray-500">Período</label><select className="w-full border rounded p-2"><option>Manhã</option><option>Tarde</option></select></div>
                      <div><label className="text-xs font-bold text-gray-500">Veículo</label><select className="w-full border rounded p-2"><option>Fiat Ducato (ABC-1234)</option></select></div>
                      <div><label className="text-xs font-bold text-gray-500">Motorista</label><select className="w-full border rounded p-2"><option>Carlos Silva</option></select></div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                      <button onClick={()=>setShowNewRouteModal(false)} className="px-4 py-2 border rounded">Cancelar</button>
                      <button onClick={handleCreateRoute} className="px-4 py-2 bg-blue-600 text-white rounded font-bold">Criar Rota</button>
                  </div>
              </div>
          </div>
      )}
      {showOptimizeModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                  <h3 className="font-bold text-lg mb-2 text-green-700 flex items-center gap-2"><MapPin/> Rota Otimizada!</h3>
                  <p className="text-sm text-gray-600 mb-4">A sequência de entregas foi reorganizada.</p>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-2">
                      <div className="flex justify-between text-sm"><span>Distância Original:</span><span className="text-gray-500 line-through">22.5 km</span></div>
                      <div className="flex justify-between text-sm font-bold text-green-700"><span>Nova Distância:</span><span>18.2 km (-19%)</span></div>
                  </div>
                  <div className="flex justify-end gap-2"><button onClick={()=>setShowOptimizeModal(false)} className="px-4 py-2 border rounded">Manter</button><button onClick={()=>setShowOptimizeModal(false)} className="px-4 py-2 bg-green-600 text-white rounded font-bold">Aplicar</button></div>
              </div>
          </div>
      )}
    </div>
  );
};

// ================= MODULE: ROTAS ATIVAS (LIVE TRACKING) =================

const RotasAtivasModule = () => {
    const [activeRoutes, setActiveRoutes] = useState([
        { id: 'ROTA-2026-0125', driver: 'Carlos Silva', vehicle: 'ABC-1234', progress: 80, status: 'NO_PRAZO', eta: '11:30', next: 'Bar Alegria', completed: 4, total: 5 },
        { id: 'ROTA-2026-0126', driver: 'João Santos', vehicle: 'XYZ-9876', progress: 30, status: 'ATRASADA', eta: '12:15', next: 'Mercado Central', completed: 2, total: 6, delay: '35 min' },
    ]);
    const [selectedRoute, setSelectedRoute] = useState<any>(null);

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <div className="grid grid-cols-5 gap-4 p-4 bg-white border-b shrink-0">
                {[
                    { l: 'Rotas Ativas', v: '8', i: Truck, c: 'text-blue-600' },
                    { l: 'Concluídas', v: '23', i: CheckCircle, c: 'text-green-600' },
                    { l: 'Pendentes', v: '19', i: Clock, c: 'text-yellow-600' },
                    { l: 'Atrasadas', v: '2', i: AlertTriangle, c: 'text-red-600' },
                    { l: 'Em Campo', v: '8', i: Map, c: 'text-purple-600' },
                ].map((k, i) => (
                    <div key={i} className="bg-white p-3 rounded-xl border flex items-center gap-3 shadow-sm">
                        <div className={`p-2 rounded-full bg-gray-50 ${k.c}`}><k.i size={20}/></div>
                        <div><p className="text-xs text-gray-500 uppercase font-bold">{k.l}</p><p className="text-xl font-bold text-gray-800">{k.v}</p></div>
                    </div>
                ))}
            </div>
            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 relative bg-slate-200">
                    <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur p-2 rounded shadow flex gap-2 text-xs font-bold">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"/> No Prazo</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"/> Atrasado</div>
                    </div>
                    <SimulatedMap markers={[{ lat: 30, lng: 40, inRoute: true, status: 'NORMAL' }, { lat: 60, lng: 70, inRoute: true, status: 'URGENTE' }]}/>
                    <div className="absolute top-[30%] left-[40%] bg-blue-600 text-white p-1 rounded shadow-lg text-[10px] font-bold animate-pulse">🚛 Carlos</div>
                    <div className="absolute top-[60%] left-[70%] bg-red-600 text-white p-1 rounded shadow-lg text-[10px] font-bold">🚛 João (Atrasado)</div>
                </div>
                <div className="w-96 bg-white border-l flex flex-col shadow-xl z-10">
                    <div className="p-4 border-b font-bold text-lg flex justify-between items-center bg-gray-50">Rotas em Andamento <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full animate-pulse">Ao Vivo</span></div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {activeRoutes.map(r => (
                            <div key={r.id} className="border rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer bg-white group" onClick={() => setSelectedRoute(r)}>
                                <div className="flex justify-between items-start mb-2"><div><p className="font-bold text-gray-800">{r.id}</p><p className="text-xs text-gray-500">{r.vehicle} • {r.driver}</p></div><StatusBadge status={r.status}/></div>
                                <div className="mb-3"><div className="flex justify-between text-xs mb-1"><span className="text-gray-500">Progresso</span><span className="font-bold">{r.progress}%</span></div><div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden"><div className={`h-full rounded-full transition-all duration-1000 ${r.status === 'ATRASADA' ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${r.progress}%`}}></div></div><p className="text-xs text-center mt-1 text-gray-400">{r.completed} de {r.total} entregas</p></div>
                                <div className="bg-gray-50 rounded p-2 text-xs space-y-1"><div className="flex justify-between"><span className="text-gray-500">Próxima:</span><span className="font-medium">{r.next}</span></div><div className="flex justify-between"><span className="text-gray-500">ETA:</span><span className={`font-bold ${r.status === 'ATRASADA' ? 'text-red-600' : 'text-blue-600'}`}>{r.eta}</span></div></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {selectedRoute && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
                        <div className="p-4 border-b bg-blue-900 text-white flex justify-between items-center">
                            <div><h3 className="font-bold text-lg">{selectedRoute.id}</h3><p className="text-xs text-blue-200">{selectedRoute.driver} • {selectedRoute.vehicle}</p></div>
                            <button onClick={()=>setSelectedRoute(null)} className="hover:bg-blue-800 p-1 rounded"><X size={20}/></button>
                        </div>
                        <div className="p-6 grid grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-bold text-gray-700 mb-4 border-b pb-2">Linha do Tempo</h4>
                                <div className="space-y-4 relative pl-4 border-l-2 border-gray-200 ml-2">
                                    <div className="relative"><div className="absolute -left-[21px] top-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div><p className="text-xs font-bold text-gray-500">08:15</p><p className="text-sm font-bold">Saída do Depósito</p></div>
                                    <div className="relative"><div className="absolute -left-[21px] top-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white animate-pulse"></div><p className="text-xs font-bold text-blue-600">Em Trânsito</p><p className="text-sm font-bold">Bar Alegria</p><p className="text-xs text-gray-500">ETA: {selectedRoute.eta}</p></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-xl"><h5 className="font-bold text-sm mb-2">Vasilhames Recolhidos</h5><div className="flex justify-between text-sm border-b border-gray-200 pb-1 mb-1"><span>Barril 30L</span><span>26 un</span></div><div className="flex justify-between font-bold text-sm mt-2"><span>Total</span><span>26 un</span></div></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ================= MODULE: HISTÓRICO DE ENTREGAS (ANALYTICS) =================

const HistoricoEntregasModule = () => {
    return (
        <div className="flex flex-col h-full bg-gray-50">
            <div className="grid grid-cols-5 gap-4 p-6 border-b bg-white">
                {[
                    { l: 'Entregas (Mês)', v: '342', c: 'text-blue-600', i: Package },
                    { l: 'No Prazo', v: '318', sub: '93% Sucesso', c: 'text-green-600', i: CheckCircle },
                    { l: 'Atrasadas', v: '24', sub: '7% do total', c: 'text-red-600', i: AlertCircle },
                    { l: 'Tempo Médio', v: '32 min', sub: 'por entrega', c: 'text-purple-600', i: Clock },
                    { l: 'Satisfação', v: '4.8', sub: '⭐⭐⭐⭐⭐', c: 'text-yellow-600', i: Star },
                ].map((k, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border shadow-sm flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-2"><span className="text-xs font-bold uppercase text-gray-500">{k.l}</span><k.i size={18} className={k.c}/></div>
                        <div><p className={`text-2xl font-bold ${k.c}`}>{k.v}</p><p className="text-xs text-gray-400 mt-1">{k.sub}</p></div>
                    </div>
                ))}
            </div>
            <div className="p-4 flex justify-between items-center bg-white border-b">
                <div className="flex gap-2">
                    <input type="month" className="border rounded p-2 text-sm" defaultValue="2026-02"/>
                    <select className="border rounded p-2 text-sm"><option>Todos Motoristas</option><option>Carlos Silva</option></select>
                    <select className="border rounded p-2 text-sm"><option>Status: Todos</option><option>Atrasadas</option></select>
                </div>
                <button className="flex items-center gap-2 bg-white border px-3 py-2 rounded text-sm hover:bg-gray-50"><Download size={16}/> Exportar Relatório</button>
            </div>
            <div className="flex-1 overflow-auto p-4">
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b uppercase text-xs text-gray-500"><tr><th className="p-4">ID</th><th className="p-4">Data</th><th className="p-4">Rota</th><th className="p-4">Cliente</th><th className="p-4">Motorista</th><th className="p-4">Chegada</th><th className="p-4">Atraso</th><th className="p-4">Status</th><th className="p-4"></th></tr></thead>
                        <tbody className="divide-y">
                            <tr className="hover:bg-gray-50"><td className="p-4">5042</td><td className="p-4">05/02</td><td className="p-4">ROTA-0125</td><td className="p-4">Bar do Zé</td><td className="p-4">Carlos</td><td className="p-4">09:15</td><td className="p-4 text-green-600">-</td><td className="p-4"><StatusBadge status="ENTREGUE"/></td><td className="p-4"><button className="text-blue-600"><Eye size={16}/></button></td></tr>
                            <tr className="hover:bg-gray-50"><td className="p-4">5041</td><td className="p-4">05/02</td><td className="p-4">ROTA-0125</td><td className="p-4">Mercado Sol</td><td className="p-4">Carlos</td><td className="p-4">09:50</td><td className="p-4 text-red-600 font-bold">+20min</td><td className="p-4"><StatusBadge status="ATRASADA"/></td><td className="p-4"><button className="text-blue-600"><Eye size={16}/></button></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// ================= MODULE: APP MOTORISTA (MOBILE SIMULATION) =================

const AppMotoristaModule = () => {
    const [step, setStep] = useState<'ROUTE' | 'NAV' | 'ARRIVED' | 'CONFIRM'>('ROUTE');
    
    return (
        <div className="flex items-center justify-center h-full bg-gray-200 p-4">
            <div className="w-[375px] h-[750px] bg-white rounded-[40px] shadow-2xl border-[8px] border-gray-800 overflow-hidden flex flex-col relative">
                <div className="absolute top-0 left-0 right-0 h-6 bg-gray-800 rounded-t-[30px] z-20 flex justify-center"><div className="w-20 h-4 bg-black rounded-b-xl"></div></div>
                
                {/* Header */}
                <div className="bg-blue-900 text-white p-6 pt-10 flex justify-between items-center shadow-lg">
                    <div><h2 className="font-bold text-lg">Chopp Harden</h2><p className="text-xs text-blue-200">Olá, Carlos Silva</p></div>
                    <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center border border-blue-400"><User size={20}/></div>
                </div>

                <div className="flex-1 overflow-y-auto bg-gray-50">
                    {step === 'ROUTE' && (
                        <div className="p-4 space-y-4">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                                <h3 className="font-bold text-gray-800 mb-1">Rota de Hoje</h3>
                                <p className="text-sm text-gray-500 mb-3">ROTA-2026-0125 • Manhã</p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-1"><div className="bg-green-500 w-[80%] h-full rounded-full"></div></div>
                                <p className="text-xs text-right text-gray-500">4 de 5 entregas</p>
                            </div>
                            
                            <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-blue-600">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded">PRÓXIMA</span>
                                    <span className="text-xs font-bold text-gray-500">ETA 10:45</span>
                                </div>
                                <h3 className="font-bold text-lg text-gray-800">Bar Alegria</h3>
                                <p className="text-sm text-gray-500 mb-4">Rua das Palmeiras, 88 - Centro</p>
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <div className="bg-gray-50 p-2 rounded text-center"><p className="text-xs text-gray-500">Distância</p><p className="font-bold text-gray-800">2.3 km</p></div>
                                    <div className="bg-gray-50 p-2 rounded text-center"><p className="text-xs text-gray-500">Itens</p><p className="font-bold text-gray-800">8 un</p></div>
                                </div>
                                <button onClick={() => setStep('NAV')} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-blue-700"><Navigation size={20}/> INICIAR ROTA</button>
                            </div>

                            <div className="opacity-50 pointer-events-none bg-white p-4 rounded-xl border">
                                <h3 className="font-bold text-gray-600">Restaurante Sabor</h3>
                                <p className="text-sm text-gray-400">2.8 km • Última entrega</p>
                            </div>
                        </div>
                    )}

                    {step === 'NAV' && (
                        <div className="h-full flex flex-col relative">
                            <div className="flex-1 bg-slate-200 relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center"><Navigation size={64} className="text-blue-500 animate-pulse"/></div>
                                <div className="absolute bottom-8 left-4 right-4 bg-white p-4 rounded-xl shadow-2xl">
                                    <h3 className="font-bold">Em rota para Bar Alegria</h3>
                                    <p className="text-sm text-gray-500">Chegada em 4 min</p>
                                </div>
                            </div>
                            <div className="p-4 bg-white border-t">
                                <button onClick={() => setStep('ARRIVED')} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg">CHEGUEI NO CLIENTE</button>
                            </div>
                        </div>
                    )}

                    {step === 'ARRIVED' && (
                        <div className="p-4 space-y-4">
                            <div className="bg-green-50 border border-green-200 p-4 rounded-xl text-center">
                                <h3 className="font-bold text-green-800 flex items-center justify-center gap-2"><CheckCircle size={20}/> Chegada Confirmada</h3>
                                <p className="text-sm text-green-700">Bar Alegria • 10:48</p>
                            </div>
                            
                            <div className="bg-white p-4 rounded-xl border">
                                <h4 className="font-bold mb-3 border-b pb-2">📦 Confirmar Entrega</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
                                        <div><p className="font-bold text-sm">Chopp Pilsen 30L</p><p className="text-xs text-gray-500">Pedido: 5 un</p></div>
                                        <div className="flex items-center gap-2"><button className="w-6 h-6 bg-gray-200 rounded text-gray-600 font-bold">-</button><span className="font-bold">5</span><button className="w-6 h-6 bg-gray-200 rounded text-gray-600 font-bold">+</button></div>
                                    </div>
                                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
                                        <div><p className="font-bold text-sm">Chopp IPA 30L</p><p className="text-xs text-gray-500">Pedido: 3 un</p></div>
                                        <div className="flex items-center gap-2"><button className="w-6 h-6 bg-gray-200 rounded text-gray-600 font-bold">-</button><span className="font-bold">3</span><button className="w-6 h-6 bg-gray-200 rounded text-gray-600 font-bold">+</button></div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-orange-100">
                                <h4 className="font-bold mb-3 border-b pb-2 flex justify-between"><span>🔄 Recolher Vazios</span> <button className="text-blue-600 text-xs flex items-center gap-1"><QrCode size={14}/> Scan</button></h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
                                        <div><p className="font-bold text-sm">Barril 30L</p><p className="text-xs text-gray-500">Esperado: 8 un</p></div>
                                        <input type="number" className="w-16 text-center border rounded p-1 font-bold" defaultValue={8}/>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => setStep('CONFIRM')} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg">PRÓXIMO</button>
                        </div>
                    )}

                    {step === 'CONFIRM' && (
                        <div className="p-4 space-y-4">
                             <div className="bg-white p-4 rounded-xl border text-center space-y-4">
                                 <h3 className="font-bold">Assinatura do Cliente</h3>
                                 <div className="h-32 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">Assinar aqui</div>
                                 <input className="w-full border p-2 rounded text-sm" placeholder="Nome do Recebedor"/>
                             </div>
                             <div className="bg-white p-4 rounded-xl border text-center space-y-4">
                                 <h3 className="font-bold">Foto do Comprovante</h3>
                                 <button className="w-full py-4 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-200"><Camera className="mb-2"/>Tirar Foto</button>
                             </div>
                             <button onClick={() => setStep('ROUTE')} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg">FINALIZAR ENTREGA</button>
                             <button onClick={() => setStep('ARRIVED')} className="w-full text-gray-500 py-3">Voltar</button>
                        </div>
                    )}

                </div>
                
                {/* Bottom Nav */}
                <div className="bg-white border-t p-4 flex justify-around text-xs font-bold text-gray-400">
                    <div className="flex flex-col items-center text-blue-600"><MapPin size={20}/><span className="mt-1">Rota</span></div>
                    <div className="flex flex-col items-center"><ClipboardList size={20}/><span className="mt-1">Ocorrências</span></div>
                    <div className="flex flex-col items-center"><User size={20}/><span className="mt-1">Perfil</span></div>
                </div>
            </div>
        </div>
    );
};

// ================= MODULES: STOCK & OPERATIONS (Placeholders) =================

const MovimentacaoModule = () => (
  <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-gray-500">
    <ArrowRightLeft size={64} className="mb-4 text-blue-200" />
    <h3 className="text-xl font-bold text-gray-700">Movimentação de Estoque</h3>
    <p className="text-sm">Controle de entradas, saídas e ajustes manuais.</p>
  </div>
);

const TransferenciasModule = () => (
  <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-gray-500">
    <ArrowRight size={64} className="mb-4 text-blue-200" />
    <h3 className="text-xl font-bold text-gray-700">Transferências</h3>
    <p className="text-sm">Gestão de transferências entre depósitos e veículos.</p>
  </div>
);

const InventarioModule = () => (
  <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-gray-500">
    <ClipboardList size={64} className="mb-4 text-blue-200" />
    <h3 className="text-xl font-bold text-gray-700">Inventário Físico</h3>
    <p className="text-sm">Ferramentas para contagem e ajuste de saldo.</p>
  </div>
);

const RelatorioEstoqueModule = () => (
  <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-gray-500">
    <FileText size={64} className="mb-4 text-blue-200" />
    <h3 className="text-xl font-bold text-gray-700">Relatórios de Estoque</h3>
    <p className="text-sm">Análise de giro, cobertura e perdas.</p>
  </div>
);

const EntradaVasilhameModule = () => (
  <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-gray-500">
    <Recycle size={64} className="mb-4 text-blue-200" />
    <h3 className="text-xl font-bold text-gray-700">Entrada de Vasilhame</h3>
    <p className="text-sm">Controle de logística reversa e comodato.</p>
  </div>
);

// ================= CONFIG: UNIVERSAL PAGES =================

const PAGE_CONFIGS: Record<string, PageConfig> = {
  'Clientes': {
    title: 'Gestão de Carteira de Clientes',
    kpis: [
      { label: 'Total Clientes', value: '1.240', sub: '+5% este mês', color: 'text-blue-600', icon: Users, bg: 'bg-blue-50', border: 'border-blue-100' },
      { label: 'Ativos', value: '850', sub: 'Com compra nos últimos 30d', color: 'text-green-600', icon: CheckCircle, bg: 'bg-green-50', border: 'border-green-100' },
      { label: 'Inadimplentes', value: '42', sub: 'R$ 125k em aberto', color: 'text-red-600', icon: AlertTriangle, bg: 'bg-red-50', border: 'border-red-100' },
    ],
    filters: [{ type: 'search', placeholder: 'Buscar por nome, CNPJ...' }, { type: 'select', placeholder: 'Status', options: ['ATIVO', 'INATIVO', 'BLOQUEADO'] }],
    columns: [
      { header: 'Cliente', accessor: 'name' },
      { header: 'Documento', accessor: 'doc' },
      { header: 'Cidade', accessor: 'city' },
      { header: 'Vendedor', accessor: 'seller' },
      { header: 'Status', accessor: 'status', type: 'badge' },
      { header: '', accessor: 'id', type: 'actions' }
    ],
    data: [
      { id: 1, name: 'Boteco do João', doc: '12.345.678/0001-90', city: 'São Paulo', seller: 'Carlos', status: 'ATIVO' },
      { id: 2, name: 'Restaurante Central', doc: '98.765.432/0001-10', city: 'Osasco', seller: 'Maria', status: 'BLOQUEADO' },
      { id: 3, name: 'Mercadinho da Esquina', doc: '45.678.123/0001-55', city: 'São Paulo', seller: 'Carlos', status: 'ATIVO' },
    ],
    formFields: [
      { name: 'name', label: 'Nome Fantasia', type: 'text', required: true },
      { name: 'doc', label: 'CNPJ/CPF', type: 'text', required: true },
      { name: 'city', label: 'Cidade', type: 'text', required: true },
      { name: 'seller', label: 'Vendedor Responsável', type: 'select', options: ['Carlos', 'Maria', 'João'] },
    ]
  },
  'Produtos Líquidos': {
    title: 'Catálogo de Produtos (Chopp & Cervejas)',
    kpis: [
      { label: 'Produtos Ativos', value: '45', color: 'text-amber-600', icon: Beer, bg: 'bg-amber-50', border: 'border-amber-100' },
      { label: 'Estoque Total', value: '25.000 L', color: 'text-blue-600', icon: Database, bg: 'bg-blue-50', border: 'border-blue-100' },
    ],
    filters: [{ type: 'search', placeholder: 'Buscar produto...' }],
    columns: [
      { header: '', accessor: 'name', type: 'image' },
      { header: 'Produto', accessor: 'name' },
      { header: 'SKU', accessor: 'sku' },
      { header: 'Categoria', accessor: 'category' },
      { header: 'Preço Base', accessor: 'price', type: 'currency' },
      { header: 'Status', accessor: 'status', type: 'badge' },
      { header: '', accessor: 'id', type: 'actions' }
    ],
    data: [
      { id: 1, name: 'Chopp Pilsen 50L', sku: 'CHP-PIL-50', category: 'Chopp', price: 450.00, status: 'ATIVO' },
      { id: 2, name: 'Chopp IPA 30L', sku: 'CHP-IPA-30', category: 'Chopp Artesanal', price: 380.00, status: 'ATIVO' },
      { id: 3, name: 'Chopp Vinho 50L', sku: 'CHP-VIN-50', category: 'Chopp Especial', price: 480.00, status: 'INDISPONIVEL' },
    ],
    formFields: [
      { name: 'name', label: 'Nome do Produto', type: 'text', required: true },
      { name: 'sku', label: 'SKU', type: 'text', required: true },
      { name: 'price', label: 'Preço Base', type: 'number', required: true },
    ]
  },
  'Pedidos Distribuidor': {
    title: 'Pedidos de Venda',
    kpis: [],
    filters: [{type: 'search'}, {type: 'date'}],
    columns: [
        { header: 'Pedido', accessor: 'id' },
        { header: 'Cliente', accessor: 'client' },
        { header: 'Valor', accessor: 'value', type: 'currency' },
        { header: 'Data', accessor: 'date', type: 'date' },
        { header: 'Status', accessor: 'status', type: 'badge' },
        { header: '', accessor: 'id', type: 'actions' }
    ],
    data: [
        { id: 'PED-1001', client: 'Boteco do João', value: 1350.00, date: '2024-02-01', status: 'ENTREGUE' },
        { id: 'PED-1002', client: 'Mercadinho da Esquina', value: 900.00, date: '2024-02-02', status: 'PENDENTE' },
        { id: 'PED-1003', client: 'Restaurante Central', value: 450.00, date: '2024-02-02', status: 'CANCELADO' },
    ],
    formFields: []
  }
};

// ================= MAIN APP COMPONENT =================

const SidebarItem = ({ icon: Icon, label, active, onClick, hasSubItems = false }: any) => (
  <div onClick={onClick} className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-200 ${active ? 'bg-blue-800 text-white border-l-4 border-yellow-500 shadow-lg' : 'text-blue-100 hover:bg-blue-800/50 hover:text-white'}`}>
    <div className="flex items-center gap-3"><Icon size={20} className={active ? "text-yellow-400" : ""}/><span className="text-sm font-medium">{label}</span></div>
    {hasSubItems && <ChevronDown size={16} className={`transform transition-transform ${active ? 'rotate-180 text-yellow-400' : ''}`} />}
  </div>
);

const SubMenuItem = ({ label, active, onClick }: any) => (
  <div onClick={onClick} className={`pl-12 pr-4 py-2 text-sm cursor-pointer transition-colors flex items-center gap-2 ${active ? 'text-yellow-400 font-medium bg-blue-900/50' : 'text-blue-200 hover:text-white'}`}>
    {active && <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"/>}
    {label}
  </div>
);

const App = () => {
  const [activeCategory, setActiveCategory] = useState('LOGÍSTICA');
  const [activeTab, setActiveTab] = useState('Roteirização');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const categories = [
    { title: 'CONFIGURAÇÕES DO SISTEMA', icon: Settings, tabs: ['Empresas', 'Usuários & Permissões', 'Categorias Financeiras', 'Centros de Custo', 'Parâmetros Gerais'] },
    { title: 'CADASTROS', icon: Database, tabs: ['Clientes', 'Fornecedores', 'Produtos Líquidos', 'Ativos (Vasilhames)', 'Equipamentos', 'Veículos', 'Tabelas de Preço'] },
    { title: 'VENDAS', icon: ShoppingCart, tabs: ['Pedidos Distribuidor', 'Pedidos PDV', 'Histórico de Vendas'] },
    { title: 'ESTOQUE & COMPRAS', icon: Box, tabs: ['Pedidos de Compra', 'Recebimento', 'Movimentação', 'Transferências', 'Inventário', 'Relatório de Estoque', 'Entrada de Vasilhame'] },
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
    // 1. Check for Specialized Custom Modules
    if (activeTab === 'Movimentação') return <MovimentacaoModule />;
    if (activeTab === 'Transferências') return <TransferenciasModule />;
    if (activeTab === 'Inventário') return <InventarioModule />;
    if (activeTab === 'Relatório de Estoque') return <RelatorioEstoqueModule />;
    if (activeTab === 'Entrada de Vasilhame') return <EntradaVasilhameModule />;
    
    // LOGISTICS TABS
    if (activeTab === 'Roteirização') return <RoteirizacaoModule />;
    if (activeTab === 'Rotas Ativas') return <RotasAtivasModule />;
    if (activeTab === 'Histórico') return <HistoricoEntregasModule />;
    if (activeTab === 'App Motorista') return <AppMotoristaModule />;

    // 2. Check for Universal Page Configuration
    const config = PAGE_CONFIGS[activeTab];
    if (config) {
      return <UniversalPage config={config} />;
    }

    // 3. Fallback for tabs without config yet
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