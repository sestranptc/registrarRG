"use client"

import React, { useState, useMemo } from 'react'
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Settings, 
  LogOut, 
  Users, 
  CheckCircle2, 
  X, 
  Plus, 
  Trash2,
  Search,
  Menu,
  ChevronRight,
  Shield,
  UserCheck,
  AlertCircle,
  FileText,
  Tags,
  Phone,
  Mail,
  Hash,
  ChevronDown,
  Sparkles,
  TrendingUp,
  CalendarDays
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Tab = 'agendamentos' | 'configuracoes'

type Agendamento = {
  id: string
  nome: string
  cpf: string
  telefone: string
  email: string
  horario: string
  dataAgendamento: string
  senha: number
  compareceu: boolean
}

// Mock data for demonstration
const mockAgendamentos: Agendamento[] = [
  { id: '1', nome: 'Maria Silva Santos', cpf: '123.456.789-00', telefone: '(11) 99999-1234', email: 'maria@email.com', horario: '08:00', dataAgendamento: '2026-02-03', senha: 1, compareceu: true },
  { id: '2', nome: 'João Pedro Oliveira', cpf: '987.654.321-00', telefone: '(11) 98888-5678', email: 'joao@email.com', horario: '08:30', dataAgendamento: '2026-02-03', senha: 2, compareceu: true },
  { id: '3', nome: 'Ana Carolina Ferreira', cpf: '456.789.123-00', telefone: '(11) 97777-9012', email: 'ana@email.com', horario: '09:00', dataAgendamento: '2026-02-03', senha: 3, compareceu: false },
  { id: '4', nome: 'Carlos Eduardo Lima', cpf: '321.654.987-00', telefone: '(11) 96666-3456', email: 'carlos@email.com', horario: '09:30', dataAgendamento: '2026-02-03', senha: 4, compareceu: false },
  { id: '5', nome: 'Beatriz Almeida Costa', cpf: '789.123.456-00', telefone: '(11) 95555-7890', email: 'beatriz@email.com', horario: '10:00', dataAgendamento: '2026-02-03', senha: 5, compareceu: false },
]

