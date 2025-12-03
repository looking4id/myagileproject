import React, { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, LayoutGrid, List, Calendar as CalendarIcon, X } from 'lucide-react';
import Modal from '../components/Modal';

const Releases: React.FC = () => {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [showModal, setShowModal] = useState(false);

  // Calendar generation logic (Simplified for Nov 2025)
  const days = [];
  const startOffset = 5; // Nov 1st 2025 is Saturday (mock)
  const totalDays = 30;
  
  // Previous month filler
  for (let i = 0; i < startOffset; i++) {
    days.push({ day: 27 + i, current: false });
  }
  // Current month
  for (let i = 1; i <= totalDays; i++) {
    days.push({ day: i, current: true });
  }
  // Next month filler
  for (let i = 1; i <= 6; i++) {
    days.push({ day: i, current: false });
  }

  return (
    <div className="flex flex-col h-full bg-white">
        <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">版本</h1>
                <button 
                  onClick={() => setShowModal(true)}
                  className="bg-pink-700 text-white px-4 py-2 rounded shadow hover:bg-pink-800 flex items-center text-sm transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" /> 新建版本
                </button>
            </div>
            
            <div className="flex items-center gap-6 border-b border-gray-100">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`pb-2 text-sm font-medium transition-colors ${viewMode === 'list' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-500 hover:text-gray-800'}`}
                >
                    版本列表
                </button>
                <button 
                  onClick={() => setViewMode('calendar')}
                  className={`pb-2 text-sm font-medium transition-colors ${viewMode === 'calendar' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-500 hover:text-gray-800'}`}
                >
                    发布计划
                </button>
            </div>
        </div>

        {viewMode === 'calendar' ? (
             <div className="flex-1 flex flex-col p-6">
                <div className="flex items-center justify-between mb-4">
                    <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">今天</button>
                    <div className="flex items-center gap-4 text-lg font-medium text-gray-800">
                        <button className="p-1 hover:bg-gray-100 rounded"><ChevronLeft className="w-5 h-5" /></button>
                        <span>11月 2025</span>
                        <button className="p-1 hover:bg-gray-100 rounded"><ChevronRight className="w-5 h-5" /></button>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex border border-gray-200 rounded overflow-hidden">
                            <button className="px-3 py-1.5 bg-blue-600 text-white text-sm">月</button>
                            <button className="px-3 py-1.5 bg-white text-gray-600 text-sm border-l border-gray-200 hover:bg-gray-50">周</button>
                        </div>
                        <button className="p-1.5 border border-gray-200 rounded text-gray-500 hover:bg-gray-50"><LayoutGrid className="w-4 h-4" /></button>
                    </div>
                </div>

                <div className="flex-1 border border-gray-200 rounded-lg flex flex-col shadow-sm">
                    {/* Week Header */}
                    <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                        {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map(d => (
                            <div key={d} className="py-2 text-center text-sm text-gray-500 font-medium">{d}</div>
                        ))}
                    </div>
                    {/* Days Grid */}
                    <div className="flex-1 grid grid-cols-7 grid-rows-5">
                        {days.map((d, i) => (
                            <div key={i} className={`border-b border-r border-gray-100 p-2 relative min-h-[100px] ${!d.current ? 'bg-gray-50 text-gray-300' : 'bg-white hover:bg-gray-50 transition-colors'}`}>
                                <span className={`text-sm ${!d.current ? 'text-gray-300' : 'text-gray-700'}`}>{d.day}</span>
                                {d.current && d.day === 30 && (
                                    <div className="mt-2 bg-pink-50 border-l-4 border-pink-700 p-2 rounded-r text-xs cursor-pointer hover:shadow-md transition-shadow">
                                        <div className="font-bold text-pink-900 bg-pink-700 text-white px-1 py-0.5 rounded inline-block mr-1">1.2.1</div>
                                        <span className="text-pink-900 font-medium">紧急补丁</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
             </div>
        ) : (
             <div className="p-6">
                 {/* Simple List View Placeholder */}
                 <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="px-6 py-3">版本号</th>
                                <th className="px-6 py-3">版本名称</th>
                                <th className="px-6 py-3">阶段</th>
                                <th className="px-6 py-3">负责人</th>
                                <th className="px-6 py-3">发布时间</th>
                                <th className="px-6 py-3">进度</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                             <tr className="hover:bg-gray-50 transition-colors">
                                 <td className="px-6 py-4"><span className="bg-pink-700 text-white px-1.5 py-0.5 rounded text-xs">1.2.1</span></td>
                                 <td className="px-6 py-4 font-medium">紧急补丁</td>
                                 <td className="px-6 py-4 text-gray-500">◎ 开发环境</td>
                                 <td className="px-6 py-4 flex items-center gap-2"><div className="w-5 h-5 bg-amber-500 rounded-full text-white text-[10px] flex items-center justify-center">Lo</div> looking4id</td>
                                 <td className="px-6 py-4 text-gray-500">2025.11.30 00:00</td>
                                 <td className="px-6 py-4 w-48">
                                     <div className="flex items-center gap-2">
                                         <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                             <div className="h-full bg-blue-500 w-0"></div>
                                         </div>
                                         <span className="text-xs text-gray-500">0%</span>
                                     </div>
                                 </td>
                             </tr>
                        </tbody>
                    </table>
                 </div>
             </div>
        )}

        {/* Create Modal */}
        <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title="新建版本"
            size="lg"
            footer={
                <>
                    <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">取消</button>
                    <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-pink-700 text-white rounded text-sm hover:bg-pink-800">确定</button>
                </>
            }
        >
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">版本号 <span className="text-red-500">*</span></label>
                        <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-pink-500 focus:border-pink-500 outline-none" placeholder="请输入版本号" autoFocus />
                        <p className="text-xs text-red-500 mt-1">版本号必填</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                        <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-pink-500 focus:border-pink-500 outline-none" placeholder="请输入标题" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">负责人 <span className="text-red-500">*</span></label>
                        <div className="flex items-center border border-gray-300 rounded px-3 py-2 bg-gray-50">
                            <div className="w-5 h-5 bg-amber-500 rounded-full text-white text-[10px] flex items-center justify-center mr-2">Lo</div>
                            <span className="text-sm">looking4id</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">发布时间</label>
                        <div className="relative">
                            <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-pink-500 focus:border-pink-500 outline-none" defaultValue="2025.11.13 00:00" />
                            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                </div>
                <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">发布日志</label>
                        <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-32 resize-none focus:ring-pink-500 focus:border-pink-500 outline-none" placeholder="请输入发布日志"></textarea>
                </div>
            </div>
        </Modal>
    </div>
  );
};

export default Releases;