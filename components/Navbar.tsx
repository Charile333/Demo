'use client';
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

// Navigation Link Component - 修改为按钮式点击
const NavLink = ({ 
  categoryId, 
  label, 
  isActive, 
  onClick 
}: { 
  categoryId: string; 
  label: string; 
  isActive: boolean;
  onClick: (categoryId: string) => void;
}) => {
  return (
    <button 
      onClick={() => onClick(categoryId)}
      className={`font-medium transition duration-200 whitespace-nowrap ${
        isActive 
        ? 'text-purple-600 border-b-2 border-purple-600' 
        : 'text-gray-700 hover:text-purple-600'
      }`}
    >
      {label}
    </button>
  )
}

interface NavbarProps {
  activeCategory?: string;
  onCategoryChange?: (categoryId: string) => void;
}

const Navbar = ({ activeCategory = 'automotive', onCategoryChange }: NavbarProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  // 六大赛道分类数据
  const categories = [
    { id: 'automotive', name: '汽车与新能源' },
    { id: 'smart-devices', name: '手机与智能硬件' },
    { id: 'tech-ai', name: '科技发布与AI创新' },
    { id: 'entertainment', name: '娱乐与文化' },
    { id: 'sports-gaming', name: '体育与电竞' },
    { id: 'economy-social', name: '经济与社会趋势' },
    { id: 'emerging', name: '新兴赛道' },
  ]

  const handleCategoryClick = (categoryId: string) => {
    if (onCategoryChange) {
      // 如果提供了回调函数，使用回调（主页模式）
      onCategoryChange(categoryId);
    } else {
      // 如果没有提供回调函数，使用路由跳转到 LUMI 页面
      router.push(`/LUMI?category=${categoryId}`);
    }
  }

  return (
    <nav className="navbar fixed top-0 left-0 right-0 z-50 bg-primary">
      <div className="container mx-auto px-4">
        {/* Top Row with Logo, Search, and Actions */}
        <div className="flex items-center justify-between py-[0.375rem] border-b border-secondary/20 gap-4" style={{height: '80px'}}>
          {/* Left Side: Logo and Search - 固定在左上角 */}
          <div className="flex items-center flex-grow gap-4">
            {/* Logo with Image */}
            <button 
              onClick={() => handleCategoryClick('automotive')}
              className="w-full hover:opacity-80 transition-opacity"
              style={{overflow: 'visible', display: 'block', position: 'relative', padding: 0, border: 'none', background: 'transparent'}}
            >
              <div className="relative flex items-center justify-center">
                <Image 
                  src="/image/LUMI (1).png" 
                  alt="LUMI Logo" 
                  width={250} 
                  height={70}
                  className="object-contain rounded-lg"
                />
                {/* SOON 浮动标签 */}
                <div className="absolute top-1 -right-4 bg-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg animate-float">
                  SOON
                </div>
              </div>
            </button>

            {/* Search Bar */}
            <div className="relative flex-grow min-w-0 hidden lg:block">
              <input
                type="text"
                placeholder="搜索预测市场"
                className="w-full py-[0.55rem] px-[1.1rem] bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 text-[0.935rem]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-[1.1rem] w-[1.1rem] text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Right Side: Action Buttons */}
          <div className="flex items-center space-x-3">
            <button className="px-[0.825rem] py-[0.413rem] text-[0.825rem] border border-purple-600 text-purple-600 rounded-md hover:bg-purple-600 hover:text-white transition duration-200 whitespace-nowrap">
              投资组合 $0.00
            </button>
            <button className="px-[0.825rem] py-[0.413rem] text-[0.825rem] border border-purple-600 text-purple-600 rounded-md hover:bg-purple-600 hover:text-white transition duration-200 whitespace-nowrap">
              现金 $0.00
            </button>
            <button className="px-[0.825rem] py-[0.413rem] text-[0.825rem] bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200 whitespace-nowrap">
              充值
            </button>
            <button className="text-gray-700 hover:text-purple-600 p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-[1.375rem] w-[1.375rem]" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </button>
            <button className="text-gray-700 hover:text-purple-600 p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-[1.375rem] w-[1.375rem]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        <div className="py-2.5 lg:hidden border-b border-secondary/20">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索预测市场"
              className="w-full py-2 px-4 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Categories Navigation - 垂直拉伸5% */}
        <div className="py-[0.656rem] overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="flex space-x-6 min-w-max">
            {categories.map((category) => (
              <NavLink
                key={category.id}
                categoryId={category.id}
                label={category.name}
                isActive={activeCategory === category.id}
                onClick={handleCategoryClick}
              />
            ))}
          <button className="text-gray-700 hover:text-purple-600 flex items-center whitespace-nowrap">
            更多 <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar