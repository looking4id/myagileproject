import React, { useState } from 'react';
import { Search, RotateCw, Plus, Edit2, MoreHorizontal, Play, CheckCircle2, XCircle, GitBranch, Settings } from 'lucide-react';
import Modal from '../components/Modal';

const Pipelines: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);

  const pipelines = [
    {
       id: '1', name: '流水线-202212141737', status: 'Failed', runId: '#14',
       stages: [
           { name: '测试', status: 'success' },
           { name: '构建', status: 'success' },
           { name: '阶段1', status: 'failed' },
           { name: '上传', status: 'pending' },
       ],
       group: '开发类',
       tags: '--',
       executor: 'looking4id',
       time: '2025-11-30 01:00:01'
    }
  ];

  return (
    <div className="p-6 h-full flex flex-col">
       <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
             <h1 className="text-2xl font-bold text-gray-900">全部流水线</h1>
             <span className="text-gray-500 text-sm hidden md:inline">流水线提供扫描、构建、部署等插件,完成代码从持续集成到持续部署。</span>
             <a href="#" className="text-blue-600 text-sm hover:underline">前往帮助中心</a>
          </div>
          <button 
             onClick={() => setIsCreateModalOpen(true)}
             className="bg-pink-700 hover:bg-pink-800 text-white px-4 py-2 rounded shadow flex items-center transition-colors"
          >
             <Plus className="w-4 h-4 mr-2" /> 新建流水线
          </button>
       </div>

       {/* Toolbar */}
       <div className="flex items-center justify-between mb-4 bg-white p-2 rounded border border-gray-100 shadow-sm">
           <div className="flex items-center gap-4">
               <span className="text-sm text-gray-600 ml-2">共有 1 项</span>
               <div className="relative">
                   <input 
                      type="text" 
                      placeholder="搜索" 
                      className="pl-3 pr-8 py-1.5 border border-gray-300 rounded text-sm w-64 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                   />
                   <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               </div>
               <button className="text-sm text-gray-600 hover:text-blue-600">清空</button>
           </div>
           
           <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-100 transition-colors">运行状态</button>
              <button className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-100 transition-colors">全部标记</button>
              <button className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-100 transition-colors">默认排序</button>
           </div>
       </div>

       {/* List */}
       <div className="bg-white border border-gray-200 rounded-md flex-1 overflow-auto shadow-sm">
           <table className="w-full text-left text-sm">
               <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                   <tr>
                       <th className="px-6 py-3 font-medium">流水线名称</th>
                       <th className="px-6 py-3 font-medium">运行状态</th>
                       <th className="px-6 py-3 font-medium w-64">运行阶段</th>
                       <th className="px-6 py-3 font-medium">分组名称</th>
                       <th className="px-6 py-3 font-medium">标记</th>
                       <th className="px-6 py-3 font-medium">最近运行人及时间</th>
                       <th className="px-6 py-3 font-medium text-right">操作</th>
                   </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                   {pipelines.map(pipeline => (
                       <tr key={pipeline.id} className="hover:bg-gray-50 transition-colors">
                           <td className="px-6 py-4">
                               <div className="text-gray-900 font-medium hover:text-blue-600 cursor-pointer">{pipeline.name}</div>
                           </td>
                           <td className="px-6 py-4">
                               <div className="flex flex-col">
                                   <div className="flex items-center text-red-500 font-medium mb-1">
                                       <XCircle className="w-4 h-4 mr-1.5" /> 失败
                                   </div>
                                   <span className="text-xs text-gray-400 bg-gray-100 px-1.5 rounded w-fit">{pipeline.runId}</span>
                               </div>
                           </td>
                           <td className="px-6 py-4">
                               <div className="flex items-center justify-between relative">
                                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
                                    {pipeline.stages.map((stage, idx) => (
                                        <div key={idx} className="flex flex-col items-center bg-white px-1 z-0 group relative">
                                            <div className={`w-2.5 h-2.5 rounded-full ${
                                                stage.status === 'success' ? 'bg-green-500' :
                                                stage.status === 'failed' ? 'bg-red-500' :
                                                'bg-white border border-gray-300'
                                            } cursor-pointer hover:scale-125 transition-transform`}></div>
                                            <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                                                {stage.name}: {stage.status}
                                            </div>
                                            <span className="text-xs text-gray-500 mt-1 scale-90">{stage.name}</span>
                                        </div>
                                    ))}
                               </div>
                           </td>
                           <td className="px-6 py-4 text-gray-600">{pipeline.group}</td>
                           <td className="px-6 py-4 text-gray-400">{pipeline.tags}</td>
                           <td className="px-6 py-4">
                               <div className="flex flex-col">
                                   <div className="flex items-center mb-1">
                                       <div className="w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] flex items-center justify-center mr-2">Lo</div>
                                       <span className="text-gray-700">{pipeline.executor}</span>
                                   </div>
                                   <span className="text-xs text-gray-400">{pipeline.time}</span>
                               </div>
                           </td>
                           <td className="px-6 py-4 text-right">
                               <div className="flex items-center justify-end gap-3">
                                   <button 
                                      onClick={() => setIsRunModalOpen(true)}
                                      className="flex items-center text-pink-600 border border-pink-200 px-3 py-1 rounded hover:bg-pink-50 text-xs transition-colors"
                                   >
                                       <Play className="w-3 h-3 mr-1" fill="currentColor" /> 运行
                                   </button>
                                   <button className="text-gray-400 hover:text-gray-600"><Edit2 className="w-4 h-4" /></button>
                                   <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="w-4 h-4" /></button>
                               </div>
                           </td>
                       </tr>
                   ))}
               </tbody>
           </table>
       </div>

       {/* Create Pipeline Modal */}
       <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="新建流水线"
          size="lg"
          footer={
             <>
                <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">取消</button>
                <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 bg-pink-700 text-white rounded text-sm hover:bg-pink-800">创建</button>
             </>
          }
       >
          <div className="space-y-6">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">流水线名称</label>
                <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 outline-none" placeholder="输入流水线名称" />
             </div>
             
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">选择模板</label>
                <div className="grid grid-cols-3 gap-4">
                   {['Java 构建', 'Node.js 构建', 'Go 构建', 'Python 检查', 'Docker 镜像', '空白模板'].map((template) => (
                      <div key={template} className="border border-gray-200 rounded p-4 hover:border-pink-500 hover:bg-pink-50 cursor-pointer transition-colors flex flex-col items-center justify-center text-center h-24">
                          <Settings className="w-6 h-6 text-gray-400 mb-2" />
                          <span className="text-sm font-medium text-gray-700">{template}</span>
                      </div>
                   ))}
                </div>
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">代码源</label>
                <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-2 bg-gray-50">
                    <GitBranch className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">agile-flow-project</span>
                </div>
             </div>
          </div>
       </Modal>

       {/* Run Pipeline Modal */}
       <Modal
          isOpen={isRunModalOpen}
          onClose={() => setIsRunModalOpen(false)}
          title="运行流水线"
          size="md"
          footer={
             <>
                <button onClick={() => setIsRunModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">取消</button>
                <button onClick={() => setIsRunModalOpen(false)} className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">确认运行</button>
             </>
          }
       >
          <div className="space-y-4">
              <div className="p-3 bg-blue-50 text-blue-800 rounded text-sm border border-blue-100">
                  即将运行 <span className="font-bold">流水线-202212141737</span>
              </div>
              
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">选择分支</label>
                  <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      <option>master</option>
                      <option>develop</option>
                      <option>feature/new-ui</option>
                  </select>
              </div>

              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">自定义变量 (可选)</label>
                  <div className="border border-gray-200 rounded bg-gray-50 p-3 text-center text-gray-500 text-sm">
                      暂无自定义变量配置
                  </div>
              </div>
          </div>
       </Modal>
    </div>
  );
};

export default Pipelines;