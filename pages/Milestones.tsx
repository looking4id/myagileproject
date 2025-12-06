
import React, { useState } from 'react';
import { Plus, MapPin, Calendar, CheckCircle2, Circle, MoreHorizontal, ArrowRight, Filter, Search } from 'lucide-react';
import Modal from '../components/Modal';

const Milestones: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeMilestoneId, setActiveMilestoneId] = useState<string | null>(null);

  const milestones = [
    { id: '1', title: '创建新项目', date: '2025-12-11', status: 'completed', description: '完成项目立项与团队组建', owner: 'looking4id' },
    { id: '2', title: '邀请同事加入项目', date: '2025-12-18', status: 'completed', description: '完成核心开发人员入驻', owner: 'looking4id' },
    { id: '3', title: '在项目中管理需求池', date: '2025-12-25', status: 'pending', description: '完成首批需求梳理与评审', owner: 'pm01' },
    { id: '4', title: '通过数据报表进行项目复盘', date: '2026-01-01', status: 'pending', description: 'Sprint 1 结束后的数据分析', owner: 'looking4id' },
    { id: '5', title: '完成一次迭代交付', date: '2026-01-01', status: 'pending', description: 'V1.0 版本正式上线', owner: 'dev01' },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">里程碑</h1>
          <p className="text-sm text-gray-500">关键时间节点与阶段性目标管理</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 flex items-center text-sm transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" /> 新建里程碑
        </button>
      </div>

      {/* Visual Timeline */}
      <div className="p-8 bg-gray-50 border-b border-gray-200 overflow-x-auto">
        <div className="relative min-w-max">
           {/* Timeline Line */}
           <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-0"></div>
           
           <div className="flex justify-between items-start gap-12 pt-2">
              {milestones.map((ms, index) => {
                 const isCompleted = ms.status === 'completed';
                 return (
                   <div key={ms.id} className="flex flex-col items-center relative z-10 w-40 group cursor-pointer">
                      <div className={`w-5 h-5 rounded-full border-4 ${isCompleted ? 'bg-blue-600 border-blue-200' : 'bg-white border-gray-300'} mb-3 transition-colors`}></div>
                      <div className="text-center">
                          <div className={`text-xs mb-1 font-medium ${isCompleted ? 'text-blue-600' : 'text-gray-500'}`}>
                              {ms.date === new Date().toISOString().split('T')[0] ? '今天' : ms.date}
                          </div>
                          <div className="text-sm font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">{ms.title}</div>
                          <div className="text-xs text-gray-400 line-clamp-2">{ms.description}</div>
                      </div>
                   </div>
                 );
              })}
           </div>
        </div>
      </div>

      {/* List View */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col">
         <div className="flex justify-between items-center mb-4">
             <div className="flex gap-2">
                 <div className="relative">
                     <input type="text" placeholder="搜索里程碑..." className="pl-8 pr-4 py-1.5 border border-gray-300 rounded text-sm w-64 focus:ring-1 focus:ring-blue-500 outline-none" />
                     <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                 </div>
                 <button className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 flex items-center">
                     <Filter className="w-3.5 h-3.5 mr-1.5" /> 状态
                 </button>
             </div>
         </div>

         <div className="flex-1 bg-white border border-gray-200 rounded-lg overflow-auto shadow-sm">
             <table className="w-full text-left text-sm">
                 <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                     <tr>
                         <th className="px-6 py-3 font-medium">名称</th>
                         <th className="px-6 py-3 font-medium">状态</th>
                         <th className="px-6 py-3 font-medium">负责人</th>
                         <th className="px-6 py-3 font-medium">计划完成时间</th>
                         <th className="px-6 py-3 font-medium text-right">操作</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                     {milestones.map(ms => (
                         <tr key={ms.id} className="hover:bg-gray-50 transition-colors group">
                             <td className="px-6 py-4 font-medium text-gray-900 group-hover:text-blue-600 cursor-pointer">{ms.title}</td>
                             <td className="px-6 py-4">
                                 {ms.status === 'completed' ? (
                                     <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                         <CheckCircle2 className="w-3 h-3 mr-1" /> 已完成
                                     </span>
                                 ) : (
                                     <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                         <Circle className="w-3 h-3 mr-1" /> 未开始
                                     </span>
                                 )}
                             </td>
                             <td className="px-6 py-4">
                                 <div className="flex items-center gap-2">
                                     <div className="w-6 h-6 bg-purple-500 rounded-full text-white flex items-center justify-center text-xs">
                                         {ms.owner[0].toUpperCase()}
                                     </div>
                                     <span className="text-gray-600">{ms.owner}</span>
                                 </div>
                             </td>
                             <td className="px-6 py-4 text-gray-500 font-mono">{ms.date}</td>
                             <td className="px-6 py-4 text-right">
                                 <button className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded">
                                     <MoreHorizontal className="w-4 h-4" />
                                 </button>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>
      </div>

      <Modal
         isOpen={showCreateModal}
         onClose={() => setShowCreateModal(false)}
         title="新建里程碑"
         size="md"
         footer={
             <>
                <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">取消</button>
                <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">确定</button>
             </>
         }
      >
         <div className="space-y-4">
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">名称 <span className="text-red-500">*</span></label>
                 <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 outline-none" placeholder="输入里程碑名称" autoFocus />
             </div>
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">计划完成日期 <span className="text-red-500">*</span></label>
                 <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 outline-none" />
             </div>
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">负责人</label>
                 <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:ring-blue-500 outline-none">
                     <option>looking4id</option>
                 </select>
             </div>
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                 <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-24 resize-none focus:ring-blue-500 outline-none" placeholder="输入描述..."></textarea>
             </div>
         </div>
      </Modal>
    </div>
  );
};

export default Milestones;
