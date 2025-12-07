import React, { useState } from 'react';
import { 
  Search, RotateCw, Plus, Edit2, MoreHorizontal, Play, 
  CheckCircle2, XCircle, GitBranch, Settings, ArrowLeft, 
  Clock, AlertCircle, FileText, User, Terminal, ChevronRight,
  Maximize2, Box, BarChart2, Layout, FileCode, Check, HelpCircle
} from 'lucide-react';
import Modal from '../components/Modal';
import { PipelineData, Stage, Job, PipelineVariable } from '../types';
import { StageColumn } from '../components/pipeline/StageColumn';
import { ConfigDrawer, JobConfigForm } from '../components/pipeline/ConfigDrawer';
import { BasicInfoView } from '../components/pipeline/BasicInfoView';
import { AdvancedSettingsView } from '../components/pipeline/AdvancedSettingsView';
import { VariablesView } from '../components/pipeline/VariablesView';
import { LogViewer } from '../components/pipeline/LogViewer';
import { Icons } from '../components/pipeline/Icons';

// ... (Keep existing Mock Execution Data and Interfaces)
// Mock Execution Data
interface PipelineExecution {
  id: string;
  pipelineId: string;
  status: 'success' | 'failed' | 'running';
  startTime: string;
  duration: string;
  trigger: string;
  branch: string;
  commitId: string;
  stages: {
    id: string;
    name: string;
    status: 'success' | 'failed' | 'running' | 'skipped' | 'pending';
    jobs: {
      id: string;
      name: string;
      status: 'success' | 'failed' | 'running' | 'skipped' | 'pending';
      duration?: string;
      logs?: boolean;
      report?: boolean;
      stats?: { label: string; value: number; color: string }[];
    }[][];
  }[];
}

const mockExecution: PipelineExecution = {
  id: '#2',
  pipelineId: 'pl-demo-01',
  status: 'failed',
  startTime: '2025-12-06 19:35:05',
  duration: '1分5秒',
  trigger: 'ap7430v1p@... • 页面手动触发',
  branch: 'master',
  commitId: '8a2b3c',
  stages: [
    {
      id: 'stage-test',
      name: '测试',
      status: 'failed',
      jobs: [
        [{ 
            id: 'job-scan', 
            name: 'Java 代码扫描', 
            status: 'success', 
            duration: '1分5秒', 
            logs: true,
            report: true,
            stats: [
                { label: '总数', value: 0, color: 'text-gray-500' },
                { label: '阻塞', value: 0, color: 'text-red-500' },
                { label: '严重', value: 0, color: 'text-orange-500' },
                { label: '一般', value: 0, color: 'text-gray-500' }
            ]
        }],
        [{ 
            id: 'job-unit', 
            name: 'Maven 单元测试', 
            status: 'failed', 
            duration: '17秒', 
            logs: true 
        }]
      ]
    },
    {
      id: 'stage-build',
      name: '构建',
      status: 'skipped',
      jobs: [
        [{ id: 'job-build', name: 'Java 构建', status: 'skipped', duration: '0秒' }]
      ]
    },
    {
      id: 'stage-deploy',
      name: '构建', // Prototype shows duplicate name or just stage type
      status: 'skipped',
      jobs: [
        [{ id: 'job-upload', name: 'Java 构建测试上传', status: 'skipped', duration: '0秒' }]
      ]
    }
  ]
};

