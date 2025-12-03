import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { ExternalLink, Filter, ChevronDown, CheckSquare, Bug, FileText, AlertTriangle } from 'lucide-react';
import Modal from '../components/Modal';

const burnDownData = [
  { day: '12/1', ideal: 18, actual: 18 },
  { day: '12/2', ideal: 16, actual: 17 },
  { day: '12/3', ideal: 14, actual: 15 },
  { day: '12/4', ideal: 12, actual: 15 },
  { day: '12/5', ideal: 10, actual: 12 },
  { day: '12/6', ideal: 8, actual: 10 },
  { day: '12/7', ideal: 6, actual: 8 },
  { day: '12/8', ideal: 4, actual: 6 },
  { day: '12/9', ideal: 2, actual: 3 },
  { day: '12/10', ideal: 0, actual: 0 },
];

const SprintDetail: React.FC = () => {
  const [showEndSprintModal, setShowEndSprintModal] = useState(false);

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <button className="p-1 rounded-full hover:bg-gray-100 text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
                <h1 className="text-xl font-bold text-gray-900">Sprint1: 功能优化</h1>
            </div>
            <div className="flex gap-2">
                <button className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 flex items-center transition-colors">
                    概览
                </button>
                <button className="px-3 py-1.5 border border-transparent rounded text-sm text-gray-500 hover:text-gray-800 transition-colors">
                    工作项
                </button>
                <button className="px-3 py-1.5 border border-transparent rounded text-sm text-gray-500 hover:text-gray-800 transition-colors">
                    选代文档
                </button>
                <button 
                    onClick={() => setShowEndSprintModal(true)}
                    className="bg-white border border-gray-300 px-3 py-1.5 rounded text-sm text-gray-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
                >
                    结束迭代
                </button>
            </div>
         </div>
      </div>

      <div className="p-6 space-y-6">
          {/* Top Cards */}
          <div className="grid grid-cols-3 gap-6">
              {/* Iteration Info */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-6">迭代信息</h3>
                  <div className="flex justify-between items-center px-4">
                      {/* Donut Chart Mockup */}
                      <div className="relative w-24 h-24 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                              <circle cx="48" cy="48" r="40" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                              <circle cx="48" cy="48" r="40" stroke="#10b981" strokeWidth="8" fill="none" strokeDasharray="251" strokeDashoffset="195" />
                              <circle cx="48" cy="48" r="40" stroke="#f59e0b" strokeWidth="8" fill="none" strokeDasharray="251" strokeDashoffset="240" />
                          </svg>
                          <div className="absolute text-center">
                              <span className="block text-lg font-bold text-gray-800">22%</span>
                          </div>
                      </div>
                      <div className="relative w-24 h-24 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                              <circle cx="48" cy="48" r="40" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                              <circle cx="48" cy="48" r="40" stroke="#3b82f6" strokeWidth="8" fill="none" strokeDasharray="251" strokeDashoffset="0" />
                          </svg>
                          <div className="absolute text-center">
                              <span className="block text-lg font-bold text-gray-800">100%</span>
                          </div>
                      </div>
                  </div>
                  <div className="mt-6 space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                          <span>负责人:</span>
                          <span className="text-gray-900">looking4id</span>
                      </div>
                      <div className="flex justify-between">
                          <span>迭代状态:</span>
                          <span className="text-blue-600 border border-blue-200 bg-blue-50 px-1 rounded text-xs">进行中</span>
                      </div>
                      <div className="flex justify-between">
                          <span>持续时间:</span>
                          <span className="text-gray-900">2025.12.01 ~ 2025.12.14</span>
                      </div>
                  </div>
              </div>

              {/* Burndown Chart */}
              <div className="col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-900">燃尽图</h3>
                      <div className="flex gap-2 text-xs">
                          <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-gray-300 mr-1"></span> 计划</span>
                          <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-500 mr-1"></span> 实际</span>
                      </div>
                  </div>
                  <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={burnDownData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                              <Tooltip />
                              <Line type="monotone" dataKey="ideal" stroke="#d1d5db" strokeDasharray="5 5" dot={false} strokeWidth={2} />
                              <Line type="monotone" dataKey="actual" stroke="#f59e0b" strokeWidth={2} dot={{r: 4, fill: '#f59e0b'}} />
                          </LineChart>
                      </ResponsiveContainer>
                  </div>
              </div>
          </div>

          {/* Member Workload */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">成员工时统计</h3>
              <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                      <tr>
                          <th className="px-4 py-3">成员</th>
                          <th className="px-4 py-3">预计工时</th>
                          <th className="px-4 py-3">登记工时</th>
                          <th className="px-4 py-3">实际登记工时</th>
                          {burnDownData.map(d => (
                              <th key={d.day} className="px-2 py-3 text-center text-xs">{d.day}</th>
                          ))}
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td className="px-4 py-3 flex items-center gap-2">
                             <div className="w-6 h-6 bg-amber-500 rounded-full text-white text-xs flex items-center justify-center">Lo</div>
                             looking4id
                          </td>
                          <td className="px-4 py-3 text-gray-400">-</td>
                          <td className="px-4 py-3 text-gray-400">-</td>
                          <td className="px-4 py-3 text-gray-400">-</td>
                          {burnDownData.map(d => (
                              <td key={d.day} className="px-2 py-3 text-center text-gray-300">-</td>
                          ))}
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>

      {/* End Sprint Modal */}
      <Modal
         isOpen={showEndSprintModal}
         onClose={() => setShowEndSprintModal(false)}
         title="完成 Sprint 1"
         size="md"
         footer={
             <>
                <button onClick={() => setShowEndSprintModal(false)} className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">取消</button>
                <button onClick={() => setShowEndSprintModal(false)} className="px-4 py-2 bg-pink-700 text-white rounded text-sm hover:bg-pink-800 shadow-sm">确认完成</button>
             </>
         }
      >
         <div className="space-y-4">
            <div className="flex items-start gap-3 bg-yellow-50 p-4 rounded border border-yellow-100 text-sm text-yellow-800">
               <AlertTriangle className="w-5 h-5 shrink-0" />
               <p>本迭代包含 <strong>5</strong> 个已完成工作项， <strong>3</strong> 个未完成工作项。</p>
            </div>
            
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">未完成工作项移动至</label>
               <div className="space-y-2">
                   <label className="flex items-center gap-2 p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                       <input type="radio" name="move" defaultChecked className="text-pink-600 focus:ring-pink-500" />
                       <span className="text-sm">Sprint 2: 自动开票功能开发 (下一个迭代)</span>
                   </label>
                   <label className="flex items-center gap-2 p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                       <input type="radio" name="move" className="text-pink-600 focus:ring-pink-500" />
                       <span className="text-sm">新的迭代</span>
                   </label>
                   <label className="flex items-center gap-2 p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                       <input type="radio" name="move" className="text-pink-600 focus:ring-pink-500" />
                       <span className="text-sm">需求池 (Backlog)</span>
                   </label>
               </div>
            </div>
         </div>
      </Modal>
    </div>
  );
};

export default SprintDetail;