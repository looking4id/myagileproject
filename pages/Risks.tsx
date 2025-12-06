
import React, { useState } from 'react';
import { Plus, ShieldAlert, AlertTriangle, Search, Filter, MoreHorizontal, ChevronDown } from 'lucide-react';
import Modal from '../components/Modal';

const Risks: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const risks = [
    { id: 'RISK-101', title: '由于某项新技术可能造成项目延期', probability: 'Medium', impact: 'High', status: 'Open', owner: 'looking4id', created: '2025-12-06' },
    { id: 'RISK-102', title: '由于大量用户访问产品系统造成系统变慢甚至宕机', probability: 'High', impact: 'Critical', status: 'Open', owner: 'looking4id', created: '2025-12-06' },
  ];

  const getRiskLevel = (prob: string, impact: string) => {
      // Simplified logic
      if (prob === 'High' && impact === 'Critical') return { label: '极高', color: 'bg-red-600 text-white' };
      if (impact === 'High') return { label: '高', color: 'bg-orange-500 text-white' };
      return { label: '中', color: 'bg-yellow-500 text-white' };
  };

  const getProbLabel = (p: string) => {
      switch(p) {
          case 'High': return '高';
          case 'Medium': return '中';
          case 'Low': return '低';
          default: return p;
      }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">全部风险</h1>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 flex items-center text-sm transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" /> 新建风险
        </button>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
              <div className="relative">
                  <input type="text" placeholder="搜索风险..." className="pl-8 pr-4 py-1.5 border border-gray-300 rounded text-sm w-64 focus:ring-1 focus:ring-blue-500 outline-none bg-white" />
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <button className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 flex items-center">
                  状态: 开启 <ChevronDown className="w-3 h-3 ml-1" />
              </button>
              <button className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 flex items-center">
                  负责人 <ChevronDown className="w-3 h-3 ml-1" />
              </button>
          </div>
          <div className="text-sm text-gray-500">共 {risks.length} 个风险</div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto bg-white p-6">
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                      <tr>
                          <th className="px-6 py-3 font-medium w-32">编号</th>
                          <th className="px-6 py-3 font-medium">风险标题</th>
                          <th className="px-6 py-3 font-medium w-32">状态</th>
                          <th className="px-6 py-3 font-medium w-32">发生概率</th>
                          <th className="px-6 py-3 font-medium w-32">影响程度</th>
                          <th className="px-6 py-3 font-medium w-32">风险等级</th>
                          <th className="px-6 py-3 font-medium w-32">负责人</th>
                          <th className="px-6 py-3 font-medium w-40">创建时间</th>
                          <th className="px-6 py-3 font-medium w-16">操作</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                      {risks.map(risk => {
                          const level = getRiskLevel(risk.probability, risk.impact);
                          return (
                              <tr key={risk.id} className="hover:bg-gray-50 transition-colors group">
                                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{risk.id}</td>
                                  <td className="px-6 py-4">
                                      <div className="flex items-center gap-2">
                                          <ShieldAlert className="w-4 h-4 text-orange-500" />
                                          <span className="font-medium text-gray-900 group-hover:text-blue-600 cursor-pointer">{risk.title}</span>
                                      </div>
                                  </td>
                                  <td className="px-6 py-4">
                                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs border border-blue-200 flex items-center w-fit gap-1">
                                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> 待处理
                                      </span>
                                  </td>
                                  <td className="px-6 py-4 text-gray-600">{getProbLabel(risk.probability)}</td>
                                  <td className="px-6 py-4 text-gray-600">{getProbLabel(risk.impact)}</td>
                                  <td className="px-6 py-4">
                                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${level.color}`}>
                                          {level.label}
                                      </span>
                                  </td>
                                  <td className="px-6 py-4">
                                      <div className="flex items-center gap-2">
                                          <div className="w-5 h-5 bg-purple-500 rounded-full text-white flex items-center justify-center text-xs">
                                              {risk.owner[0].toUpperCase()}
                                          </div>
                                          <span className="text-gray-600 text-xs">{risk.owner}</span>
                                      </div>
                                  </td>
                                  <td className="px-6 py-4 text-gray-500 text-xs">{risk.created}</td>
                                  <td className="px-6 py-4 text-gray-400">
                                      <MoreHorizontal className="w-4 h-4 cursor-pointer hover:text-gray-600" />
                                  </td>
                              </tr>
                          );
                      })}
                  </tbody>
              </table>
          </div>
      </div>

      <Modal
         isOpen={showCreateModal}
         onClose={() => setShowCreateModal(false)}
         title="新建风险"
         size="lg"
         footer={
             <>
                <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">取消</button>
                <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">确定</button>
             </>
         }
      >
         <div className="space-y-4">
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">风险标题 <span className="text-red-500">*</span></label>
                 <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 outline-none" placeholder="输入风险标题" autoFocus />
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">发生概率</label>
                     <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:ring-blue-500 outline-none">
                         <option value="High">高</option>
                         <option value="Medium">中</option>
                         <option value="Low">低</option>
                     </select>
                 </div>
                 <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">影响程度</label>
                     <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:ring-blue-500 outline-none">
                         <option value="Critical">致命</option>
                         <option value="High">严重</option>
                         <option value="Medium">一般</option>
                         <option value="Low">轻微</option>
                     </select>
                 </div>
             </div>

             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">负责人</label>
                 <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:ring-blue-500 outline-none">
                     <option>looking4id</option>
                 </select>
             </div>

             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">风险描述</label>
                 <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-24 resize-none focus:ring-blue-500 outline-none" placeholder="详细描述风险背景、可能的影响等..."></textarea>
             </div>
             
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">应对策略</label>
                 <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-24 resize-none focus:ring-blue-500 outline-none" placeholder="计划采取的规避或缓解措施..."></textarea>
             </div>
         </div>
      </Modal>
    </div>
  );
};

export default Risks;
