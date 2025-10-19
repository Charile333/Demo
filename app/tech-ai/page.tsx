'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { getAllTechAiMarkets } from '../../lib/techAiData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRobot, 
  faBrain, 
  faMicrochip, 
  faCloud, 
  faRocket,
  faCode,
  faChartLine,
  faCalendar,
  faArrowUp,
  faCog,
  faLightbulb,
  faNetworkWired,
  faShieldAlt,
  faUsers,
  faDatabase
} from '@fortawesome/free-solid-svg-icons';

const TechAiPage = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const techAiMarkets = getAllTechAiMarkets();

  // 时间筛选辅助函数
  const filterByTimeRange = (markets: any[]) => {
    if (selectedTimeRange === 'ALL') return markets;
    
    const now = new Date();
    const timeRanges: { [key: string]: number } = {
      '1D': 1,
      '1W': 7,
      '1M': 30,
      '3M': 90
    };
    
    const daysLimit = timeRanges[selectedTimeRange];
    if (!daysLimit) return markets;
    
    return markets.filter(market => {
      try {
        const endDate = new Date(market.endDate);
        const diffTime = endDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= daysLimit && diffDays >= 0;
      } catch {
        return true;
      }
    });
  };

  // 旧的市场数据（已废弃）
  const oldMarkets = [
    {
      id: 16,
      title: "GPT-5 to be released by OpenAI in 2024?",
      category: "AI Models",
      probability: 73.2,
      volume: "$4,567,892",
      participants: 2345,
      endDate: "Dec 31, 2024",
      trend: "up",
      change: "+15.7%"
    },
    {
      id: 17,
      title: "Google Gemini Ultra to surpass GPT-4 performance by Q2 2025?",
      category: "AI Competition",
      probability: 58.9,
      volume: "$3,234,567",
      participants: 1567,
      endDate: "Jun 30, 2025",
      trend: "up",
      change: "+8.3%"
    },
    {
      id: 18,
      title: "Quantum computing to achieve practical advantage by 2025?",
      category: "Quantum Computing",
      probability: 34.6,
      volume: "$2,876,432",
      participants: 1234,
      endDate: "Dec 31, 2025",
      trend: "down",
      change: "-4.2%"
    },
    {
      id: 19,
      title: "Apple to announce AI-powered Siri overhaul at WWDC 2024?",
      category: "AI Applications",
      probability: 82.1,
      volume: "$2,134,567",
      participants: 987,
      endDate: "Jun 10, 2024",
      trend: "up",
      change: "+12.6%"
    },
    {
      id: 20,
      title: "Tesla to achieve full self-driving (FSD) Level 5 by 2025?",
      category: "Autonomous Systems",
      probability: 28.7,
      volume: "$1,876,543",
      participants: 876,
      endDate: "Dec 31, 2025",
      trend: "down",
      change: "-6.8%"
    },
    {
      id: 21,
      title: "Microsoft Copilot to reach 100M monthly users by end of 2024?",
      category: "AI Applications",
      probability: 67.4,
      volume: "$1,456,789",
      participants: 654,
      endDate: "Dec 31, 2024",
      trend: "up",
      change: "+9.1%"
    },
    {
      id: 22,
      title: "Meta to launch AR glasses with AI assistant by 2025?",
      category: "AI Hardware",
      probability: 45.8,
      volume: "$1,234,567",
      participants: 567,
      endDate: "Dec 31, 2025",
      trend: "up",
      change: "+3.7%"
    },
    {
      id: 23,
      title: "NVIDIA to achieve $100B revenue in 2024?",
      category: "AI Infrastructure",
      probability: 91.3,
      volume: "$3,567,890",
      participants: 1456,
      endDate: "Dec 31, 2024",
      trend: "up",
      change: "+18.4%"
    },
    {
      id: 24,
      title: "AGI (Artificial General Intelligence) to be achieved by 2030?",
      category: "AI Research",
      probability: 23.4,
      volume: "$2,345,678",
      participants: 1123,
      endDate: "Dec 31, 2030",
      trend: "up",
      change: "+2.1%"
    },
    {
      id: 25,
      title: "OpenAI to IPO by end of 2025?",
      category: "AI Companies",
      probability: 56.7,
      volume: "$1,678,234",
      participants: 789,
      endDate: "Dec 31, 2025",
      trend: "up",
      change: "+5.9%"
    }
  ];

  const categories = [
    { id: 'all', name: '全部分类' },
    { id: 'llm-competition', name: '大模型竞争' },
    { id: 'chip-industry', name: '芯片产业' },
    { id: 'ai-phone', name: 'AI手机趋势' },
    { id: 'a-share', name: 'A股板块表现' },
    { id: 'policy-investment', name: '政策与投资' }
  ];

  // 先按分类筛选
  let filteredMarkets = selectedCategory === 'all' 
    ? techAiMarkets 
    : techAiMarkets.filter(market => 
        (selectedCategory === 'llm-competition' && market.category === '大模型竞争') ||
        (selectedCategory === 'chip-industry' && market.category === '芯片产业') ||
        (selectedCategory === 'ai-phone' && market.category === 'AI手机趋势') ||
        (selectedCategory === 'a-share' && market.category === 'A股板块表现') ||
        (selectedCategory === 'policy-investment' && market.category === '政策与投资')
      );
  
  // 再按搜索筛选
  if (searchQuery) {
    filteredMarkets = filteredMarkets.filter(market =>
      market.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // 最后应用时间筛选
  filteredMarkets = filterByTimeRange(filteredMarkets);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Main Content */}
      <div className="container mx-auto px-4 pb-6">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search Box */}
          <div className="relative w-full lg:w-64">
            <input
              type="text"
              placeholder="搜索市场..."
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 pl-10 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 flex-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-purple-400 hover:text-purple-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {/* Time Range Filter */}
          <div className="flex gap-2">
            {['1D', '1W', '1M', '3M', 'ALL'].map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  selectedTimeRange === range
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-dark border border-gray-700 text-gray-600 hover:border-purple-400 hover:text-purple-600'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Markets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMarkets.map((market) => (
            <div
              key={market.id}
              className="bg-dark-light rounded-xl border border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all duration-300 group overflow-hidden"
            >
              {/* Card Header - Title with Trend */}
              <Link href={`/event/${market.id}`} className="block p-6 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors flex-1">
                    {market.title}
                  </h3>
                  <div className={`flex items-center text-sm font-medium whitespace-nowrap ${
                    market.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <FontAwesomeIcon 
                      icon={faArrowUp} 
                      className={`mr-1 text-xs ${market.trend === 'down' ? 'rotate-180' : ''}`} 
                    />
                    {market.change}
                  </div>
                </div>
              </Link>

              {/* Card Body */}
              <div className="px-6 pb-4">
                {/* Probability and Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">当前概率</div>
                    <div className="text-3xl font-bold text-purple-600">{market.probability}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">截止日期</div>
                    <div className="text-sm text-gray-900">{market.endDate}</div>
                  </div>
                </div>

                {/* YES/NO Buttons */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Handle YES vote
                    }}
                    className="bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 hover:border-green-500/50 rounded-lg py-3 px-4 transition-all group/btn"
                  >
                    <div className="text-green-400 font-bold text-lg mb-1">YES</div>
                    <div className="text-green-400/70 text-xs">{market.probability}%</div>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Handle NO vote
                    }}
                    className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-lg py-3 px-4 transition-all group/btn"
                  >
                    <div className="text-red-400 font-bold text-lg mb-1">NO</div>
                    <div className="text-red-400/70 text-xs">{100 - market.probability}%</div>
                  </button>
                </div>

                {/* Market Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faChartLine} className="mr-1.5 text-purple-600" />
                    <span>{market.volume}</span>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faCalendar} className="mr-1.5" />
                    <span>{market.participants}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredMarkets.length === 0 && (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faRobot} className="text-6xl text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">No markets found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechAiPage;