const mockConfig = {
  horariosAtendimento: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00'],
  feriados: ['2026-02-16', '2026-02-17', '2026-04-21'],
  limiteVagasPorDia: 50,
  categorias: [
    { id: '1', nome: 'Idoso', idadeMin: 60, idadeMax: 120 },
    { id: '2', nome: 'Criança', idadeMin: 0, idadeMax: 12 },
  ],
  capacidadePorHorario: {} as Record<string, number>,
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('agendamentos')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [agendamentos, setAgendamentos] = useState(mockAgendamentos)
  
  // Agendamentos State
  const [dataFiltro, setDataFiltro] = useState(new Date().toISOString().split('T')[0])
  const [mostrarTodos, setMostrarTodos] = useState(false)
  const [termoBusca, setTermoBusca] = useState('')
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  // Config State
  const [config, setConfig] = useState(mockConfig)
  const [novoHorario, setNovoHorario] = useState('')
  const [novoFeriado, setNovoFeriado] = useState('')
  const [novaCategoria, setNovaCategoria] = useState({ nome: '', idadeMin: '', idadeMax: '' })

  // Derived State
  const agendamentosDoDia = useMemo(() => {
    if (mostrarTodos) return agendamentos
    return agendamentos.filter(ag => ag.dataAgendamento === dataFiltro)
  }, [agendamentos, dataFiltro, mostrarTodos])

  const agendamentosFiltrados = useMemo(() => {
    return agendamentosDoDia.filter(ag => 
      ag.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      ag.cpf.includes(termoBusca)
    ).sort((a, b) => a.horario.localeCompare(b.horario))
  }, [agendamentosDoDia, termoBusca])

  const compareceram = agendamentosDoDia.filter(ag => ag.compareceu).length
  const taxaComparecimento = agendamentosDoDia.length ? Math.round((compareceram / agendamentosDoDia.length) * 100) : 0

  const toggleCompareceu = (id: string) => {
    setAgendamentos(prev => prev.map(ag => 
      ag.id === id ? { ...ag, compareceu: !ag.compareceu } : ag
    ))
  }

  const adicionarHorario = (horario: string) => {
    if (!config.horariosAtendimento.includes(horario)) {
      setConfig(prev => ({
        ...prev,
        horariosAtendimento: [...prev.horariosAtendimento, horario].sort()
      }))
    }
  }

  const removerHorario = (horario: string) => {
    setConfig(prev => ({
      ...prev,
      horariosAtendimento: prev.horariosAtendimento.filter(h => h !== horario)
    }))
  }

  const adicionarFeriado = (feriado: string) => {
    if (!config.feriados.includes(feriado)) {
      setConfig(prev => ({
        ...prev,
        feriados: [...prev.feriados, feriado].sort()
      }))
    }
  }

  const removerFeriado = (feriado: string) => {
    setConfig(prev => ({
      ...prev,
      feriados: prev.feriados.filter(f => f !== feriado)
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50/30 flex font-sans text-slate-800">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-slate-900 text-white flex-shrink-0 transition-all duration-500 ease-out flex flex-col fixed md:relative z-30 h-full",
          sidebarOpen ? 'w-72' : 'w-20'
        )}
      >
        {/* Logo Area */}
        <div className="p-6 border-b border-slate-800/50">
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Admin RG</h2>
                  <p className="text-slate-400 text-xs">Painel Gerencial</p>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            )}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-6 px-3 space-y-1">
          <p className={cn("text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-3 px-4 transition-opacity", !sidebarOpen && "opacity-0")}>
            Menu Principal
          </p>
          
          <NavButton 
            active={activeTab === 'agendamentos'}
            onClick={() => setActiveTab('agendamentos')}
            icon={<Users className="w-5 h-5" />}
            label="Agendamentos"
            sidebarOpen={sidebarOpen}
            badge={agendamentosDoDia.length}
          />

          <NavButton 
            active={activeTab === 'configuracoes'}
            onClick={() => setActiveTab('configuracoes')}
            icon={<Settings className="w-5 h-5" />}
            label="Configurações"
            sidebarOpen={sidebarOpen}
          />
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800/50">
          <button
            className={cn(
              "w-full flex items-center px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200",
              !sidebarOpen && 'justify-center'
            )}
          >
            <LogOut className={cn("w-5 h-5", sidebarOpen && "mr-3")} />
            {sidebarOpen && <span className="font-medium">Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn("flex-1 overflow-y-auto transition-all duration-500", sidebarOpen ? 'ml-0' : 'ml-0')}>
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          {activeTab === 'agendamentos' ? (
            <div className="space-y-8">
              {/* Header */}
              <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-400 rounded-full" />
                    <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
                      Agendamentos
                    </h1>
                  </div>
                  <p className="text-slate-500 ml-5">Gerencie presenças e acompanhe o fluxo de atendimento</p>
                </div>
                
                {/* Date Picker Card */}
                <div className="flex items-center gap-3 bg-white p-1.5 pl-4 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md hover:border-slate-300 transition-all duration-300 group">
                  <CalendarIcon className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                  <div className="flex flex-col pr-2">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Visualizando</span>
                    {!mostrarTodos ? (
                      <input
                        type="date"
                        value={dataFiltro}
                        onChange={(e) => setDataFiltro(e.target.value)}
                        className="outline-none text-slate-800 font-semibold bg-transparent cursor-pointer text-sm"
                      />
                    ) : (
                      <span className="text-slate-800 font-semibold text-sm">Todos os registros</span>
                    )}
                  </div>
                  <button 
                    onClick={() => setMostrarTodos(!mostrarTodos)}
                    className={cn(
                      "px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300",
                      mostrarTodos 
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    )}
                  >
                    {mostrarTodos ? 'Filtrar' : 'Ver Todos'}
                  </button>
                </div>
              </header>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <StatCard 
                  icon={<Users className="w-6 h-6" />}
                  iconBg="bg-blue-500"
                  label="Total Agendado"
                  value={agendamentosDoDia.length}
                  sublabel={`Para ${new Date(dataFiltro).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}`}
                />
                <StatCard 
                  icon={<UserCheck className="w-6 h-6" />}
                  iconBg="bg-emerald-500"
                  label="Compareceram"
                  value={compareceram}
                  progress={taxaComparecimento}
                  sublabel={`${taxaComparecimento}% de presença`}
                />
                <StatCard 
                  icon={<AlertCircle className="w-6 h-6" />}
                  iconBg="bg-amber-500"
                  label="Pendentes"
                  value={agendamentosDoDia.length - compareceram}
                  sublabel="Aguardando chegada"
                />
              </div>

              {/* Search & Actions Bar */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-96">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar por nome ou CPF..."
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-sm shadow-sm placeholder:text-slate-400"
                  />
                  {termoBusca && (
                    <button 
                      onClick={() => setTermoBusca('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  )}
                </div>
                
                <button
                  className="flex items-center gap-2.5 px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-semibold shadow-sm group"
                >
                  <FileText className="w-4 h-4 text-slate-500 group-hover:text-blue-500 transition-colors" />
                  Exportar PDF
                </button>
              </div>

              {/* Cards List */}
              <div className="space-y-4">
                {agendamentosFiltrados.length === 0 ? (
                  <EmptyState search={termoBusca} />
                ) : (
                  agendamentosFiltrados.map((ag, index) => (
                    <AgendamentoCard 
                      key={ag.id}
                      agendamento={ag}
                      index={index}
                      expanded={expandedCard === ag.id}
                      onToggleExpand={() => setExpandedCard(expandedCard === ag.id ? null : ag.id)}
                      onToggleCompareceu={() => toggleCompareceu(ag.id)}
                    />
                  ))
                )}
              </div>
            </div>
          ) : (
            <ConfiguracoesTab 
              config={config}
              novoHorario={novoHorario}
              setNovoHorario={setNovoHorario}
              adicionarHorario={adicionarHorario}
              removerHorario={removerHorario}
              novoFeriado={novoFeriado}
              setNovoFeriado={setNovoFeriado}
              adicionarFeriado={adicionarFeriado}
              removerFeriado={removerFeriado}
              novaCategoria={novaCategoria}
              setNovaCategoria={setNovaCategoria}
              setConfig={setConfig}
            />
          )}
        </div>
      </main>
    </div>
  )
}

// Components

function NavButton({ active, onClick, icon, label, sidebarOpen, badge }: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  sidebarOpen: boolean
  badge?: number
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 group relative",
        active 
          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/30' 
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
      )}
    >
      <span className={cn(sidebarOpen ? '' : 'mx-auto')}>{icon}</span>
      {sidebarOpen && (
        <>
          <span className="ml-3 font-medium">{label}</span>
          {badge !== undefined && (
            <span className={cn(
              "ml-auto px-2 py-0.5 text-xs font-bold rounded-full",
              active ? "bg-white/20 text-white" : "bg-slate-700 text-slate-300"
            )}>
              {badge}
            </span>
          )}
          {active && <ChevronRight className="w-4 h-4 ml-2 opacity-60" />}
        </>
      )}
    </button>
  )
}

function StatCard({ icon, iconBg, label, value, sublabel, progress }: {
  icon: React.ReactNode
  iconBg: string
  label: string
  value: number
  sublabel: string
  progress?: number
}) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-slate-300/80 transition-all duration-300 group cursor-default">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-3 rounded-2xl text-white shadow-lg", iconBg, `shadow-${iconBg.replace('bg-', '')}/30`)}>
          {icon}
        </div>
        <TrendingUp className="w-5 h-5 text-slate-300 group-hover:text-emerald-400 transition-colors" />
      </div>
      <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
      <p className="text-4xl font-bold text-slate-900 tracking-tight mb-1">{value}</p>
      {progress !== undefined && (
        <div className="w-full bg-slate-100 h-1.5 mt-3 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <p className="text-xs text-slate-400 mt-2">{sublabel}</p>
    </div>
  )
}

