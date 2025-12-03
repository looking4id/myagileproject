import React from 'react';
import { Search, Bell, HelpCircle, Plus, User as UserIcon } from 'lucide-react';

const TopBar: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <div className="flex items-center text-sm text-gray-500">
          <span className="hover:text-gray-800 cursor-pointer">项目</span>
          <span className="mx-2">/</span>
          <span className="hover:text-gray-800 cursor-pointer">敏捷研发项目01</span>
        </div>
        <span className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded border border-orange-200">
          双十一年度特惠
        </span>
        <a href="#" className="text-blue-600 text-sm hover:underline">升级到付费版</a>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="搜索..." 
            className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs border border-gray-200 px-1.5 rounded">/</span>
        </div>
        
        <button className="text-gray-500 hover:text-gray-700 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center border border-indigo-200">
          <span className="font-bold text-xs">AI</span>
        </div>

        <button className="text-gray-500 hover:text-gray-700">
          <HelpCircle className="h-5 w-5" />
        </button>

        <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 border border-dashed border-gray-300">
          <Plus className="h-4 w-4 text-gray-600" />
        </button>

        <div className="h-8 w-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-medium cursor-pointer">
          Lo
        </div>
      </div>
    </div>
  );
};

export default TopBar;