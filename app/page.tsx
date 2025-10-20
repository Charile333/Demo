'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'

interface Alert {
  symbol: string
  type: string
  message: string
  timestamp: string
}

function Landing() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const wsRef = useRef<WebSocket | null>(null)
  const wsReconnectIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    loadAlerts()
    connectWebSocket()
    refreshIntervalRef.current = setInterval(loadAlerts, 10000)
    
    return () => {
      if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
        wsRef.current.close()
      }
      if (wsReconnectIntervalRef.current) {
        clearInterval(wsReconnectIntervalRef.current)
      }
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [])

  const connectWebSocket = () => {
    try {
      if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
        wsRef.current.close()
      }
      console.log('Connecting to WebSocket server at ws://localhost:3001')
      const wsUrl = `ws://localhost:3001`
      wsRef.current = new WebSocket(wsUrl)

      wsRef.current.onopen = () => {
        console.log('WebSocket connection established')
        if (wsReconnectIntervalRef.current) {
          clearInterval(wsReconnectIntervalRef.current)
          wsReconnectIntervalRef.current = null
        }
      }

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === 'alert' && data.data) {
            displayNewAlert(data.data)
          } else if (data.type === 'welcome') {
            console.log('Welcome message from server:', data.message)
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      wsRef.current.onerror = (error) => {
        // Silently handle WebSocket errors when backend is not running
        // console.error('WebSocket error:', error)
      }

      wsRef.current.onclose = () => {
        // console.log('WebSocket connection closed')
        if (!wsReconnectIntervalRef.current) {
          wsReconnectIntervalRef.current = setInterval(connectWebSocket, 5000)
          // console.log('Will attempt to reconnect in 5 seconds')
        }
      }
    } catch (error) {
      // console.error('Error connecting to WebSocket:', error)
      if (!wsReconnectIntervalRef.current) {
        wsReconnectIntervalRef.current = setInterval(connectWebSocket, 5000)
        // console.log('Will attempt to reconnect in 5 seconds')
      }
    }
  }

  const displayNewAlert = (alert: Alert) => {
    if (!alert || !alert.symbol || !alert.message) return
    const symbol = (alert.symbol || '').toUpperCase()
    if (symbol !== 'BTCUSDT' && symbol !== 'ETHUSDT') return

    const validAlert: Alert = {
      symbol: alert.symbol,
      type: alert.type || 'price_jump',
      message: alert.message,
      timestamp: alert.timestamp || new Date().toISOString().slice(0, 19)
    }

    setAlerts(prev => {
      const next = [validAlert, ...prev]
      return next.slice(0, 10)
    })
  }

  const getAlertsFromDatabase = async () => {
    try {
      console.log('Fetching alert data from API...')
      const response = await fetch('/api/alerts')
      console.log('API response status:', response.status)
      if (response.ok) {
        const responseData = await response.json()
        let alertData: Alert[] = []
        if (responseData && responseData.success && Array.isArray(responseData.data)) {
          alertData = responseData.data
        } else if (Array.isArray(responseData)) {
          alertData = responseData
        }
        localStorage.setItem('cryptoAlerts', JSON.stringify(alertData))
        return alertData
      } else {
        console.warn('API request failed with status:', response.status)
        const cachedData = getCachedAlerts()
        if (cachedData && cachedData.length > 0) return cachedData
        return []
      }
    } catch (error) {
      console.error('Error fetching alert data:', error)
      const cachedData = getCachedAlerts()
      if (cachedData && cachedData.length > 0) return cachedData
      return []
    }
  }

  const getCachedAlerts = (): Alert[] | null => {
    const storedAlerts = localStorage.getItem('cryptoAlerts')
    if (storedAlerts) {
      try {
        const alerts = JSON.parse(storedAlerts)
        return alerts
      } catch (e) {
        console.error('Error parsing cached alert data:', e)
        return null
      }
    }
    return null
  }

  const formatAlertHtml = (alert: Alert) => {
    let typeColor = 'terminal-red'
    if (alert.type === 'price_jump') typeColor = 'terminal-yellow'
    if (alert.type === 'whale_transfer') typeColor = 'terminal-purple'
    if (alert.type === 'funding_spike') typeColor = 'terminal-cyan'

    let formattedMessage = (alert.message || '').replace(/(\d+\.\d+)%/g, '<span class="percentage-red">$1%</span>')
    formattedMessage = formattedMessage.replace(/\$([\d,]+)/g, '<span class="terminal-green">$1</span>')

    let formattedSymbol = alert.symbol
    if (formattedSymbol && formattedSymbol.toUpperCase().includes('BTCUSDT')) {
      formattedSymbol = 'BTC/USDT'
    } else if (formattedSymbol && formattedSymbol.toUpperCase().includes('ETHUSDT')) {
      formattedSymbol = 'ETH/USDT'
    }

    return `
      <div>
        <span class="terminal-green">$</span>
        <span class="terminal-gold">alert</span>
        <span class="${typeColor}">--${(alert.type || '').replace('_', '-')}</span>
        <span class="terminal-text font-bold">${formattedSymbol}</span>
      </div>
      <div class="ml-6">${formattedMessage}</div>
      <div class="ml-6 text-xs terminal-text">[${alert.timestamp}]</div>
    `
  }

  const filterAlerts = (alerts: Alert[]) => {
    if (!alerts || !Array.isArray(alerts)) return []
    return alerts.filter(a => {
      const symbol = (a.symbol || '').toUpperCase()
      return symbol === 'BTCUSDT' || symbol === 'ETHUSDT'
    })
  }

  const loadAlerts = async () => {
    console.log('\n=== Starting Alert Information Loading ===')
    setLoading(true)
    try {
      const alerts = await getAlertsFromDatabase()
      const filteredAlerts = filterAlerts(alerts)
      if (filteredAlerts && filteredAlerts.length > 0) {
        setAlerts(
          filteredAlerts.slice(0, 7).map(a => ({
            symbol: a.symbol || 'UNKNOWN',
            type: a.type || 'price_jump',
            message: a.message || 'No message available',
            timestamp: a.timestamp || new Date().toISOString().slice(0, 19)
          }))
        )
      } else {
        setAlerts([])
      }
    } catch (error) {
      console.error('Error loading alert information:', error)
      setAlerts([])
    } finally {
      console.log('=== Alert Information Loading Completed ===')
      setLoading(false)
    }
  }

  // 添加 body class 和加载 Cascading Waves 背景
  useEffect(() => {
    document.body.classList.add('landing-page')
    
    // 设置背景为纯黑色
    document.body.style.setProperty('background', '#000000', 'important')
    
    // 动态加载 cascading-waves.css
    const cssLink = document.createElement('link')
    cssLink.rel = 'stylesheet'
    cssLink.href = '/cascading-waves.css'
    cssLink.id = 'cascading-waves-css'
    document.head.appendChild(cssLink)
    
    // 动态加载 cascading-waves.js
    const script = document.createElement('script')
    script.src = '/cascading-waves.js'
    script.id = 'cascading-waves-js'
    script.async = false // 改为同步加载以确保正确初始化
    document.body.appendChild(script)
    
    return () => {
      document.body.classList.remove('landing-page')
      // 清理样式
      document.body.style.removeProperty('background')
      
      // 清理 CSS
      const existingCss = document.getElementById('cascading-waves-css')
      if (existingCss) {
        existingCss.remove()
      }
      
      // 清理 JS 和 canvas
      const existingScript = document.getElementById('cascading-waves-js')
      if (existingScript) {
        existingScript.remove()
      }
      
      // 移除 canvas 元素
      const canvas = document.getElementById('cascading-waves-canvas')
      if (canvas) {
        canvas.remove()
      }
    }
  }, [])

    return (
    <div 
      className="font-sans relative" 
      style={{ 
        minHeight: '100vh'
      }} 
      data-page="landing"
    >
      {/* 左上角Logo */}
      <div className="absolute top-4 left-4 z-30">
        <img src="/image/lumi1 (1).png" alt="LUMI Logo" className="w-16 h-16" />
      </div>

      <main className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="text-center w-full">
          {/* Logo（黑白配色，无彩色） */}
          <div className="mb-10 flex justify-center">
            <h1 className="text-5xl md:text-6xl font-black text-white text-glow tracking-tight">LUMI</h1>
          </div>

          {/* 核心 "SOON" 区域（视觉焦点，黑白高对比） */}
          <div className="animate-breathe max-w-4xl mx-auto">
            <p className="text-6xl md:text-9xl font-black text-white mb-6 text-glow">SOON</p>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Crypto market tool—focuses on on-chain Black Swan risk signals, quantitative uncertainty measurement, betting platform and <br/> Prediction Market Platform.
            </p>
          </div>
        </div>

        {/* 专业黑白主题时间轴 */}
        <div className="mt-16 w-full">
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute left-[-9999px] right-[-12000px] top-6 h-[0.5px] bg-white z-0 transform -translate-y-1/2"></div>
            <div className="flex justify-between relative z-10">
              <div className="flex flex-col items-center relative">
                <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-600 absolute top-6 -translate-y-1/2"></div>
                <div className="text-white font-medium mt-8 mb-1">2025-Q4</div>
                <div className="text-gray-400 text-sm text-center max-w-[200px]">Prediction&Black Swan Alert</div>
              </div>
              <div className="flex flex-col items-center relative">
                <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-600 absolute top-6 -translate-y-1/2"></div>
                <div className="text-white font-medium mt-8 mb-1">2026-Q1</div>
                <div className="text-gray-400 text-sm text-center max-w-[180px]">Prediction Market</div>
                </div>
              <div className="flex flex-col items-center relative">
                <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-600 absolute top-6 -translate-y-1/2"></div>
                <div className="text-white font-medium mt-8 mb-1">2026-Q2</div>
                <div className="text-gray-400 text-sm text-center max-w-[180px]">Market Trend Forecasting</div>
                </div>
              <div className="flex flex-col items-center relative">
                <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-600 absolute top-6 -translate-y-1/2"></div>
                <div className="text-white font-medium mt-8 mb-1">2026-Q3</div>
                <div className="text-gray-400 text-sm text-center max-w-[120px]">Soon</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Our Apps 毛玻璃方框 - 位于核心内容区域下方 */}
      <section className="relative z-20 flex justify-center px-4 mt-20 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">Our Apps</h2>
            <div className="flex flex-col md:flex-row gap-6">
              {/* 左侧应用卡片 */}
              <div className="flex flex-col gap-6 flex-1">
                <div className="bg-[#1a1a1a]/50 rounded-lg p-5 hover:bg-[#1a1a1a]/80 transition-colors">
                  <div className="text-3xl text-white mb-3">📊</div>
                  <h3 className="text-xl font-semibold text-white mb-2">LUMI</h3>
                  <p className="text-gray-300/70 text-sm">Advanced trading platform with real-time analytics</p>
            </div>
                <div className="bg-[#1a1a1a]/50 rounded-lg p-5 hover:bg-[#1a1a1a]/80 transition-colors">
                  <div className="text-3xl text-white mb-3">🔔</div>
                  <h3 className="text-xl font-semibold text-white mb-2">More Apps Coming Soon</h3>
                  <p className="text-gray-300/70 text-sm">Customizable alerts for price movements and trends</p>
                    </div>
                {/* 新增预测板块 - 金色毛玻璃效果 */}
                <div className="backdrop-blur-md bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/10 rounded-lg p-5 border border-[#d4af37]/30 hover:border-[#d4af37]/50 transition-all">
                  <div className="text-3xl text-[#d4af37] mb-3">📈</div>
                  <h3 className="text-xl font-semibold text-white mb-2">PREDICTION MARKET</h3>
                  <p className="text-gray-300/70 text-sm mb-4">Decentralized prediction platform for crypto events</p>
                  <div className="space-y-3">
                    <div className="bg-[#1a1a1a]/60 p-3 rounded-md">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white text-sm font-medium">BTC Price at $70K by End of Year?</span>
                        <span className="text-xs px-2 py-1 bg-[#d4af37]/20 text-[#d4af37] rounded-full">82%</span>
                          </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div className="bg-[#d4af37] h-1.5 rounded-full" style={{ width: '82%' }}></div>
                        </div>
                    </div>
                    <div className="bg-[#1a1a1a]/60 p-3 rounded-md">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white text-sm font-medium">ETH to Surpass $4K in Q4?</span>
                        <span className="text-xs px-2 py-1 bg-[#d4af37]/20 text-[#d4af37] rounded-full">65%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div className="bg-[#d4af37] h-1.5 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  </div>
                  <Link href="/LUMI" className="mt-4 w-full py-2 bg-[#d4af37] hover:bg-[#e6c553] text-black rounded-md text-sm font-medium transition-colors flex items-center justify-center">
                    🔗 进入 LUMI
                </Link>
            </div>
              </div>
              {/* Right Side Alert Information Display Area - Command Line Style */}
              <div className="flex-1">
                <div id="alert-container" className="terminal-bg rounded-lg p-5 h-full overflow-y-auto border border-gray-500 w-full">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-500">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <h3 className="text-lg font-semibold terminal-gold terminal-font ml-2">crypto-alert@terminal</h3>
                  </div>
                  {loading ? (
                    <div id="alert-loading" className="terminal-font terminal-text">
                      <span className="terminal-green">$</span> <span>Loading alerts...</span>
                    </div>
                  ) : (
                    <div id="alert-list" className="terminal-font terminal-text space-y-2 mt-2">
                      {alerts.length === 0 ? (
                        <div className="terminal-font terminal-text text-center text-gray-300/60">No BTC/ETH alert data available</div>
                      ) : (
                        alerts.map(alert => (
                          <div key={alert.timestamp} className="alert-item" dangerouslySetInnerHTML={{ __html: formatAlertHtml(alert) }} />
                        ))
                      )}
                    </div>
                  )}
              </div>
              </div>
            </div>
            </div>
          </div>
        </section>

      {/* 底部信息（浅灰文本，降低视觉权重） */}
      <footer className="relative z-20 text-center text-gray-300/40 text-sm p-8">
        <p>© 2025 LUMI. All rights reserved.</p>
        <div className="flex items-center justify-center gap-4 mt-3">
          <a href="#" className="hover:text-white transition-colors">🐦</a>
          <a href="#" className="hover:text-white transition-colors">✈️</a>
          <a href="#" className="hover:text-white transition-colors">💬</a>
      </div>
      </footer>
    </div>
  )
}

export default Landing