function AgendamentoCard({ agendamento, index, expanded, onToggleExpand, onToggleCompareceu }: {
  agendamento: Agendamento
  index: number
  expanded: boolean
  onToggleExpand: () => void
  onToggleCompareceu: () => void
}) {
  const initials = agendamento.nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
  
  return (
    <div 
      className={cn(
        "bg-white rounded-2xl border transition-all duration-300 overflow-hidden",
        agendamento.compareceu 
          ? "border-emerald-200 shadow-emerald-100 shadow-sm" 
          : "border-slate-200 hover:border-slate-300 hover:shadow-md"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Main Row */}
      <div className="p-5 flex items-center gap-4">
        {/* Avatar */}
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0 transition-all duration-300",
          agendamento.compareceu 
            ? "bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-emerald-500/30" 
            : "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/30"
        )}>
          {initials}
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-slate-900 truncate">{agendamento.nome}</h3>
            {agendamento.compareceu && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                Presente
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 font-mono mt-0.5">CPF: {agendamento.cpf}</p>
        </div>

        {/* Time Badge */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl">
          <Clock className="w-4 h-4 text-slate-500" />
          <span className="font-bold text-slate-700">{agendamento.horario}</span>
        </div>

        {/* Ticket Number */}
        <div className="hidden sm:flex flex-col items-center px-4 py-2 bg-blue-50 rounded-xl">
          <span className="text-[10px] uppercase tracking-wide text-blue-500 font-semibold">Senha</span>
          <span className="font-bold text-blue-700 text-lg">#{agendamento.senha}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleCompareceu}
            className={cn(
              "px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2",
              agendamento.compareceu 
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600" 
                : "bg-slate-100 text-slate-600 hover:bg-blue-500 hover:text-white hover:shadow-lg hover:shadow-blue-500/30"
            )}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span className="hidden lg:inline">{agendamento.compareceu ? 'Confirmado' : 'Confirmar'}</span>
          </button>
          
          <button 
            onClick={onToggleExpand}
            className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform duration-300", expanded && "rotate-180")} />
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      <div className={cn(
        "grid transition-all duration-300 ease-out",
        expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      )}>
        <div className="overflow-hidden">
          <div className="px-5 pb-5 pt-2 border-t border-slate-100">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <DetailItem icon={<Clock />} label="Horário" value={agendamento.horario} />
              <DetailItem icon={<Hash />} label="Senha" value={`#${agendamento.senha}`} />
              <DetailItem icon={<Phone />} label="Telefone" value={agendamento.telefone} />
              <DetailItem icon={<Mail />} label="Email" value={agendamento.email} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
      <div className="text-slate-400 [&>svg]:w-4 [&>svg]:h-4">{icon}</div>
      <div>
        <p className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">{label}</p>
        <p className="text-sm font-semibold text-slate-700 truncate">{value}</p>
      </div>
    </div>
  )
}

function EmptyState({ search }: { search: string }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <CalendarDays className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">Nenhum agendamento encontrado</h3>
      <p className="text-slate-500 text-sm max-w-sm mx-auto">
        {search 
          ? `Não encontramos resultados para "${search}". Tente outro termo.`
          : 'Não há agendamentos para esta data. Selecione outra data ou visualize todos os registros.'
        }
      </p>
    </div>
  )
}

