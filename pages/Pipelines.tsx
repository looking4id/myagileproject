
import React, { useState } from 'react';
import { Search, RotateCw, Plus, Edit2, MoreHorizontal, Play, CheckCircle2, XCircle, GitBranch, Settings, ArrowLeft } from 'lucide-react';
import Modal from '../components/Modal';
import { PipelineData, Stage, Job, PipelineVariable } from '../types';
import { StageColumn } from '../components/pipeline/StageColumn';
import { ConfigDrawer, JobConfigForm, JOB_TYPES } from '../components/pipeline/ConfigDrawer';
import { BasicInfoView } from '../components/pipeline/BasicInfoView';
import { AdvancedSettingsView } from '../components/pipeline/AdvancedSettingsView';
import { VariablesView } from '../components/pipeline/VariablesView';
import { LogViewer } from '../components/pipeline/LogViewer';
import { Icons } from '../components/pipeline/Icons';

const Pipelines: React.FC = () => {
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);

  // --- List View Data ---
  const pipelinesList = [
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

  // --- Editor State ---
  const [pipelineData, setPipelineData] = useState<PipelineData>({
    id: 'pl-demo-01',
    name: '商城后端服务构建部署',
    description: '用于构建和部署商城后端服务的标准流水线',
    variables: [
        { id: 'v1', name: 'ENV', type: 'enum', defaultValue: 'dev', description: '部署环境' },
        { id: 'v2', name: 'VERSION', type: 'string', defaultValue: '1.0.0', description: '版本号' }
    ],
    settings: { timeout: 60, retryCount: 1 },
    stages: [
      {
        id: 'stage-1',
        name: '代码检出',
        isParallel: false,
        groups: [
          [{ id: 'job-1', name: '拉取代码', type: 'git-source', config: { repo: 'demo/shop-backend', branch: 'master' } }]
        ]
      },
      {
        id: 'stage-2',
        name: '构建与测试',
        isParallel: true,
        groups: [
          [{ id: 'job-2', name: 'Maven 构建', type: 'build-maven', config: { jdkVersion: 'jdk-11', mvnCommand: 'clean package' } }],
          [{ id: 'job-3', name: '单元测试', type: 'test-maven', config: {} }]
        ]
      },
      {
        id: 'stage-3',
        name: '部署',
        isParallel: false,
        groups: [
          [{ id: 'job-4', name: '部署到开发环境', type: 'deploy', config: { namespace: 'dev' } }]
        ]
      }
    ]
  });

  const [activeTab, setActiveTab] = useState<'flow' | 'vars' | 'settings' | 'info'>('flow');
  const [configDrawerOpen, setConfigDrawerOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [draggedStageIndex, setDraggedStageIndex] = useState<number | null>(null);
  const [viewingLogsJob, setViewingLogsJob] = useState<Job | null>(null);

  // --- Editor Actions ---

  const handleEditJob = (job: Job) => {
    setSelectedJob(job);
    setSelectedStage(null);
    setConfigDrawerOpen(true);
  };

  const handleEditStage = (stage: Stage) => {
    setSelectedStage(stage);
    setSelectedJob(null);
    setConfigDrawerOpen(true);
  };

  const handleJobUpdate = (updatedJob: Job) => {
    setPipelineData(prev => ({
      ...prev,
      stages: prev.stages.map(stage => ({
        ...stage,
        groups: stage.groups.map(group => group.map(job => job.id === updatedJob.id ? updatedJob : job))
      }))
    }));
    // Keep selected job updated in local state if drawer is open
    if (selectedJob?.id === updatedJob.id) {
        setSelectedJob(updatedJob);
    }
  };

  const handleStageUpdate = (updatedStage: Stage) => {
      setPipelineData(prev => ({
          ...prev,
          stages: prev.stages.map(s => s.id === updatedStage.id ? updatedStage : s)
      }));
      setConfigDrawerOpen(false);
  };

  const handleAddStage = () => {
    const newStage: Stage = {
      id: `stage-${Date.now()}`,
      name: '新阶段',
      isParallel: false,
      groups: [[]]
    };
    setPipelineData(prev => ({ ...prev, stages: [...prev.stages, newStage] }));
  };

  const handleDeleteStage = (stageId: string) => {
    if (confirm('确定删除该阶段吗？')) {
      setPipelineData(prev => ({ ...prev, stages: prev.stages.filter(s => s.id !== stageId) }));
    }
  };

  const handleAddJob = (stageId: string, groupIndex: number = 0) => {
    const newJob: Job = {
      id: `job-${Date.now()}`,
      name: '新任务',
      type: 'script',
      config: {}
    };

    setPipelineData(prev => ({
      ...prev,
      stages: prev.stages.map(stage => {
        if (stage.id !== stageId) return stage;
        const newGroups = [...stage.groups];
        // If adding to a specific group (for serial) or creating a new parallel group
        if (groupIndex < newGroups.length) {
             // Add to existing group (serial flow inside stage)
             newGroups[groupIndex] = [...newGroups[groupIndex], newJob];
        } else {
             // New parallel group (if supported by data model logic, usually Stage has groups[] where each group is parallel to others, wait. 
             // My data model: `groups: Job[][]`. Visual logic: each `groups[i]` is a "row"? 
             // Actually `StageColumn` renders `stage.groups.map` as rows. 
             // If `isParallel` is true, usually jobs are parallel. 
             // Let's assume `groups` is a list of job chains.
             newGroups.push([newJob]);
        }
        return { ...stage, groups: newGroups };
      })
    }));
    
    // Auto open edit
    handleEditJob(newJob);
  };

  const handleDeleteJob = (stageId: string, jobId: string) => {
    setPipelineData(prev => ({
      ...prev,
      stages: prev.stages.map(stage => {
        if (stage.id !== stageId) return stage;
        return {
          ...stage,
          groups: stage.groups.map(g => g.filter(j => j.id !== jobId)).filter(g => g.length > 0)
        };
      })
    }));
  };

  // Drag & Drop
  const onDragStart = (index: number) => setDraggedStageIndex(index);
  const onDragEnter = (index: number) => {
    if (draggedStageIndex === null || draggedStageIndex === index) return;
    const newStages = [...pipelineData.stages];
    const item = newStages[draggedStageIndex];
    newStages.splice(draggedStageIndex, 1);
    newStages.splice(index, 0, item);
    setPipelineData({ ...pipelineData, stages: newStages });
    setDraggedStageIndex(index);
  };
  const onDragEnd = () => setDraggedStageIndex(null);

  const renderEditor = () => (
    <div className="flex flex-col h-full bg-gray-50">
        {/* Editor Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm z-20">
            <div className="flex items-center gap-4">
                <button onClick={() => setView('list')} className="p-1 hover:bg-gray-100 rounded text-gray-500">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex flex-col">
                    <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        {pipelineData.name}
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs border border-blue-100 font-normal">编辑中</span>
                    </h1>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex bg-gray-100 rounded p-1">
                    {[
                        { id: 'flow', label: '流程编排', icon: Icons.Workflow },
                        { id: 'vars', label: '变量', icon: Icons.Box },
                        { id: 'settings', label: '高级设置', icon: Icons.Settings },
                        { id: 'info', label: '基本信息', icon: Icons.FileText }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center px-3 py-1.5 text-sm font-medium rounded transition-all ${
                                activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            <tab.icon className="w-4 h-4 mr-2" />
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="h-6 w-px bg-gray-200 mx-2"></div>
                <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
                    <Icons.Save className="w-4 h-4 mr-1" /> 保存
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm flex items-center transition-colors shadow-sm">
                    <Icons.Play className="w-4 h-4 mr-2" /> 运行
                </button>
            </div>
        </div>

        {/* Editor Canvas */}
        <div className="flex-1 overflow-hidden relative">
            {activeTab === 'flow' && (
                <div className="absolute inset-0 overflow-x-auto overflow-y-hidden bg-[#f8f9fa] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
                    <div className="flex h-full items-center px-10 min-w-max py-8">
                        {pipelineData.stages.map((stage, index) => (
                            <StageColumn 
                                key={stage.id}
                                stage={stage}
                                index={index}
                                isFirst={index === 0}
                                isLast={index === pipelineData.stages.length - 1}
                                isDragging={draggedStageIndex === index}
                                onAddJob={handleAddJob}
                                onEditJob={handleEditJob}
                                onDeleteJob={handleDeleteJob}
                                onDeleteStage={handleDeleteStage}
                                onEditStage={handleEditStage}
                                onAddStage={handleAddStage}
                                onDragStart={onDragStart}
                                onDragEnter={onDragEnter}
                                onDragEnd={onDragEnd}
                                onViewLogs={(job) => setViewingLogsJob(job)}
                            />
                        ))}
                        
                        {/* End Add Button */}
                        <div className="flex flex-col items-center justify-center mx-6 opacity-50 hover:opacity-100 transition-opacity">
                            <button 
                                onClick={handleAddStage}
                                className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-50 transition-all"
                            >
                                <Icons.Plus className="w-6 h-6" />
                            </button>
                            <span className="mt-2 text-sm text-gray-400 font-medium">结束</span>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'vars' && (
                <div className="h-full overflow-y-auto bg-gray-50">
                    <VariablesView 
                        variables={pipelineData.variables} 
                        onUpdate={(vars) => setPipelineData({...pipelineData, variables: vars})} 
                    />
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="h-full overflow-y-auto bg-gray-50">
                    <AdvancedSettingsView 
                        data={pipelineData} 
                        onChange={setPipelineData} 
                    />
                </div>
            )}

            {activeTab === 'info' && (
                <div className="h-full overflow-y-auto bg-gray-50">
                    <BasicInfoView 
                        data={pipelineData} 
                        onChange={setPipelineData} 
                    />
                </div>
            )}
        </div>

        {/* Config Drawer */}
        <ConfigDrawer
            isOpen={configDrawerOpen}
            onClose={() => setConfigDrawerOpen(false)}
            title={selectedJob ? '编辑任务' : '编辑阶段'}
            onSave={() => setConfigDrawerOpen(false)}
        >
            {selectedJob && (
                <JobConfigForm 
                    job={selectedJob} 
                    onChange={handleJobUpdate} 
                />
            )}
            {selectedStage && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">阶段名称</label>
                        <input 
                            type="text" 
                            value={selectedStage.name}
                            onChange={(e) => handleStageUpdate({...selectedStage, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="flex items-center space-x-2">
                            <input 
                                type="checkbox"
                                checked={selectedStage.isParallel !== false}
                                onChange={(e) => handleStageUpdate({...selectedStage, isParallel: e.target.checked})}
                                className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">并行执行该阶段内的任务组</span>
                        </label>
                    </div>
                </div>
            )}
        </ConfigDrawer>

        {/* Log Viewer Overlay */}
        {viewingLogsJob && (
            <LogViewer job={viewingLogsJob} onClose={() => setViewingLogsJob(null)} />
        )}
    </div>
  );

  return view === 'list' ? (
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
               <span className="text-sm text-gray-600 ml-2">共有 {pipelinesList.length} 项</span>
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
                   {pipelinesList.map(pipeline => (
                       <tr key={pipeline.id} className="hover:bg-gray-50 transition-colors">
                           <td className="px-6 py-4">
                               <div 
                                  className="text-gray-900 font-medium hover:text-blue-600 cursor-pointer"
                                  onClick={() => setView('editor')} // Go to editor on click
                                >
                                  {pipeline.name}
                                </div>
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
                                   <button 
                                      onClick={() => setView('editor')}
                                      className="text-gray-400 hover:text-gray-600"
                                   >
                                      <Edit2 className="w-4 h-4" />
                                   </button>
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
                <button 
                    onClick={() => {
                        setIsCreateModalOpen(false);
                        setView('editor');
                    }}
                    className="px-4 py-2 bg-pink-700 text-white rounded text-sm hover:bg-pink-800"
                >
                    创建
                </button>
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
  ) : renderEditor();
};

export default Pipelines;
