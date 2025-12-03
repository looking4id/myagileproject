
import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Legend
} from 'recharts';
import { 
  MoreHorizontal, ChevronRight, Layers, Box, FileText, 
  CheckSquare, AlertCircle, Clock, Calendar, Zap, 
  ArrowUpRight, User, Activity
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [activeChart, setActiveChart] = useState<'load' | 'velocity' | 'burndown' | 'cumulative'>('load');

  // Mock Data
  const metricsData = [
    { name: 'Completed', value: 16, color: '#fca5a5' }, // Pink-300
    { name: 'Remaining', value: 84, color: '#f3f4f6' },
  ];
  const delayData = [
    { name: 'Delayed', value: 0, color: '#f3f4f6' },
    { name: 'OnTime', value: 100, color: '#4ade80' },
  ];
  const typeData = [
    { name: 'Feature', value: 60, color: '#3b82f6' },
    { name: 'Bug', value: 30, color: '#ef4444' },
    { name: 'Task', value: 10, color: '#f59e0b' },
  ];

  // Chart Datasets
  const memberLoadData = [
    { name: 'looking4id', task: 12, bug: 4 },
    { name: 'dev01', task: 8, bug: 2 },
    { name: 'qa01', task: 5, bug: 8 },
    { name: 'pm01', task: 15, bug: 0 },
  ];

  const velocityData = [
    { name: 'Sprint 1', planned: 20, completed: 18 },
    { name: 'Sprint 2', planned: 24, completed: 20 },
    { name: 'Sprint 3', planned: 22, completed: 22 },
    { name: 'Sprint 4', planned: 28, completed: 25 },
    { name: 'Sprint 5', planned: 30, completed: 15 },
  ];

  const burndownData = [
    { day: '12/01', ideal: 100, actual: 100 },
    { day: '12/03', ideal: 80, actual: 85 },
    { day: '12/05', ideal: 60, actual: 65 },
    { day: '12/07', ideal: 40, actual: 45 },
    { day: '12/09', ideal: 20, actual: 30 },
    { day: '12/11', ideal: 0, actual: 15 },
  ];

  const cumulativeData = [
    { day: '11/01', created: 5, resolved: 0 },
    { day: '11/08', created: 15, resolved: 5 },
    { day: '11/15', created: 25, resolved: 12 },
    { day: '11/22', created: 35, resolved: 20 },
    { day: '11/29', created: 48, resolved: 35 },
    { day: '12/06', created: 60, resolved: 45 },
  ];

  const workItems = [
    { id: 'ICQMCD', title: '【示例缺陷】手动开票时小概率遇到发票金额错误', type: 'Bug', status: 'Fixing', priority: 'High', due: '今天' },
    { id: 'ICQMC8', title: '【示例需求】开票完成后支持发送邮件', type: 'Req', status: 'ToDo', priority: 'High', due: '明天' },
    { id: 'ICQMCA', title: '【示例需求】开票完成后支持发送短信', type: 'Req', status: 'ToDo', priority: 'Medium', due: '3天后' },
    { id: 'ICQMC9', title: '【示例需求】订单页面支持查看开票进度', type: 'Req', status: 'InProgress', priority: 'Low', due: '本周' },
    { id: 'ICQMC6', title: '【示例任务】后端任务：点赞功能开发', type: 'Task', status: 'Done', priority: 'Medium', due: '已完成' },
  ];

  const activities = [
    { user: 'looking4id', action: '创建了缺陷', target: '#ICQMCD 【示例缺陷】手动开票时...', time: '8月2日 20:24' },
    { user: 'looking4id', action: '创建了需求', target: '#ICQMC8 【示例需求】开票完成后...', time: '8月2日 20:24' },
    { user: 'looking4id', action: '更新了状态', target: '#ICQMC6 【示例任务】后端任务...', time: '1小时前' },
  ];

  const docs = [
    { title: '【示例数据】回顾记录 (Sprint1: 功能优化)', author: 'looking4id', time: '13 小时前' },
    { title: '【示例数据】风险记录 (Sprint2: 自助开票)', author: 'looking4id', time: '4 个月前' },
    { title: '【示例数据】评审记录 (Sprint2: 自助开票)', author: 'looking4id', time: '4 个月前' },
  ];

  const MetricCircle = ({ title, value, data, color }: any) => (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-20 h-20">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={28}
              outerRadius={38}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-700">
          {value}%
        </div>
      </div>
      <span className="text-xs text-gray-500 mt-2">{title}</span>
    </div>
  );

  return (
    <div className="h-full bg-gray-50 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">项目概览</h1>
        <div className="flex gap-2">
           <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-50 shadow-sm">编辑布局</button>
           <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-50 shadow-sm"><MoreHorizontal className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Top Row: Info & Charts */}
        <div className="grid grid-cols-12 gap-6">
          {/* Project Info */}
          <div className="col-span-4 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-6">项目信息</h3>
            <div className="flex justify-around mb-8">
              <MetricCircle title="工作项完成率" value={16} data={metricsData} />
              <MetricCircle title="工作项延误率" value={0} data={delayData} />
              <MetricCircle title="工作项类型" value={100} data={typeData} />
            </div>
            
            <div className="space-y-3 text-sm text-gray-600 bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between">
                <span>项目负责人:</span>
                <span className="text-gray-900 font-medium">looking4id</span>
              </div>
              <div className="flex justify-between">
                <span>项目编号:</span>
                <span className="text-gray-900 font-medium">P1000</span>
              </div>
              <div className="flex justify-between">
                <span>项目状态:</span>
                <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs border border-blue-100">进行中</span>
              </div>
              <div className="pt-2 border-t border-gray-200 mt-2">
                <p className="text-gray-500 text-xs leading-relaxed">
                  这是一个自动创建的示例项目，如不需要可自行删除。包含敏捷开发的完整流程示例。
                </p>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="col-span-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-6 border-b border-transparent">
                 <button 
                   onClick={() => setActiveChart('load')}
                   className={`font-medium border-b-2 pb-1 text-sm transition-colors ${activeChart === 'load' ? 'text-pink-600 border-pink-600' : 'text-gray-500 border-transparent hover:text-gray-800'}`}
                 >
                   成员负荷报表
                 </button>
                 <button 
                   onClick={() => setActiveChart('velocity')}
                   className={`font-medium border-b-2 pb-1 text-sm transition-colors ${activeChart === 'velocity' ? 'text-pink-600 border-pink-600' : 'text-gray-500 border-transparent hover:text-gray-800'}`}
                 >
                   团队速度报表
                 </button>
                 <button 
                   onClick={() => setActiveChart('burndown')}
                   className={`font-medium border-b-2 pb-1 text-sm transition-colors ${activeChart === 'burndown' ? 'text-pink-600 border-pink-600' : 'text-gray-500 border-transparent hover:text-gray-800'}`}
                 >
                   燃尽图
                 </button>
                 <button 
                   onClick={() => setActiveChart('cumulative')}
                   className={`font-medium border-b-2 pb-1 text-sm transition-colors ${activeChart === 'cumulative' ? 'text-pink-600 border-pink-600' : 'text-gray-500 border-transparent hover:text-gray-800'}`}
                 >
                   累计新增趋势
                 </button>
              </div>
              <button className="text-gray-400 hover:text-gray-600"><Zap className="w-4 h-4" /></button>
            </div>
            
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                {activeChart === 'load' ? (
                  <BarChart data={memberLoadData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }} barSize={30}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                    <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="task" stackId="a" fill="#3b82f6" name="任务" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="bug" stackId="a" fill="#ef4444" name="缺陷" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : activeChart === 'velocity' ? (
                  <BarChart data={velocityData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                    <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="planned" fill="#d1d5db" name="计划完成" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="completed" fill="#10b981" name="实际完成" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : activeChart === 'burndown' ? (
                  <LineChart data={burndownData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Line type="monotone" dataKey="ideal" stroke="#d1d5db" strokeDasharray="5 5" name="理想剩余" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="actual" stroke="#f59e0b" name="实际剩余" strokeWidth={3} dot={{r: 4}} />
                  </LineChart>
                ) : (
                  <AreaChart data={cumulativeData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Area type="monotone" dataKey="created" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCreated)" name="累计创建" strokeWidth={2} />
                    <Area type="monotone" dataKey="resolved" stroke="#10b981" fillOpacity={1} fill="url(#colorResolved)" name="累计完成" strokeWidth={2} />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Iteration Strip */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">迭代</h3>
              <button className="p-1 text-gray-400 hover:bg-gray-100 rounded"><ArrowUpRight className="w-4 h-4" /></button>
           </div>
           
           <div className="bg-gray-50 border border-gray-200 rounded-md p-4 flex items-center justify-between">
               <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-orange-500 rounded flex items-center justify-center text-white font-bold text-lg">Sp</div>
                   <div>
                       <div className="flex items-center gap-2 mb-1">
                           <span className="font-bold text-gray-900">Sprint1: 功能优化</span>
                           <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded border border-blue-200">进行中</span>
                       </div>
                       <p className="text-xs text-gray-500">修复微信小程序在线点餐系统所存在的缺陷...</p>
                   </div>
               </div>
               
               <div className="flex items-center gap-8 text-sm">
                   <div className="text-center">
                       <div className="text-gray-500 text-xs mb-1">需求数</div>
                       <div className="font-medium">5</div>
                   </div>
                   <div className="text-center">
                       <div className="text-gray-500 text-xs mb-1">总缺陷</div>
                       <div className="font-medium">3</div>
                   </div>
                   <div className="text-center border-l border-gray-200 pl-8">
                       <div className="text-gray-500 text-xs mb-1">时间进度</div>
                       <div className="font-medium text-gray-900">2025.12.01 - 2025.12.14</div>
                   </div>
                   <div className="w-32">
                        <div className="flex justify-between text-xs mb-1 text-gray-500">
                            <span>工作项进度</span>
                            <span>4/18</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[22%]"></div>
                        </div>
                   </div>
               </div>
           </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-12 gap-6">
           {/* Left Column */}
           <div className="col-span-8 space-y-6">
               {/* Versions */}
               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                   <div className="flex justify-between items-center mb-4">
                       <h3 className="font-bold text-gray-900">版本</h3>
                       <button className="p-1 text-gray-400 hover:bg-gray-100 rounded"><ArrowUpRight className="w-4 h-4" /></button>
                   </div>
                   <div className="space-y-3">
                       <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded transition-colors border-b border-gray-50 last:border-0">
                           <div className="flex items-center gap-3">
                               <span className="bg-pink-700 text-white px-1.5 py-0.5 rounded text-xs font-mono">1.1</span>
                               <span className="text-sm font-medium text-gray-800">【示例数据】协同点餐功能上线</span>
                           </div>
                           <div className="flex items-center gap-6 text-sm text-gray-500">
                               <span>◎ 开发环境</span>
                               <span>2025.08.16</span>
                               <span className="flex items-center gap-1"><User className="w-3 h-3" /> looking4id</span>
                               <span className="text-blue-600">22%</span>
                           </div>
                       </div>
                       <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded transition-colors">
                           <div className="flex items-center gap-3">
                               <span className="bg-pink-700 text-white px-1.5 py-0.5 rounded text-xs font-mono">1.2</span>
                               <span className="text-sm font-medium text-gray-800">【示例数据】自助开票功能上线</span>
                           </div>
                           <div className="flex items-center gap-6 text-sm text-gray-500">
                               <span>◎ 开发环境</span>
                               <span>2025.08.30</span>
                               <span className="flex items-center gap-1"><User className="w-3 h-3" /> looking4id</span>
                               <span className="text-gray-400">0%</span>
                           </div>
                       </div>
                   </div>
               </div>

               {/* Test Plans */}
               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[200px]">
                   <div className="flex justify-between items-center mb-4">
                       <h3 className="font-bold text-gray-900">测试计划</h3>
                       <button className="p-1 text-gray-400 hover:bg-gray-100 rounded"><ArrowUpRight className="w-4 h-4" /></button>
                   </div>
                   <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                       <Box className="w-12 h-12 mb-2 opacity-20" />
                       <span className="text-sm">暂无进行中的测试计划</span>
                   </div>
               </div>

               {/* Documents */}
               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                   <div className="flex justify-between items-center mb-4">
                       <h3 className="font-bold text-gray-900">文档</h3>
                       <button className="p-1 text-gray-400 hover:bg-gray-100 rounded"><ArrowUpRight className="w-4 h-4" /></button>
                   </div>
                   <div className="space-y-4">
                       {docs.map((doc, idx) => (
                           <div key={idx} className="flex items-center justify-between text-sm group cursor-pointer">
                               <div className="flex items-center gap-2">
                                   <FileText className="w-4 h-4 text-blue-500" />
                                   <span className="text-gray-700 group-hover:text-blue-600 transition-colors">{doc.title}</span>
                               </div>
                               <div className="flex items-center gap-4 text-xs text-gray-400">
                                   <div className="flex items-center gap-1">
                                       <div className="w-4 h-4 bg-amber-500 rounded-full text-white text-[9px] flex items-center justify-center">Lo</div>
                                       {doc.author}
                                   </div>
                                   <span>{doc.time}</span>
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
           </div>

           {/* Right Column */}
           <div className="col-span-4 space-y-6">
               {/* My Work */}
               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                   <div className="flex justify-between items-center mb-4">
                       <h3 className="font-bold text-gray-900">我的工作项</h3>
                       <button className="p-1 text-gray-400 hover:bg-gray-100 rounded"><ArrowUpRight className="w-4 h-4" /></button>
                   </div>
                   <div className="flex gap-4 text-xs text-gray-500 border-b border-gray-100 pb-2 mb-3">
                       <button className="text-pink-600 font-medium border-b-2 border-pink-600 pb-1">未完成</button>
                       <button className="hover:text-gray-800 pb-1">今日</button>
                       <button className="hover:text-gray-800 pb-1">本周</button>
                       <button className="hover:text-gray-800 pb-1">已逾期</button>
                   </div>
                   <div className="space-y-3">
                       {workItems.map(item => (
                           <div key={item.id} className="group hover:bg-gray-50 p-2 rounded -mx-2 transition-colors cursor-pointer">
                               <div className="flex items-start gap-2 mb-1">
                                   {item.type === 'Bug' ? <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /> : <CheckSquare className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />}
                                   <span className="text-xs text-gray-400 font-mono shrink-0">{item.id}</span>
                                   <span className="text-sm text-gray-800 line-clamp-1 group-hover:text-blue-600">{item.title}</span>
                               </div>
                               <div className="flex items-center justify-between pl-6 mt-1">
                                   <div className="flex items-center gap-2">
                                       <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                           item.status === 'Done' ? 'bg-gray-100 text-gray-500 border-gray-200' : 
                                           item.status === 'Fixing' ? 'bg-red-50 text-red-600 border-red-100' :
                                           'bg-blue-50 text-blue-600 border-blue-100'
                                       }`}>
                                           {item.status}
                                       </span>
                                       <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                           item.priority === 'High' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-50 text-gray-500 border-gray-200'
                                       }`}>
                                           {item.priority === 'High' ? '紧急' : item.priority}
                                       </span>
                                   </div>
                                   <div className="flex items-center text-xs text-gray-400">
                                       <div className="w-4 h-4 bg-amber-500 rounded-full text-white text-[9px] flex items-center justify-center mr-1">Lo</div>
                                       looking4id
                                       <span className="ml-2 text-red-400">{item.due}</span>
                                   </div>
                               </div>
                           </div>
                       ))}
                   </div>
               </div>

               {/* Activity Stream */}
               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                   <div className="flex justify-between items-center mb-4">
                       <h3 className="font-bold text-gray-900">动态</h3>
                       <button className="p-1 text-gray-400 hover:bg-gray-100 rounded"><ArrowUpRight className="w-4 h-4" /></button>
                   </div>
                   <div className="space-y-6 relative">
                       {/* Timeline Line */}
                       <div className="absolute left-3.5 top-2 bottom-0 w-px bg-gray-100"></div>
                       
                       <div className="relative">
                           <span className="bg-pink-100 text-pink-700 text-[10px] px-1.5 py-0.5 rounded-full relative z-10 border border-pink-200 font-medium">8月</span>
                           <span className="text-xs text-gray-500 ml-2 font-medium">2025-08-02</span>
                       </div>

                       {activities.map((act, idx) => (
                           <div key={idx} className="flex gap-3 relative">
                               <div className="w-7 h-7 bg-amber-500 rounded-full text-white text-xs flex items-center justify-center shrink-0 border-2 border-white shadow-sm z-10">Lo</div>
                               <div className="flex-1 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                   <div className="text-sm text-gray-800">
                                       <span className="font-bold">{act.user}</span> 
                                       <span className="mx-1 text-gray-500">{act.action}</span>
                                   </div>
                                   <div className="text-xs text-blue-600 hover:underline cursor-pointer mt-0.5">{act.target}</div>
                                   <div className="text-xs text-gray-400 mt-1">{act.time}</div>
                               </div>
                           </div>
                       ))}
                       
                       <div className="text-center pt-2">
                           <button className="text-xs text-gray-400 hover:text-gray-600">加载更多</button>
                       </div>
                   </div>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
    