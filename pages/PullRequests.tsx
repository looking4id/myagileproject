import React, { useState } from 'react';
import { GitPullRequest, Search, Filter, Plus, User, ArrowRight } from 'lucide-react';
import Modal from '../components/Modal';

const PullRequests: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="p-6 h-full bg-white flex flex-col">
       <div className="flex items-center justify-between mb-6">
           <div className="flex items-center gap-2">
               <h1 className="text-xl font-bold text-gray-900">代码评审 Pull Requests</h1>
           </div>
           <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-pink-700 text-white px-4 py-2 rounded text-sm hover:bg-pink-800 flex items-center transition-colors shadow-sm"
           >
               <Plus className="w-4 h-4 mr-2" /> 请求评审
           </button>
       </div>

       {/* Tabs */}
       <div className="border-b border-gray-200 mb-4">
           <div className="flex gap-8">
               <button className="pb-3 border-b-2 border-pink-700 text-pink-700 font-medium text-sm">全部</button>
               <button className="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-800 text-sm">开启的</button>
               <button className="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-800 text-sm">已合并</button>
               <button className="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-800 text-sm">已关闭</button>
               <button className="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-800 text-sm">回退的</button>
           </div>
       </div>

       {/* Filters */}
       <div className="bg-gray-50 p-3 rounded mb-4 flex flex-wrap items-center gap-4 text-sm border border-gray-100">
           <div className="flex items-center gap-1 text-gray-600 cursor-pointer hover:text-gray-900">
               <span>仓库</span> <Filter className="w-3 h-3" />
           </div>
           <div className="flex items-center gap-1 text-gray-600 cursor-pointer hover:text-gray-900">
               <span>发起人</span> <Filter className="w-3 h-3" />
           </div>
           <div className="flex items-center gap-1 text-gray-600 cursor-pointer hover:text-gray-900">
               <span>审核人</span> <Filter className="w-3 h-3" />
           </div>
           <div className="flex items-center gap-1 text-gray-600 cursor-pointer hover:text-gray-900">
               <span>测试者</span> <Filter className="w-3 h-3" />
           </div>
           <div className="flex items-center gap-1 text-gray-600 cursor-pointer hover:text-gray-900">
               <span>里程碑</span> <Filter className="w-3 h-3" />
           </div>
           
           <div className="ml-auto flex items-center gap-2">
               <div className="relative">
                    <input type="text" placeholder="输入关键字" className="pl-3 pr-8 py-1.5 bg-white border border-gray-300 rounded text-sm w-48 focus:ring-1 focus:ring-blue-500 outline-none" />
                    <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
               </div>
               <button className="text-blue-600 text-sm hover:underline">清空</button>
           </div>
       </div>

       {/* List */}
       <div className="bg-white border border-gray-200 rounded-lg flex-1 overflow-auto">
           <div className="p-4 border-b border-gray-100 flex items-start gap-3 hover:bg-gray-50 transition-colors cursor-pointer group">
               <div className="mt-1">
                   <GitPullRequest className="w-5 h-5 text-blue-500" />
               </div>
               <div className="flex-1">
                   <div className="flex items-center gap-2 mb-1">
                       <span className="bg-gray-100 text-gray-500 text-xs px-1.5 rounded">!1</span>
                       <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">【示例数据】Pull Request 是实现代码质量左移，保障代码质量和规范的绝佳工具</h3>
                   </div>
                   <div className="text-xs text-gray-500 flex items-center gap-2">
                       <span className="font-medium text-gray-700">looking4id</span>
                       <span>4个月前于 示例仓库-测试仓库:</span>
                       <span className="bg-gray-100 px-1 rounded font-mono text-gray-600">develop</span>
                       <span>→</span>
                       <span className="bg-gray-100 px-1 rounded font-mono text-gray-600">master</span>
                   </div>
               </div>
               <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                        <span className="text-gray-500">评审:</span>
                        <div className="w-5 h-5 bg-amber-500 rounded-full text-white text-[10px] flex items-center justify-center">Lo</div>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-gray-500">测试:</span>
                        <div className="w-5 h-5 bg-amber-500 rounded-full text-white text-[10px] flex items-center justify-center">Lo</div>
                    </div>
               </div>
           </div>
       </div>

       {/* Create PR Modal */}
       <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="发起代码评审"
          size="lg"
          footer={
             <>
                <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">取消</button>
                <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-pink-700 text-white rounded text-sm hover:bg-pink-800 shadow-sm">发起评审</button>
             </>
          }
       >
          <div className="space-y-5">
             <div className="flex items-center gap-4 bg-gray-50 p-4 rounded border border-gray-200">
                <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">源分支</label>
                    <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white">
                        <option>feature/login-fix</option>
                        <option>develop</option>
                    </select>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 mt-5" />
                <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">目标分支</label>
                    <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white">
                        <option>develop</option>
                        <option>master</option>
                    </select>
                </div>
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标题 <span className="text-red-500">*</span></label>
                <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 outline-none" placeholder="简要描述本次变更..." autoFocus />
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-32 resize-none focus:ring-2 focus:ring-pink-500 outline-none" placeholder="详细描述变更内容、影响范围等..."></textarea>
             </div>

             <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">评审人</label>
                    <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-2 hover:bg-gray-50 cursor-pointer">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">选择评审人...</span>
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">关联工作项</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 outline-none" placeholder="输入ID关联..." />
                 </div>
             </div>
          </div>
       </Modal>
    </div>
  );
};

export default PullRequests;