function ConfiguracoesTab({ config, novoHorario, setNovoHorario, adicionarHorario, removerHorario, novoFeriado, setNovoFeriado, adicionarFeriado, removerFeriado, novaCategoria, setNovaCategoria, setConfig }: {
  config: typeof mockConfig
  novoHorario: string
  setNovoHorario: (v: string) => void
  adicionarHorario: (h: string) => void
  removerHorario: (h: string) => void
  novoFeriado: string
  setNovoFeriado: (v: string) => void
  adicionarFeriado: (f: string) => void
  removerFeriado: (f: string) => void
  novaCategoria: { nome: string; idadeMin: string; idadeMax: string }
  setNovaCategoria: React.Dispatch<React.SetStateAction<{ nome: string; idadeMin: string; idadeMax: string }>>
  setConfig: React.Dispatch<React.SetStateAction<typeof mockConfig>>
}) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-8 bg-gradient-to-b from-violet-500 to-purple-400 rounded-full" />
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">Configurações</h1>
        </div>
        <p className="text-slate-500 ml-5">Personalize horários, feriados e parâmetros do sistema</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Horários */}
        <ConfigCard 
          icon={<Clock />}
          iconBg="bg-blue-500"
          title="Horários de Atendimento"
          description="Defina os horários disponíveis para agendamento"
        >
          <div className="flex gap-3 mb-5">
            <input
              type="time"
              value={novoHorario}
              onChange={(e) => setNovoHorario(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all"
            />
            <button
              onClick={() => {
                if (novoHorario) {
                  adicionarHorario(novoHorario)
                  setNovoHorario('')
                }
              }}
              className="bg-blue-500 text-white px-4 py-3 rounded-xl hover:bg-blue-600 active:scale-95 transition-all shadow-lg shadow-blue-500/25"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {config.horariosAtendimento.map((horario) => (
              <span key={horario} className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-blue-50 border border-blue-100 text-blue-700 group hover:border-blue-200 transition-colors">
                {horario}
                <button
                  onClick={() => removerHorario(horario)}
                  className="ml-2 text-blue-400 hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-red-50"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </ConfigCard>

        {/* Feriados */}
        <ConfigCard 
          icon={<CalendarIcon />}
          iconBg="bg-red-500"
          title="Dias Bloqueados"
          description="Adicione feriados ou dias sem expediente"
        >
          <div className="flex gap-3 mb-5">
            <input
              type="date"
              value={novoFeriado}
              onChange={(e) => setNovoFeriado(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:ring-2 focus:ring-red-500/20 focus:border-red-400 outline-none transition-all"
            />
            <button
              onClick={() => {
                if (novoFeriado) {
                  adicionarFeriado(novoFeriado)
                  setNovoFeriado('')
                }
              }}
              className="bg-red-500 text-white px-4 py-3 rounded-xl hover:bg-red-600 active:scale-95 transition-all shadow-lg shadow-red-500/25"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-2 max-h-[240px] overflow-y-auto">
            {config.feriados.map((feriado) => (
              <div key={feriado} className="flex justify-between items-center p-3 bg-red-50 border border-red-100 rounded-xl group hover:border-red-200 transition-all">
                <span className="text-slate-700 font-medium flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  {new Date(feriado + 'T12:00:00').toLocaleDateString('pt-BR', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
                <button
                  onClick={() => removerFeriado(feriado)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-100 rounded-lg opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </ConfigCard>

        {/* Parâmetros Gerais */}
        <ConfigCard 
          icon={<Shield />}
          iconBg="bg-violet-500"
          title="Parâmetros Gerais"
          description="Configurações globais do sistema"
        >
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Limite de Vagas por Dia
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={config.limiteVagasPorDia}
                onChange={(e) => setConfig(prev => ({ ...prev, limiteVagasPorDia: Number(e.target.value) }))}
                className="w-28 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-2xl font-bold text-slate-800 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none transition-all text-center"
              />
              <span className="text-slate-500 text-sm">vagas disponíveis por dia</span>
            </div>
          </div>
        </ConfigCard>

        {/* Categorias */}
        <ConfigCard 
          icon={<Tags />}
          iconBg="bg-indigo-500"
          title="Categorias de Público"
          description="Defina faixas etárias e grupos prioritários"
        >
          <div className="space-y-3 mb-5">
            <input
              type="text"
              placeholder="Nome da categoria (ex: Idoso)"
              value={novaCategoria.nome}
              onChange={(e) => setNovaCategoria(prev => ({ ...prev, nome: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
            />
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Idade mín"
                value={novaCategoria.idadeMin}
                onChange={(e) => setNovaCategoria(prev => ({ ...prev, idadeMin: e.target.value }))}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              <input
                type="number"
                placeholder="Idade máx"
                value={novaCategoria.idadeMax}
                onChange={(e) => setNovaCategoria(prev => ({ ...prev, idadeMax: e.target.value }))}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              <button
                onClick={() => {
                  if (novaCategoria.nome && novaCategoria.idadeMin && novaCategoria.idadeMax) {
                    setConfig(prev => ({
                      ...prev,
                      categorias: [...prev.categorias, {
                        id: `cat_${Date.now()}`,
                        nome: novaCategoria.nome,
                        idadeMin: Number(novaCategoria.idadeMin),
                        idadeMax: Number(novaCategoria.idadeMax)
                      }]
                    }))
                    setNovaCategoria({ nome: '', idadeMin: '', idadeMax: '' })
                  }
                }}
                className="bg-indigo-500 text-white px-4 py-3 rounded-xl hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/25"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            {config.categorias.map((cat) => (
              <div key={cat.id} className="flex justify-between items-center p-3 bg-indigo-50 border border-indigo-100 rounded-xl group hover:border-indigo-200 transition-all">
                <div>
                  <p className="font-semibold text-slate-700">{cat.nome}</p>
                  <p className="text-xs text-slate-500">{cat.idadeMin} a {cat.idadeMax} anos</p>
                </div>
                <button
                  onClick={() => setConfig(prev => ({
                    ...prev,
                    categorias: prev.categorias.filter(c => c.id !== cat.id)
                  }))}
                  className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </ConfigCard>
      </div>
    </div>
  )
}

function ConfigCard({ icon, iconBg, title, description, children }: {
  icon: React.ReactNode
  iconBg: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className={cn("p-3 rounded-2xl text-white shadow-lg [&>svg]:w-5 [&>svg]:h-5", iconBg)}>
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      </div>
      {children}
    </div>
  )
}
