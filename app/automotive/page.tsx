'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { getAllMarkets } from '../../lib/marketData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCar, 
  faBolt, 
  faChartLine, 
  faCalendar, 
  faArrowUp,
  faBatteryFull,
  faRoad,
  faCog,
  faUsers,
  faFire,
  faGlobe,
  faTrophy
} from '@fortawesome/free-solid-svg-icons';

const AutomotivePage = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 汽车与新能源市场数据 - 从共享数据文件获取
  const automotiveMarkets = getAllMarkets();

  const categories = [
    { id: 'all', name: '全部分类' },
    { id: 'brand-sales', name: '品牌月度销量' },
    { id: 'new-models', name: '新车型表现' },
    { id: 'market-share', name: '市场份额' },
    { id: 'regional-export', name: '区域出口' },
    { id: 'fuel-vs-ev', name: '燃油车vs新能源' },
    { id: 'tech-innovation', name: '技术创新' }
  ];

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
        return true; // 如果日期解析失败，保留该市场
      }
    });
  };

  // 先按分类筛选，再按时间筛选
  let filteredMarkets = selectedCategory === 'all' 
    ? automotiveMarkets 
    : automotiveMarkets.filter(market => 
        (selectedCategory === 'brand-sales' && market.category === '品牌月度销量') ||
        (selectedCategory === 'new-models' && market.category === '新车型表现') ||
        (selectedCategory === 'market-share' && market.category === '市场份额') ||
        (selectedCategory === 'regional-export' && market.category === '区域出口') ||
        (selectedCategory === 'fuel-vs-ev' && market.category === '燃油车vs新能源') ||
        (selectedCategory === 'tech-innovation' && market.category === '技术创新')
      );
  
  // 应用时间筛选
  filteredMarkets = filterByTimeRange(filteredMarkets);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Main Content */}
      <div className="container mx-auto px-4 pb-6 mt-0">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search Box */}
          <div className="relative w-full lg:w-64">
            <input
              type="text"
              placeholder="搜索市场..."
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 pl-10 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
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
                    ? 'bg-purple-600 text-white'
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
                    ? 'bg-purple-100 text-purple-600 border border-purple-300'
                    : 'bg-white border border-gray-300 text-gray-600 hover:border-purple-400 hover:text-purple-600'
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
              className="bg-white rounded-xl border border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all duration-300 group overflow-hidden"
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
                <div className="flex items-center justify-between text-xs text-gray-600 pt-3 border-t border-gray-200">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faChartLine} className="mr-1.5 text-purple-600" />
                    <span>{market.volume}</span>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faCalendar} className="mr-1.5 text-gray-500" />
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
            <FontAwesomeIcon icon={faCar} className="text-6xl text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">No markets found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutomotivePage;