const Pipelines: React.FC = () => {
  const [view, setView] = useState<'list' | 'execution' | 'editor'>('list');
  const [activePipeline, setActivePipeline] = useState<any>(null); // For list item
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);
  
  // Create Modal State
  const [templateCategory, setTemplateCategory] = useState('org');
  const [createMethod, setCreateMethod] = useState<'visual' | 'yaml'>('visual');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Editor State (Keep existing for 'editor' view)
  const [pipelineData, setPipelineData] = useState<PipelineData>({
    id: 'pl-demo-01',
    name: '我的流水线01',
    description: '',
    variables: [],
    settings: { timeout: 60, retryCount: 1 },
    stages: [] // Simplified for editor mock
  });
  const [activeTab, setActiveTab] = useState<'flow' | 'vars' | 'settings' | 'info'>('flow');
  const [viewingLogsJob, setViewingLogsJob] = useState<Job | null>(null);
  
  // Editor View State
  const [configDrawerOpen, setConfigDrawerOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [draggedStageIndex, setDraggedStageIndex] = useState<number | null>(null);

  // --- List View Data ---
  const pipelinesList = [
    {
       id: '1', name: '我的流水线01', status: 'Failed', runId: '#2',
       stages: [
           { name: '测试', status: 'failed' },
           { name: '构建', status: 'skipped' },
           { name: '部署', status: 'skipped' },
       ],
       group: '开发类',
       tags: '--',
       executor: 'ap7430v1p@...',
       time: '2025-12-06 19:35:05'
    }
  ];

  const handlePipelineClick = (pipeline: any) => {
      setActivePipeline(pipeline);
      setView('execution');
  };

  // Editor Actions (Reuse from previous implementation)
  const handleEditJob = (job: Job) => { setSelectedJob(job); setSelectedStage(null); setConfigDrawerOpen(true); };
  const handleEditStage = (stage: Stage) => { setSelectedStage(stage); setSelectedJob(null); setConfigDrawerOpen(true); };
  const handleJobUpdate = (updatedJob: Job) => { /* ... simplified update logic */ setConfigDrawerOpen(false); };
  const handleStageUpdate = (updatedStage: Stage) => { /* ... simplified update logic */ setConfigDrawerOpen(false); };
  const handleAddStage = () => {};
  const handleDeleteStage = (id: string) => {};
  const handleAddJob = (sid: string) => {};
  const handleDeleteJob = (sid: string, jid: string) => {};
  const handleCopyStage = (s: Stage) => {};
  const onDragStart = (i: number) => setDraggedStageIndex(i);
  const onDragEnter = (i: number) => {};
  const onDragEnd = () => setDraggedStageIndex(null);


  const getStatusColor = (status: string) => {
      switch(status) {
          case 'success': return 'text-green-500';
          case 'failed': return 'text-red-500';
          case 'running': return 'text-blue-500';
          default: return 'text-gray-400';
      }
  };

  const getStatusBg = (status: string) => {
      switch(status) {
          case 'success': return 'bg-white border-l-4 border-l-green-500'; // Green accent
          case 'failed': return 'bg-white border-l-4 border-l-red-500'; // Red accent
          case 'running': return 'bg-white border-l-4 border-l-blue-500';
          default: return 'bg-white border-l-4 border-l-gray-300';
      }
  };

  const getStatusIcon = (status: string) => {
      switch(status) {
          case 'success': return <div className="bg-green-500 rounded-full p-0.5"><CheckCircle2 className="w-4 h-4 text-white" /></div>;
          case 'failed': return <div className="bg-red-500 rounded-full p-0.5"><XCircle className="w-4 h-4 text-white" /></div>;
          case 'running': return <RotateCw className="w-5 h-5 text-blue-500 animate-spin" />;
          default: return <Clock className="w-5 h-5 text-gray-300" />;
      }
  };

  // --- Render Execution Detail View ---
  const renderExecution = () => (
      // ... (Keep existing execution view render code)
      <div className="flex flex-col h-full bg-[#f7f8fa]">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                      <button onClick={() => setView('list')} className="p-1 hover:bg-gray-100 rounded text-gray-500">
                          <ArrowLeft className="w-5 h-5" />
                      </button>
                      <h1 className="text-xl font-bold text-gray-900">{activePipeline?.name || '我的流水线01'}</h1>
                      <div className="flex gap-1 ml-6 text-sm bg-gray-100 p-1 rounded">
                          <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded font-medium text-xs">最近运行</button>
                          <button className="px-3 py-1 text-gray-600 hover:text-gray-900 text-xs">运行历史</button>
                          <button className="px-3 py-1 text-gray-600 hover:text-gray-900 text-xs">统计报表</button>
                      </div>
                  </div>
                  <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-medium">AP</div>
                      <button 
                        onClick={() => setView('editor')}
                        className="px-4 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50 text-gray-700 bg-white"
                      >
                          编辑
                      </button>
                      <button className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center shadow-sm">
                          运行
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500">
                          <MoreHorizontal className="w-5 h-5" />
                      </button>
                  </div>
              </div>

              {/* Run Info */}
              <div className="flex items-center justify-between text-sm py-2">
                  <div className="flex items-center gap-4">
                      <span className="font-bold text-gray-900 text-lg mr-2">{mockExecution.id}</span>
                      <div className={`flex items-center gap-1 font-medium text-sm ${getStatusColor(mockExecution.status)}`}>
                          {mockExecution.status === 'failed' && <XCircle className="w-4 h-4" />}
                          {mockExecution.status === 'success' && <CheckCircle2 className="w-4 h-4" />}
                          {mockExecution.status === 'failed' ? '运行失败' : '运行成功'}
                      </div>
                      <div className="text-gray-500 flex items-center gap-3 text-xs pl-4 border-l border-gray-200">
                          <span>触发信息 <span className="text-gray-900">{mockExecution.trigger.split('•')[0]}</span> • {mockExecution.trigger.split('•')[1]}</span>
                          <span className="h-3 w-px bg-gray-300"></span>
                          <span>开始时间 <span className="text-gray-900">{mockExecution.startTime}</span></span>
                          <span className="h-3 w-px bg-gray-300"></span>
                          <span>持续时间 <span className="text-gray-900">{mockExecution.duration}</span></span>
                          <AlertCircle className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                      </div>
                  </div>
                  <div className="flex gap-8 text-center pr-4">
                      <div>
                          <div className="text-xl font-medium text-gray-900">0</div>
                          <div className="text-[10px] text-gray-500">代码变更</div>
                      </div>
                      <div>
                          <div className="text-xl font-medium text-gray-900">0</div>
                          <div className="text-[10px] text-gray-500">运行产物</div>
                      </div>
                      <div>
                          <div className="text-xl font-medium text-gray-900">7</div>
                          <div className="text-[10px] text-gray-500">环境变量</div>
                      </div>
                  </div>
              </div>
          </div>

          {/* Graph Content */}
          <div className="flex-1 overflow-auto p-8">
              <div className="flex gap-10 min-w-max h-full">
                  {/* Source Node */}
                  <div className="w-48 shrink-0 flex flex-col relative">
                      <div className="flex justify-between items-center mb-4 text-sm text-gray-500 pl-1">
                          <span>流水线源 · 0</span>
                          <span className="flex items-center gap-1 cursor-pointer hover:text-blue-600"><Code2 className="w-3 h-3" /> <ChevronRight className="w-3 h-3" /></span>
                      </div>
                      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm h-32 flex flex-col items-center justify-center text-gray-400 border-dashed">
                          <span className="text-sm">暂未设置</span>
                      </div>
                      {/* Connector Line */}
                      <div className="absolute top-24 -right-10 w-10 h-px bg-gray-300"></div>
                  </div>

                  {/* Stages */}
                  {mockExecution.stages.map((stage, i) => (
                      <div key={stage.id} className="w-80 shrink-0 flex flex-col relative group/stage">
                          <div className="text-sm text-gray-500 mb-4 pl-1">{stage.name}</div>
                          
                          <div className="flex flex-col gap-6 relative">
                              {/* Connector Lines between stages */}
                              {i < mockExecution.stages.length - 1 && (
                                  <div className="absolute top-16 -right-10 w-10 h-px bg-gray-300"></div>
                              )}

                              {stage.jobs.map((group, gIdx) => (
                                  <div key={gIdx} className="flex flex-col gap-6">
                                      {group.map((job, jIdx) => (
                                          <div 
                                            key={job.id} 
                                            className={`bg-white rounded-lg shadow-sm border border-gray-200 relative transition-all ${job.status === 'skipped' ? 'opacity-60' : ''}`}
                                          >
                                              {/* Colored Left Border Indicator */}
                                              <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${
                                                  job.status === 'success' ? 'bg-green-500' : 
                                                  job.status === 'failed' ? 'bg-red-500' :
                                                  job.status === 'running' ? 'bg-blue-500' : 'bg-gray-300'
                                              }`}></div>

                                              <div className="p-4 pl-5">
                                                  <div className="flex items-start gap-3 mb-3">
                                                      <div className="mt-0.5">{getStatusIcon(job.status)}</div>
                                                      <div className="flex-1 min-w-0">
                                                          <h3 className="font-medium text-gray-900 truncate text-sm" title={job.name}>{job.name}</h3>
                                                      </div>
                                                  </div>

                                                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                                      <span>{job.duration || '0秒'}</span>
                                                      <div className="flex gap-3">
                                                          {job.report && <span className="flex items-center hover:text-blue-600 cursor-pointer"><FileText className="w-3 h-3 mr-1" /> 扫描报告</span>}
                                                          {job.logs && <span className="flex items-center hover:text-blue-600 cursor-pointer" onClick={() => setViewingLogsJob({ id: job.id, name: job.name, type: 'script', config: {} })}><FileText className="w-3 h-3 mr-1" /> 日志</span>}
                                                      </div>
                                                  </div>

                                                  {job.stats && (
                                                      <div className="grid grid-cols-4 gap-2 text-center mb-2">
                                                          {job.stats.map((stat, idx) => (
                                                              <div key={idx}>
                                                                  <div className={`font-bold text-sm ${stat.color}`}>{stat.value}</div>
                                                                  <div className="text-[10px] text-gray-400">{stat.label}</div>
                                                              </div>
                                                          ))}
                                                      </div>
                                                  )}

                                                  {job.status === 'failed' && (
                                                      <div className="mt-2 pt-2 border-t border-gray-100 bg-red-50/50 -mx-4 -mb-4 p-3 rounded-b-lg">
                                                          <div className="text-xs text-red-500 mb-2 flex items-center">
                                                              运行失败，请查看日志，或尝试<span className="underline cursor-pointer ml-1 text-blue-600">在线调试</span>
                                                          </div>
                                                          <div className="text-right">
                                                              <button className="text-blue-600 text-xs hover:underline flex items-center justify-end gap-1 w-full">
                                                                  <Settings className="w-3 h-3" /> 智能排查 
                                                                  <span className="ml-2">重试</span>
                                                              </button>
                                                          </div>
                                                      </div>
                                                  )}
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              ))}
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* Bottom Zoom Control */}
          <div className="absolute bottom-6 right-6 bg-white border border-gray-200 rounded shadow-sm px-2 py-1 text-xs text-gray-600 flex items-center gap-2">
              <button className="hover:text-gray-900 font-bold text-lg leading-none">-</button>
              <span>100%</span>
              <button className="hover:text-gray-900 font-bold text-lg leading-none">+</button>
              <div className="w-px h-3 bg-gray-200"></div>
              <Maximize2 className="w-3 h-3 cursor-pointer" />
          </div>

          {/* Log Viewer Overlay */}
          {viewingLogsJob && (
              <LogViewer job={viewingLogsJob} onClose={() => setViewingLogsJob(null)} />
          )}
      </div>
  );

  function Code2(props: any) {
      return (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m5 7 5 5-5 5" />
          <path d="m19 7-5 5 5 5" />
        </svg>
      )
  }

  // --- Render Editor --- (Reusing logic)
  const renderEditor = () => (
      <div className="flex flex-col h-full bg-gray-50">
          <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm z-20">
                <div className="flex items-center gap-4">
                    <button onClick={() => setView('list')} className="p-1 hover:bg-gray-100 rounded text-gray-500">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800">编辑: {pipelineData.name}</h1>
                </div>
                {/* Editor Tabs... */}
          </div>
          <div className="flex-1 overflow-hidden relative">
             <div className="absolute inset-0 overflow-auto bg-[#f8f9fa] p-10">
                 {/* Re-use StageColumn logic here... */}
                 <div className="text-center text-gray-400 mt-20">编辑器视图 (点击 "返回" 回到列表)</div>
             </div>
          </div>
      </div>
  );

  return view === 'list' ? (
    <div className="p-6 h-full flex flex-col bg-white">
       <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
             <h1 className="text-2xl font-bold text-gray-900">全部流水线</h1>
             <span className="text-gray-500 text-sm hidden md:inline">流水线提供扫描、构建、部署等插件,完成代码从持续集成到持续部署。</span>
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
                                  onClick={() => handlePipelineClick(pipeline)}
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
                                            <span className="text-xs text-gray-500 mt-1 scale-90">{stage.name}</span>
                                        </div>
                                    ))}
                               </div>
                           </td>
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
                                      onClick={() => { setActivePipeline(pipeline); setView('editor'); }}
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
       
       {/* Create Template Modal */}
       <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="选择流水线模板"
          size="2xl"
          footer={
              <>
                 <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">取消</button>
                 <button onClick={() => { setIsCreateModalOpen(false); setView('editor'); }} className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">创建</button>
              </>
          }
       >
          <div className="flex h-[500px]">
              {/* Categories Sidebar */}
              <div className="w-40 border-r border-gray-200 bg-gray-50 p-2 space-y-1 overflow-y-auto">
                  {[
                      { id: 'org', label: '组织模板', icon: Layout },
                      { id: 'java', label: 'Java', icon: FileCode },
                      { id: 'php', label: 'PHP', icon: FileCode },
                      { id: 'node', label: 'Node.js', icon: FileCode },
                      { id: 'go', label: 'Go', icon: FileCode },
                      { id: 'python', label: 'Python', icon: FileCode },
                      { id: 'net', label: '.NET Core', icon: FileCode },
                      { id: 'cpp', label: 'C++', icon: FileCode },
                      { id: 'mobile', label: '移动端', icon: Layout },
                      { id: 'empty', label: '空模板', icon: Layout },
                      { id: 'other', label: '其他', icon: MoreHorizontal },
                  ].map(cat => (
                      <button
                          key={cat.id}
                          onClick={() => setTemplateCategory(cat.id)}
                          className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                              templateCategory === cat.id ? 'bg-white text-blue-600 shadow-sm font-medium' : 'text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                          <cat.icon className="w-4 h-4 mr-2" />
                          {cat.label}
                      </button>
                  ))}
              </div>

              {/* Main Content */}
              <div className="flex-1 p-6 overflow-y-auto bg-white">
                  {/* Creation Method */}
                  <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">创建方式 <HelpCircle className="w-3 h-3 text-gray-400" /></h3>
                      <div className="grid grid-cols-2 gap-4">
                          <div 
                              onClick={() => setCreateMethod('visual')}
                              className={`border-2 rounded-lg p-3 cursor-pointer flex items-center gap-3 transition-all ${
                                  createMethod === 'visual' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                              }`}
                          >
                              <div className="bg-blue-100 p-2 rounded text-blue-600"><Layout className="w-5 h-5" /></div>
                              <div>
                                  <div className="text-sm font-bold text-gray-900">可视化编排</div>
                                  <div className="text-xs text-gray-500">图形化界面配置流水线</div>
                              </div>
                              {createMethod === 'visual' && <div className="ml-auto bg-blue-500 text-white rounded-full p-0.5"><Check className="w-3 h-3" /></div>}
                          </div>
                          <div 
                              onClick={() => setCreateMethod('yaml')}
                              className={`border-2 rounded-lg p-3 cursor-pointer flex items-center gap-3 transition-all ${
                                  createMethod === 'yaml' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                              }`}
                          >
                              <div className="bg-purple-100 p-2 rounded text-purple-600"><FileCode className="w-5 h-5" /></div>
                              <div>
                                  <div className="text-sm font-bold text-gray-900">YAML 化编排</div>
                                  <div className="text-xs text-gray-500">通过代码文件配置流水线</div>
                              </div>
                              {createMethod === 'yaml' && <div className="ml-auto bg-blue-500 text-white rounded-full p-0.5"><Check className="w-3 h-3" /></div>}
                          </div>
                      </div>
                  </div>

                  {/* Template List */}
                  <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">推荐模板</h3>
                      <div className="space-y-4">
                          {[1, 2].map((i) => (
                              <div 
                                key={i}
                                onClick={() => setSelectedTemplate(`tpl-${i}`)}
                                className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                                    selectedTemplate === `tpl-${i}` ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'
                                }`}
                              >
                                  <div className="flex items-center gap-2 mb-3">
                                      <div className="bg-white p-1 border rounded shadow-sm"><FileCode className="w-4 h-4 text-blue-600" /></div>
                                      <span className="text-sm font-bold text-gray-900">Java · 测试、构建</span>
                                      <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded">云效预置</span>
                                  </div>
                                  
                                  {/* Visual Flow Preview Mock */}
                                  <div className="flex items-center gap-2 overflow-hidden">
                                      <div className="border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-600 bg-gray-50 whitespace-nowrap">Java 代码扫描</div>
                                      <div className="h-px w-4 bg-gray-300"></div>
                                      <div className="border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-600 bg-gray-50 whitespace-nowrap">Maven 单元测试</div>
                                      <div className="h-px w-4 bg-gray-300"></div>
                                      <div className="border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-600 bg-gray-50 whitespace-nowrap">Java 构建上传</div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
       </Modal>
    </div>
  ) : view === 'execution' ? renderExecution() : renderEditor();
};

export default Pipelines;