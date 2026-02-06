"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import gsap from "gsap"
import { HeroAnimation } from "../components/Animacoes/HeroAnimation"
import { Calendario } from "../components/Calendario/Calendario"
import { Header } from "../components/Layout/Header"
import { Footer } from "../components/Layout/Footer"
import { CONFIG } from "../config/config"
import { useConfig } from "../hooks/useConfig"
import { useAgendamentos } from "../hooks/useAgendamentos"
import { parseLocalDate } from "../utils/dateUtils"

export const Home: React.FC = () => {
  const navigate = useNavigate()
  const { config } = useConfig()
  const { 
    contarAgendamentosPorHorario, 
    agendamentos, 
    obterVagasRestantes,
    limiteVagas,
    limiteTotalCampanha,
    totalGlobal
  } = useAgendamentos()
  const [dataSelecionada, setDataSelecionada] = useState<string | null>(null)
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)

  const handleSelecionarData = (data: string) => {
    setDataSelecionada(data)
    setHorarioSelecionado(null)
  }

  const handleAgendar = () => {
    if (dataSelecionada && horarioSelecionado) {
      navigate(`/confirmacao?data=${dataSelecionada}&horario=${horarioSelecionado}`)
    }
  }

  const scrollToCalendar = () => {
    if (calendarRef.current) {
      calendarRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  useEffect(() => {
    if (dataSelecionada && ctaRef.current) {
      gsap.fromTo(
        ctaRef.current,
        { scale: 0.98, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" },
      )

      gsap.to(ctaRef.current, {
        boxShadow: "0 20px 50px rgba(34, 197, 94, 0.3)",
        duration: 0.5,
        ease: "power2.out",
      })

      ctaRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }, [dataSelecionada])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <HeroAnimation
            titulo="Agendamento de RG - Prefeitura de Patrocínio-MG"
            subtitulo={`Agende sua emissão de RG de forma rápida e prática. Sistema com limite de ${config.limiteVagasPorDia} atendimentos por dia.`}
          />



          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-4xl mx-auto shadow-xl border border-white/20">
            <h3 className="text-white text-lg font-semibold mb-6 opacity-90">Capacidade do Sistema</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-4xl font-bold">{config.limiteVagasPorDia}</div>
                  <div className="text-sm opacity-90 text-center">Vagas por dia</div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                      />
                    </svg>
                  </div>
                  <div className="text-4xl font-bold">1-{config.limiteVagasPorDia}</div>
                  <div className="text-sm opacity-90 text-center">Senhas disponíveis</div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="text-4xl font-bold">
                    {dataSelecionada ? parseLocalDate(dataSelecionada).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) : "--/--"}
                  </div>
                  <div className="text-sm opacity-90 text-center">Data Selecionada</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={scrollToCalendar}
              className="group inline-flex items-center gap-3 bg-white text-green-700 px-8 py-4 rounded-full hover:bg-green-50 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Ver Calendário de Agendamento
              <svg
                className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div ref={calendarRef} className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Selecione uma Data</h2>
              </div>
              <Calendario aoSelecionarData={handleSelecionarData} />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Informações</h3>
              </div>

              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Horário de Funcionamento</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {CONFIG.INFORMACOES_PREFEITURA.horarioFuncionamento}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Endereço</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{CONFIG.INFORMACOES_PREFEITURA.endereco}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Telefone</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{CONFIG.INFORMACOES_PREFEITURA.telefone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              ref={ctaRef}
              className={`bg-white rounded-2xl shadow-xl p-6 lg:p-8 transition-all duration-500 ${
                dataSelecionada ? "ring-4 ring-green-500 ring-opacity-50" : ""
              }`}
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    dataSelecionada ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  <svg
                    className={`w-6 h-6 transition-colors duration-300 ${
                      dataSelecionada ? "text-green-600" : "text-gray-400"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {dataSelecionada ? "Confirmar Agendamento" : "Próximo Passo"}
                </h3>
              </div>

              {!dataSelecionada && (
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3 text-gray-600">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold text-sm mt-0.5">
                      1
                    </div>
                    <p className="text-sm leading-relaxed">
                      Selecione um <strong>dia disponível</strong> no calendário acima
                    </p>
                  </div>
                  <div className="flex items-start gap-3 text-gray-600">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold text-sm mt-0.5">
                      2
                    </div>
                    <p className="text-sm leading-relaxed">
                      Clique no botão <strong className="text-green-600">"Agendar para este dia"</strong>
                    </p>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-800 flex items-start gap-2">
                      <svg
                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Dias esgotados ou fora do período aparecem desabilitados</span>
                    </p>
                  </div>
                </div>
              )}

              {dataSelecionada && (
                <>
                  <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <div>
                        <p className="text-xs text-green-700 font-medium uppercase tracking-wide">Data Selecionada</p>
                        <p className="text-lg font-bold text-green-900">
                          {new Date(dataSelecionada + 'T12:00:00').toLocaleDateString("pt-BR", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Selecione um Horário
                    </h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {config.horariosAtendimento?.map((horario) => {
                        const ocupacao = dataSelecionada ? contarAgendamentosPorHorario(dataSelecionada, horario) : 0
                        const capacidade = config.capacidadePorHorario?.[horario]
                        const lotado = capacidade !== undefined && ocupacao >= capacidade
                        const quaseLotado = capacidade !== undefined && ocupacao >= Math.max(1, Math.floor(capacidade * 0.8)) && !lotado
                        const disabled = !dataSelecionada || lotado
                        return (
                          <button
                            key={horario}
                            onClick={() => !disabled && setHorarioSelecionado(horario)}
                            disabled={disabled}
                            className={`py-2 px-1 rounded-lg text-sm font-medium transition-all duration-200 border flex items-center justify-between ${
                              disabled
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                : horarioSelecionado === horario
                                  ? "bg-green-600 text-white border-green-600 shadow-md scale-105 ring-2 ring-green-300 ring-offset-1"
                                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                            }`}
                            title={
                              capacidade !== undefined
                                ? lotado
                                  ? "Horário lotado, escolha outro"
                                  : `Ocupação: ${ocupacao}/${capacidade}`
                                : undefined
                            }
                          >
                            <span>{horario}</span>
                            {capacidade !== undefined && (
                              <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs ${
                                lotado ? "bg-red-100 text-red-700 border border-red-200" : quaseLotado ? "bg-yellow-100 text-yellow-700 border border-yellow-200" : "bg-green-100 text-green-700 border border-green-200"
                              }`}>
                                {ocupacao}/{capacidade}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}

              <button
                onClick={handleAgendar}
                disabled={!dataSelecionada || !horarioSelecionado}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg focus:outline-none focus:ring-4 transition-all duration-300 flex items-center justify-center gap-3 ${
                  dataSelecionada && horarioSelecionado
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 focus:ring-green-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {dataSelecionada && horarioSelecionado ? (
                  <>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Confirmar Agendamento
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    {!dataSelecionada ? "Selecione uma data" : "Selecione um horário"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      {/* PAINEL DE DEBUG TEMPORÁRIO - REMOVER DEPOIS - BUILD 06/02 16:XX */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 text-white p-2 text-xs z-50 font-mono border-t border-white/20">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 justify-center items-center">
          <div className="flex flex-col">
            <span className="text-gray-400">Limite Diário (Config)</span>
            <span className="font-bold text-green-400">{limiteVagas}</span>
          </div>
          <div className="h-8 w-px bg-white/20"></div>
          <div className="flex flex-col">
            <span className="text-gray-400">Limite Global (Config)</span>
            <span className="font-bold text-blue-400">{limiteTotalCampanha}</span>
          </div>
          <div className="h-8 w-px bg-white/20"></div>
          <div className="flex flex-col">
            <span className="text-gray-400">Total Global (Real)</span>
            <span className="font-bold text-yellow-400">{totalGlobal}</span>
          </div>
          <div className="h-8 w-px bg-white/20"></div>
          <div className="flex flex-col">
            <span className="text-gray-400">Agendamentos 14/02</span>
            <span className="font-bold text-red-400">{agendamentos.filter(a => a.dataAgendamento === '2026-02-14').length}</span>
          </div>
          <div className="h-8 w-px bg-white/20"></div>
          <div className="flex flex-col">
            <span className="text-gray-400">Vagas Restantes 14/02</span>
            <span className="font-bold text-white">{obterVagasRestantes('2026-02-14')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
