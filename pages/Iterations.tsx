
import React, { useState } from 'react';
import { 
  Plus, Search, MoreHorizontal, Calendar, 
  ChevronRight, ArrowLeft, BarChart2, 
  CheckSquare, Clock, Filter, AlertCircle,
  TrendingDown, CheckCircle2, Columns
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Modal from '../components/Modal';

// Types
interface Sprint {
  id: string;
  title: string;
  status: 'planned' | 'running' | 'completed';
  startDate: string;
  endDate: string;
  goal?: string;
  owner: string;
  progress: number; // 0-100
  totalWorkItems: number;
  completedWorkItems: number;
  totalHours: number;
}

interface WorkItem {
  id: string;
  title: string;
  type: 'Feature' | 'Bug' | 'Task';
  status: 'ToDo' | 'InProgress' | 'Done';
  priority: 'High' | 'Medium' | 'Low';
  owner: string;
  storyPoints?: number;
}

const Iterations: React.FC = () => {
  // Navigation State
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);
  const [activeTab, setActiveTab] = useState<'items' | 'board' | 'overview'>('items');

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Mock Data: Sprints
  const [sprints, setSprints] = useState<Sprint[]>([
    {
      id: 'S1',
      title: 'Sprint1: 功能优化',
      status: 'running',
      startDate: '2025.12.01',
      endDate: '2025.12.14',
      goal: '修复微信小程序在线点餐系统所存在的缺陷，并实现基础的性能优化。',
      owner: 'looking4id',
      progress: 22,
      totalWorkItems: 18,
      completedWorkItems: 4,
      totalHours: 240
    },
    {
      id: 'S2',
      title: 'Sprint2: 自助开票功能开发',
      status: 'planned',
      startDate: '2025.12.15',
      endDate: '2025.12.28',
      goal: '小程序端支持用户自助开票，后台需增加发票管理系统。',
      owner: 'looking4id',
      progress: 0,
      totalWorkItems: 7,
      completedWorkItems: 0,
      totalHours: 240
    }
  ]);

  // Mock Data: Work Items for Sprint 1
  const sprintItems: WorkItem[] = [
    { id: '101', title: '【示例缺陷】多人进入系统后，菜品有概率被重复添加', type: 'Bug', status: 'InProgress', priority: 'High', owner: 'looking4id', storyPoints: 3 },
    { id: '102', title: '【示例缺陷】多人进入系统后，订单可被重复付款', type: 'Bug', status: 'InProgress', priority: 'High', owner: 'looking4id', storyPoints: 5 },
    { id: '103', title: '【示例任务】后端接口：菜品点赞接口', type: 'Task', status: 'ToDo', priority: 'Medium', owner: 'looking4id', storyPoints: 2 },
    { id: '104', title: '【示例任务】前端任务：点赞功能开发', type: 'Task', status: 'ToDo', priority: 'Medium', owner: 'looking4id', storyPoints: 3 },
    { id: '105', title: '【示例任务】后端接口：提交订单接口', type: 'Task', status: 'Done', priority: 'High', owner: 'looking4id', storyPoints: 5 },
    { id: '106', title: '【示例任务】前端任务：跳转逻辑修改', type: 'Task', status: 'Done', priority: 'High', owner: 'looking4id', storyPoints: 3 },
    { id: '107', title: '【示例任务】后端任务：删除菜品接口', type: 'Task', status: 'Done', priority: 'Medium', owner: 'looking4id', storyPoints: 2 },
    { id: '108', title: '【示例任务】后端任务：编辑菜品接口', type: 'Task', status: 'Done', priority: 'Medium', owner: 'looking4id', storyPoints: 2 },
    { id: '109', title: '【示例任务】多人点餐测试任务', type: 'Task', status: 'ToDo', priority: 'High', owner: 'looking4id', storyPoints: 5 },
  ];

  // Mock Data: Burndown
  const burnDownData = [
    { day: '12/1', ideal: 40, actual: 40 },
    { day: '12/3', ideal: 35, actual: 38 },
    { day: '12/5', ideal: 30, actual: 32 },
    { day: '12/7', ideal: 25, actual: 28 },
    { day: '12/9', ideal: 20, actual: 20 },
    { day: '12/11', ideal: 15, actual: 12 },
    { day: '12/14', ideal: 0, actual: 5 },
  ];

  const handleSprintClick = (sprint: Sprint) => {
    setSelectedSprint(sprint);
    setView('detail');
  };

  const getStatusBadge = (status: Sprint['status']) => {
    switch (status) {
      case 'running':
        return <span className="text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-xs">进行中</span>;
      case 'planned':
        return <span className="text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-xs">待开始</span>;
      case 'completed':
        return <span className="text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded text-xs">已完成</span>;
    }
  };

  const renderList = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white">
        <div className="flex items-center gap-6">
           <h1 className="text-2xl font-bold text-gray-900">迭代</h1>
           <div className="flex space-x-6">
              <button className="text-pink-700 font-medium border-b-2 border-pink-700 pb-2 px-1">列表</button>
              <button className="text-gray-500 hover:text-gray-800 pb-2 px-1 transition-colors">规划</button>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setIsCreateModalOpen(true)}
             className="bg-pink-700 text-white px-4 py-2 rounded shadow hover:bg-pink-800 flex items-center text-sm transition-colors"
           >
             <Plus className="w-4 h-4 mr-2" /> 新建迭代
           </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-3 bg-white border-b border-gray-200 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">共有 {sprints.length} 项</span>
            <div className="relative ml-2">
                <input type="text" placeholder="请输入迭代名称" className="pl-8 pr-4 py-1.5 border border-gray-300 rounded text-sm w-56 focus:ring-1 focus:ring-pink-500 outline-none" />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
         </div>
         <div className="flex items-center gap-3 text-sm text-gray-600">
             <div className="flex items-center cursor-pointer hover:text-gray-900">
                负责人 <ChevronRight className="w-3 h-3 rotate-90 ml-1" />
             </div>
             <div className="flex items-center cursor-pointer hover:text-gray-900">
                迭代状态 <ChevronRight className="w-3 h-3 rotate-90 ml-1" />
             </div>
         </div>
      </div>

      {/* List Content */}
      <div className="flex-1 overflow-auto bg-white p-6">
         <div className="space-y-4">
            {sprints.map(sprint => (
               <div 
                 key={sprint.id}
                 className="group border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all cursor-pointer bg-white relative overflow-hidden"
                 onClick={() => handleSprintClick(sprint)}
               >
                  <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded flex items-center justify-center text-white font-bold shrink-0 ${sprint.status === 'running' ? 'bg-orange-500' : 'bg-cyan-500'}`}>
                             {sprint.id === 'S1' ? 'Sp' : 'Sp'}
                          </div>
                          <div>
                              <div className="flex items-center gap-3 mb-1">
                                  <h3 className="text-base font-bold text-gray-900 group-hover:text-pink-600 transition-colors">{sprint.title}</h3>
                                  {getStatusBadge(sprint.status)}
                              </div>
                              <p className="text-sm text-gray-500 line-clamp-1">{sprint.goal}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-2">
                          <div className="text-right mr-4">
                              <div className="text-xs text-gray-400 mb-1">工作项进度</div>
                              <div className="flex items-center gap-2 w-32">
                                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${sprint.progress}%` }}></div>
                                  </div>
                                  <span className="text-xs text-gray-600">{sprint.completedWorkItems}/{sprint.totalWorkItems}</span>
                              </div>
                          </div>
                          <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded">
                              <MoreHorizontal className="w-5 h-5" />
                          </button>
                      </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-sm text-gray-500">
                      <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                              <div className="w-5 h-5 bg-amber-500 rounded-full text-white text-[10px] flex items-center justify-center">Lo</div>
                              <span className="text-gray-700">{sprint.owner}</span>
                          </div>
                          <div className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{sprint.startDate} - {sprint.endDate}</span>
                          </div>
                      </div>
                      <div className="flex items-center gap-2">
                          <span>工时规模</span>
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">0h / {sprint.totalHours}h</span>
                      </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );

  const renderDetail = () => {
    if (!selectedSprint) return null;

    return (
      <div className="flex flex-col h-full bg-gray-50">
         {/* Detail Header */}
         <div className="bg-white px-6 py-4 border-b border-gray-200 shadow-sm z-10">
             <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                     <button 
                       onClick={() => setView('list')}
                       className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                     >
                        <ArrowLeft className="w-5 h-5" />
                     </button>
                     <div>
                         <h1 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                             {selectedSprint.title}
                             {getStatusBadge(selectedSprint.status)}
                         </h1>
                     </div>
                 </div>
                 <div className="flex gap-2">
                     <button className="px-3 py-1.5 border border-gray-300 rounded bg-white text-sm hover:bg-gray-50 text-gray-700">编辑</button>
                     {selectedSprint.status === 'running' ? (
                         <button className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200">结束迭代</button>
                     ) : (
                         <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">开始迭代</button>
                     )}
                     <button className="p-1.5 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-50">
                         <MoreHorizontal className="w-4 h-4" />
                     </button>
                 </div>
             </div>
             
             <div className="flex gap-6 text-sm">
                 <div className="flex items-center gap-2 text-gray-600">
                     <Calendar className="w-4 h-4 text-gray-400" />
                     {selectedSprint.startDate} - {selectedSprint.endDate}
                 </div>
                 <div className="flex items-center gap-2 text-gray-600">
                     <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                     负责人: <span className="font-medium text-gray-800">{selectedSprint.owner}</span>
                 </div>
             </div>

             <div className="flex gap-6 mt-6 border-b border-gray-100 -mb-4">
                 <button 
                   onClick={() => setActiveTab('items')}
                   className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'items' ? 'text-pink-700 border-pink-700' : 'text-gray-500 border-transparent hover:text-gray-800'}`}
                 >
                    工作项
                 </button>
                 <button 
                   onClick={() => setActiveTab('board')}
                   className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'board' ? 'text-pink-700 border-pink-700' : 'text-gray-500 border-transparent hover:text-gray-800'}`}
                 >
                    看板
                 </button>
                 <button 
                   onClick={() => setActiveTab('overview')}
                   className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'overview' ? 'text-pink-700 border-pink-700' : 'text-gray-500 border-transparent hover:text-gray-800'}`}
                 >
                    概览
                 </button>
                 <button className="pb-3 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-800">
                    迭代文档
                 </button>
             </div>
         </div>

         {/* Tab Content */}
         <div className="flex-1 overflow-auto p-6">
             {activeTab === 'items' && (
                 <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                     <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                         <div className="flex gap-2">
                             <button className="text-sm font-medium text-gray-700 px-3 py-1 rounded bg-white border border-gray-200 shadow-sm">所有</button>
                             <button className="text-sm font-medium text-gray-500 px-3 py-1 rounded hover:bg-gray-200 transition-colors">需求</button>
                             <button className="text-sm font-medium text-gray-500 px-3 py-1 rounded hover:bg-gray-200 transition-colors">任务</button>
                             <button className="text-sm font-medium text-gray-500 px-3 py-1 rounded hover:bg-gray-200 transition-colors">缺陷</button>
                         </div>
                         <div className="flex items-center gap-2">
                             <div className="relative">
                                 <input type="text" placeholder="搜索工作项" className="pl-8 pr-4 py-1.5 border border-gray-300 rounded text-sm w-48 focus:ring-1 focus:ring-pink-500 outline-none bg-white" />
                                 <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                             </div>
                             <button className="text-gray-500 hover:bg-gray-200 p-1.5 rounded"><Filter className="w-4 h-4" /></button>
                         </div>
                     </div>
                     <table className="w-full text-left text-sm">
                         <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                             <tr>
                                 <th className="px-4 py-3 w-10"><input type="checkbox" className="rounded border-gray-300" /></th>
                                 <th className="px-4 py-3">ID</th>
                                 <th className="px-4 py-3">标题</th>
                                 <th className="px-4 py-3">状态</th>
                                 <th className="px-4 py-3">优先级</th>
                                 <th className="px-4 py-3">负责人</th>
                                 <th className="px-4 py-3">操作</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100">
                             {sprintItems.map(item => (
                                 <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                                     <td className="px-4 py-3"><input type="checkbox" className="rounded border-gray-300" /></td>
                                     <td className="px-4 py-3 text-gray-500 text-xs font-mono">{item.id}</td>
                                     <td className="px-4 py-3">
                                         <div className="flex items-center gap-2">
                                             {item.type === 'Bug' ? <AlertCircle className="w-4 h-4 text-red-500" /> : <CheckSquare className="w-4 h-4 text-blue-500" />}
                                             <span className="text-gray-800 font-medium group-hover:text-blue-600 cursor-pointer">{item.title}</span>
                                         </div>
                                     </td>
                                     <td className="px-4 py-3">
                                         {item.status === 'Done' ? (
                                             <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs flex items-center w-fit gap-1"><CheckCircle2 className="w-3 h-3" /> 已完成</span>
                                         ) : item.status === 'InProgress' ? (
                                             <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs flex items-center w-fit gap-1"><Clock className="w-3 h-3" /> 进行中</span>
                                         ) : (
                                             <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs flex items-center w-fit gap-1">待办</span>
                                         )}
                                     </td>
                                     <td className="px-4 py-3">
                                         <span className={`text-xs px-2 py-0.5 rounded border ${
                                             item.priority === 'High' ? 'text-red-600 bg-red-50 border-red-100' : 'text-orange-600 bg-orange-50 border-orange-100'
                                         }`}>{item.priority === 'High' ? '紧急' : '普通'}</span>
                                     </td>
                                     <td className="px-4 py-3">
                                         <div className="flex items-center gap-2">
                                             <div className="w-5 h-5 bg-amber-500 rounded-full text-white text-[10px] flex items-center justify-center">Lo</div>
                                             <span className="text-gray-600 text-xs">{item.owner}</span>
                                         </div>
                                     </td>
                                     <td className="px-4 py-3 text-gray-400">
                                         <MoreHorizontal className="w-4 h-4 cursor-pointer hover:text-gray-600" />
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
             )}

             {activeTab === 'board' && (
                 <div className="flex h-full gap-4 overflow-x-auto pb-2">
                    {/* Columns */}
                    {['ToDo', 'InProgress', 'Done'].map(status => (
                        <div key={status} className="flex-1 min-w-[300px] bg-gray-100/70 rounded-lg flex flex-col max-h-full border border-gray-200">
                            <div className="p-3 font-semibold text-gray-700 flex justify-between items-center border-b border-gray-200 bg-gray-50 rounded-t-lg">
                                <span className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${status === 'Done' ? 'bg-green-500' : status === 'InProgress' ? 'bg-blue-500' : 'bg-gray-400'}`}></span>
                                    {status === 'ToDo' ? '待办' : status === 'InProgress' ? '进行中' : '已完成'}
                                </span>
                                <span className="bg-white border border-gray-200 px-2 py-0.5 rounded-full text-xs text-gray-600 font-medium shadow-sm">
                                    {sprintItems.filter(i => i.status === status).length}
                                </span>
                            </div>
                            <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                                {sprintItems.filter(i => i.status === status).map(item => (
                                    <div key={item.id} className="bg-white p-3 rounded-md shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs text-gray-400 font-mono bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 group-hover:border-blue-100 group-hover:text-blue-500 transition-colors">{item.id}</span>
                                            <MoreHorizontal className="w-4 h-4 text-gray-300 hover:text-gray-600" />
                                        </div>
                                        <div className="mb-3 text-sm font-medium text-gray-800 line-clamp-2 leading-snug">
                                            {item.type === 'Bug' && <AlertCircle className="w-3.5 h-3.5 text-red-500 inline mr-1.5 -mt-0.5" />}
                                            {item.type === 'Feature' && <CheckSquare className="w-3.5 h-3.5 text-blue-500 inline mr-1.5 -mt-0.5" />}
                                            {item.type === 'Task' && <CheckSquare className="w-3.5 h-3.5 text-sky-400 inline mr-1.5 -mt-0.5" />}
                                            <span className="group-hover:text-blue-600 transition-colors">{item.title}</span>
                                        </div>
                                        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 bg-amber-500 rounded-full text-white text-[10px] flex items-center justify-center ring-2 ring-white">Lo</div>
                                                <span className="text-xs text-gray-500">{item.owner}</span>
                                            </div>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                                item.priority === 'High' ? 'text-red-600 border-red-100 bg-red-50' : 
                                                item.priority === 'Medium' ? 'text-orange-600 border-orange-100 bg-orange-50' : 
                                                'text-gray-600 border-gray-100 bg-gray-50'
                                            }`}>
                                                {item.priority === 'High' ? 'High' : item.priority}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                 </div>
             )}

             {activeTab === 'overview' && (
                 <div className="grid grid-cols-2 gap-6">
                     <div className="col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                         <div className="flex justify-between items-center mb-6">
                             <h3 className="font-bold text-gray-900 flex items-center gap-2"><TrendingDown className="w-5 h-5 text-gray-500" /> 燃尽图</h3>
                             <div className="flex gap-3 text-xs">
                                 <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-gray-300 mr-2"></span> 参考线</span>
                                 <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-2"></span> 剩余工时</span>
                             </div>
                         </div>
                         <div className="h-80">
                             <ResponsiveContainer width="100%" height="100%">
                                 <LineChart data={burnDownData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                     <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} dy={10} />
                                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                                     <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                     <Line type="monotone" dataKey="ideal" stroke="#d1d5db" strokeDasharray="5 5" dot={false} strokeWidth={2} name="参考线" />
                                     <Line type="monotone" dataKey="actual" stroke="#f59e0b" strokeWidth={3} dot={{r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff'}} activeDot={{ r: 6 }} name="剩余工时" />
                                 </LineChart>
                             </ResponsiveContainer>
                         </div>
                     </div>
                     <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                         <h3 className="font-bold text-gray-900 mb-4">概览统计</h3>
                         <div className="space-y-4">
                             <div className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-100">
                                 <span className="text-sm text-gray-600">总任务数</span>
                                 <span className="text-lg font-bold text-gray-900">{selectedSprint.totalWorkItems}</span>
                             </div>
                             <div className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-100">
                                 <span className="text-sm text-gray-600">已完成</span>
                                 <span className="text-lg font-bold text-green-600">{selectedSprint.completedWorkItems}</span>
                             </div>
                             <div className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-100">
                                 <span className="text-sm text-gray-600">剩余工时</span>
                                 <span className="text-lg font-bold text-orange-500">186h</span>
                             </div>
                         </div>
                     </div>
                     <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                         <h3 className="font-bold text-gray-900 mb-4">成员负载</h3>
                         <div className="flex items-center gap-3 mb-3">
                             <div className="w-8 h-8 bg-amber-500 rounded-full text-white text-xs flex items-center justify-center">Lo</div>
                             <div className="flex-1">
                                 <div className="flex justify-between text-sm mb-1">
                                     <span className="font-medium">looking4id</span>
                                     <span className="text-gray-500">85%</span>
                                 </div>
                                 <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                     <div className="h-full bg-blue-500 w-[85%]"></div>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
             )}
         </div>
      </div>
    );
  };

  return (
    <>
      {view === 'list' ? renderList() : renderDetail()}

      {/* Create Modal */}
      <Modal
         isOpen={isCreateModalOpen}
         onClose={() => setIsCreateModalOpen(false)}
         title="新建迭代"
         size="lg"
         footer={
            <>
               <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">取消</button>
               <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 bg-pink-700 text-white rounded text-sm hover:bg-pink-800">确定</button>
            </>
         }
      >
         <div className="space-y-4">
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">迭代名称 <span className="text-red-500">*</span></label>
                 <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-pink-500 outline-none" placeholder="例如: Sprint 3: 支付模块优化" autoFocus />
             </div>
             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">开始时间</label>
                     <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-pink-500 outline-none" />
                 </div>
                 <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">结束时间</label>
                     <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-pink-500 outline-none" />
                 </div>
             </div>
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">负责人</label>
                 <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:ring-pink-500 outline-none">
                     <option>looking4id</option>
                 </select>
             </div>
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">迭代目标</label>
                 <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-24 resize-none focus:ring-pink-500 outline-none" placeholder="本次迭代的主要目标..."></textarea>
             </div>
         </div>
      </Modal>
    </>
  );
};

export default Iterations;
