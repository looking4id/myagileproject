
import React, { useState, useRef, useEffect } from 'react';
import { 
  FlaskConical, ClipboardCheck, FileSpreadsheet, PieChart, 
  Plus, Search, Filter, MoreHorizontal, ChevronDown, 
  Settings, AlertCircle, Clock,
  Calendar, Trash2, Edit2, CheckCircle2, PlayCircle, XCircle,
  User
} from 'lucide-react';
import Modal from '../components/Modal';

type TestModule = 'cases' | 'reviews' | 'plans' | 'reports';

interface TestPlan {
  id: string;
  title: string;
  status: '未开始' | '进行中' | '已完成' | '阻塞';
  owner: string;
  passed: number;
  total: number;
  percent: number;
  startDate: string;
  endDate: string;
}

const Testing: React.FC = () => {
  const [activeModule, setActiveModule] = useState<TestModule>('cases');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Detail Modal States
  const [selectedTestCase, setSelectedTestCase] = useState<any>(null);
  const [isTestCaseDetailOpen, setIsTestCaseDetailOpen] = useState(false);
  
  const [selectedTestReview, setSelectedTestReview] = useState<any>(null);
  const [isTestReviewDetailOpen, setIsTestReviewDetailOpen] = useState(false);

  const [selectedTestPlan, setSelectedTestPlan] = useState<TestPlan | null>(null);
  const [isTestPlanDetailOpen, setIsTestPlanDetailOpen] = useState(false);

  // Form State for Create/Edit
  const [formData, setFormData] = useState<any>({});

  // Column Width State
  const [columnWidths, setColumnWidths] = useState<any>({
    cases: {
      id: 100,
      title: 400,
      version: 100,
      result: 140,
      type: 100,
      priority: 80,
      maintainer: 140,
      cited: 80,
    },
    reviews: {
      title: 400,
      status: 120,
      owner: 140,
      progress: 180,
      result: 200,
      time: 250,
    },
    plans: {
       status: 100,
       title: 400,
       owner: 140,
       progress: 200,
       time: 250
    },
    reports: {
      title: 400,
      creator: 150,
      plan: 200,
      date: 180,
    }
  });

  const resizingRef = useRef<{ module: TestModule, col: string, startX: number, startWidth: number } | null>(null);

  const startResize = (e: React.MouseEvent, module: TestModule, col: string) => {
    e.preventDefault();
    e.stopPropagation();
    resizingRef.current = { 
        module, 
        col, 
        startX: e.clientX, 
        startWidth: columnWidths[module][col] 
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        if (!resizingRef.current) return;
        const { module, col, startX, startWidth } = resizingRef.current;
        const diff = e.clientX - startX;
        const newWidth = Math.max(60, startWidth + diff); // Min width 60px

        setColumnWidths((prev: any) => ({
            ...prev,
            [module]: {
                ...prev[module],
                [col]: newWidth
            }
        }));
    };

    const handleMouseUp = () => {
        resizingRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Mock Data
  const testCases = [
    { id: 'CUMR1', title: '【示例数据】注册时提示密码强度', version: '版本 1', result: '待评审', type: '功能测试', priority: 'P0', maintainer: 'looking4id', cited: 0 },
    { id: 'CUMR3', title: '【示例数据】注册时校验用户名是否重复', version: '版本 1', result: '待评审', type: '功能测试', priority: 'P0', maintainer: 'looking4id', cited: 0 },
    { id: 'CUMR6', title: '【示例数据】未登录状态浏览商城', version: '版本 1', result: '待评审', type: '功能测试', priority: 'P1', maintainer: 'looking4id', cited: 0 },
    { id: 'CUMR2', title: '【示例数据】注册页面可查看用户协议', version: '版本 1', result: '待评审', type: '功能测试', priority: 'P1', maintainer: 'looking4id', cited: 0 },
    { id: 'CUMR4', title: '【示例数据】登录时记住用户名', version: '版本 1', result: '待评审', type: '功能测试', priority: 'P2', maintainer: 'looking4id', cited: 0 },
    { id: 'CUMR5', title: '【示例数据】正常进入商城', version: '版本 1', result: '待评审', type: '功能测试', priority: 'P3', maintainer: 'looking4id', cited: 0 },
  ];

  const testReviews = [
      { id: 'TR001', title: '【示例数据】商城系统-注册与登录', status: '进行中', owner: 'looking4id', reviewed: 2, total: 6, startTime: '2025-12-01', endTime: '2025-12-14' }
  ];

  const [testPlans, setTestPlans] = useState<TestPlan[]>([
      { id: 'TP001', title: '测试计划01', status: '未开始', owner: 'looking4id', passed: 0, total: 2, percent: 0, startDate: '2025-11-30', endDate: '2025-12-30' }
  ]);

  const testReports = [
      { id: 'RPT001', title: '测试计划01测试报告', plan: '测试计划01', creator: 'looking4id', createTime: '2025-11-30 11:04' }
  ];

  // Logic Handlers
  const handleCaseClick = (item: any) => {
      setSelectedTestCase(item);
      setIsTestCaseDetailOpen(true);
  };

  const handleReviewClick = (item: any) => {
      setSelectedTestReview(item);
      setIsTestReviewDetailOpen(true);
  };

  const handlePlanClick = (item: TestPlan) => {
      setSelectedTestPlan(item);
      setFormData({ ...item }); // Pre-fill form
      setIsTestPlanDetailOpen(true);
  };

  const handleCreate = () => {
      if (activeModule === 'plans') {
          const newPlan: TestPlan = {
              id: `TP${Date.now().toString().slice(-4)}`,
              title: formData.title || '新测试计划',
              status: '未开始',
              owner: formData.owner || 'looking4id',
              passed: 0,
              total: 0,
              percent: 0,
              startDate: formData.startDate || new Date().toISOString().split('T')[0],
              endDate: formData.endDate || new Date().toISOString().split('T')[0]
          };
          setTestPlans([newPlan, ...testPlans]);
          setShowCreateModal(false);
          setFormData({});
      } else {
          // Placeholder for other modules
          setShowCreateModal(false);
      }
  };

  const handleUpdatePlan = () => {
      if (!selectedTestPlan) return;
      setTestPlans(prev => prev.map(p => p.id === selectedTestPlan.id ? { ...p, ...formData } : p));
      setIsTestPlanDetailOpen(false);
      setFormData({});
  };

  const handleDeletePlan = () => {
      if (!selectedTestPlan) return;
      if (window.confirm('确定要删除该测试计划吗？')) {
          setTestPlans(prev => prev.filter(p => p.id !== selectedTestPlan.id));
          setIsTestPlanDetailOpen(false);
      }
  };

  // Render Helpers
  const Resizer = ({ module, col }: { module: TestModule, col: string }) => (
      <div 
        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-pink-500 group-hover:bg-gray-300 transition-colors z-10"
        onMouseDown={(e) => startResize(e, module, col)}
      />
  );

  const getFilteredItems = () => {
      const lowerQuery = searchQuery.toLowerCase();
      if (activeModule === 'cases') return testCases.filter(i => i.title.toLowerCase().includes(lowerQuery));
      if (activeModule === 'reviews') return testReviews.filter(i => i.title.toLowerCase().includes(lowerQuery));
      if (activeModule === 'plans') return testPlans.filter(i => i.title.toLowerCase().includes(lowerQuery));
      return testReports.filter(i => i.title.toLowerCase().includes(lowerQuery));
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="flex h-full bg-white">
      {/* Sub-Sidebar */}
      <div className="w-56 border-r border-gray-200 bg-gray-50 flex flex-col pt-4">
          <div className="px-4 mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                 <FlaskConical className="w-5 h-5 text-pink-600" /> 测试管理
              </h2>
          </div>
          <nav className="flex-1 px-2 space-y-1">
              <button 
                onClick={() => setActiveModule('cases')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeModule === 'cases' ? 'bg-white text-pink-700 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                  <FileSpreadsheet className="w-4 h-4 mr-3" /> 测试用例
              </button>
              <button 
                onClick={() => setActiveModule('reviews')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeModule === 'reviews' ? 'bg-white text-pink-700 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                  <ClipboardCheck className="w-4 h-4 mr-3" /> 测试评审
              </button>
              <button 
                onClick={() => setActiveModule('plans')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeModule === 'plans' ? 'bg-white text-pink-700 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                  <Calendar className="w-4 h-4 mr-3" /> 测试计划
              </button>
              <button 
                onClick={() => setActiveModule('reports')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeModule === 'reports' ? 'bg-white text-pink-700 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                  <PieChart className="w-4 h-4 mr-3" /> 测试报告
              </button>
          </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header & Toolbar */}
          <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                  <h1 className="text-xl font-bold text-gray-900">
                      {activeModule === 'cases' ? '测试用例' : 
                       activeModule === 'reviews' ? '测试评审' : 
                       activeModule === 'plans' ? '测试计划' : '测试报告'}
                  </h1>
                  <div className="flex gap-2">
                     <button 
                        onClick={() => {
                            setFormData({});
                            setShowCreateModal(true);
                        }}
                        className="bg-pink-700 text-white px-4 py-2 rounded text-sm hover:bg-pink-800 flex items-center shadow-sm"
                     >
                        <Plus className="w-4 h-4 mr-2" /> 
                        {activeModule === 'cases' ? '新建用例' : 
                         activeModule === 'reviews' ? '新建评审' : 
                         activeModule === 'plans' ? '新建计划' : '新建报告'}
                     </button>
                     <button className="p-2 border border-gray-300 rounded text-gray-500 hover:bg-gray-50"><MoreHorizontal className="w-4 h-4" /></button>
                  </div>
              </div>

              {activeModule === 'cases' && (
                  <div className="flex items-center justify-between">
                     <div className="flex gap-4 text-sm border-b border-gray-100">
                         <button className="pb-2 border-b-2 border-pink-700 text-pink-700 font-medium">列表</button>
                         <button className="pb-2 border-b-2 border-transparent text-gray-500 hover:text-gray-800">脑图</button>
                     </div>
                  </div>
              )}
              
              {/* Filter Bar */}
              <div className="mt-4 flex items-center justify-between gap-4 bg-gray-50 p-2 rounded border border-gray-100">
                   <div className="flex items-center gap-3">
                       <span className="text-sm text-gray-500">共有 {filteredItems.length} 项</span>
                       <div className="relative">
                           <input 
                               type="text" 
                               placeholder="搜索..." 
                               value={searchQuery}
                               onChange={(e) => setSearchQuery(e.target.value)}
                               className="pl-8 pr-4 py-1.5 border border-gray-300 rounded text-sm w-64 focus:ring-1 focus:ring-pink-500 outline-none" 
                           />
                           <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                       </div>
                   </div>
                   <div className="flex items-center gap-2 text-sm text-gray-600">
                        <button className="flex items-center hover:text-gray-900"><Filter className="w-4 h-4 mr-1" /> 筛选</button>
                        <button className="flex items-center hover:text-gray-900"><Settings className="w-4 h-4 mr-1" /> 设置</button>
                   </div>
              </div>
          </div>

          {/* Tables */}
          <div className="flex-1 overflow-auto bg-white p-6">
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm table-fixed">
                      <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 sticky top-0 z-10">
                          {activeModule === 'cases' && (
                              <tr>
                                  <th className="px-4 py-3 font-medium relative group" style={{ width: columnWidths.cases.id }}>
                                      用例编号
                                      <Resizer module="cases" col="id" />
                                  </th>
                                  <th className="px-4 py-3 font-medium relative group" style={{ width: columnWidths.cases.title }}>
                                      用例标题
                                      <Resizer module="cases" col="title" />
                                  </th>
                                  <th className="px-4 py-3 font-medium relative group" style={{ width: columnWidths.cases.version }}>
                                      版本号
                                      <Resizer module="cases" col="version" />
                                  </th>
                                  <th className="px-4 py-3 font-medium relative group" style={{ width: columnWidths.cases.result }}>
                                      当前版本评审结果
                                      <Resizer module="cases" col="result" />
                                  </th>
                                  <th className="px-4 py-3 font-medium relative group" style={{ width: columnWidths.cases.type }}>
                                      用例类型
                                      <Resizer module="cases" col="type" />
                                  </th>
                                  <th className="px-4 py-3 font-medium relative group" style={{ width: columnWidths.cases.priority }}>
                                      优先级
                                      <Resizer module="cases" col="priority" />
                                  </th>
                                  <th className="px-4 py-3 font-medium relative group" style={{ width: columnWidths.cases.maintainer }}>
                                      维护人
                                      <Resizer module="cases" col="maintainer" />
                                  </th>
                                  <th className="px-4 py-3 font-medium relative group" style={{ width: columnWidths.cases.cited }}>
                                      被引用
                                      <Resizer module="cases" col="cited" />
                                  </th>
                                  <th className="px-4 py-3 font-medium relative group w-10">
                                      <Settings className="w-4 h-4" />
                                  </th>
                              </tr>
                          )}
                          {activeModule === 'reviews' && (
                              <tr>
                                  <th className="px-4 py-3 font-medium relative group" style={{ width: columnWidths.reviews.status }}>状态</th>
                                  <th className="px-4 py-3 font-medium relative group" style={{ width: columnWidths.reviews.title }}>标题</th>
                                  <th className="px-4 py-3 font-medium relative group" style={{ width: columnWidths.reviews.owner }}>负责人</th>
                                  <th className="px-4 py-3 font-medium relative group" style={{ width: columnWidths.reviews.progress }}>评审进度</th>
                                  <th className="px-4 py-3 font-medium relative group" style={{ width: columnWidths.reviews.result }}>评审结果分布</th>
                                  <th className="px-4 py-3 font-medium relative group" style={{ width: columnWidths.reviews.time }}>开始/结束时间</th>
                              </tr>
                          )}
                          {activeModule === 'plans' && (
                              <tr>
                                  <th className="px-4 py-3 font-medium relative group" style={{ width: columnWidths.plans.status }}>状态</th>
                                  <th className="px-4 py-3 font-medium relative group" style={{ width: columnWidths.plans.title }}>标题</th>
                                  <th className="px-4 py-3 font-medium relative group" style={{ width: columnWidths.plans.owner }}>负责人</th>
                                  <th className="px-4 py-3 font-medium relative group" style={{ width: columnWidths.plans.progress }}>已测/总数</th>
                                  <th className="px-4 py-3 font-medium relative group" style={{ width: columnWidths.plans.time }}>计划周期</th>
                              </tr>
                          )}
                          {activeModule === 'reports' && (
                              <tr>
                                  <th className="px-4 py-3 font-medium relative group" style={{ width: columnWidths.reports.title }}>标题</th>
                                  <th className="px-4 py-3 font-medium relative group" style={{ width: columnWidths.reports.creator }}>创建人</th>
                                  <th className="px-4 py-3 font-medium relative group" style={{ width: columnWidths.reports.plan }}>关联测试计划</th>
                                  <th className="px-4 py-3 font-medium relative group" style={{ width: columnWidths.reports.date }}>创建时间</th>
                                  <th className="px-4 py-3 font-medium relative group w-20">操作</th>
                              </tr>
                          )}
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {activeModule === 'cases' && (filteredItems as typeof testCases).map(item => (
                              <tr 
                                key={item.id} 
                                onClick={() => handleCaseClick(item)}
                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                              >
                                  <td className="px-4 py-3 text-gray-500 font-mono text-xs truncate"><span className="bg-gray-100 px-1 rounded">{item.id}</span></td>
                                  <td className="px-4 py-3 font-medium text-gray-900 truncate">{item.title}</td>
                                  <td className="px-4 py-3 text-gray-500 truncate">{item.version}</td>
                                  <td className="px-4 py-3 text-gray-500 truncate"><span className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {item.result}</span></td>
                                  <td className="px-4 py-3 text-gray-500 truncate">{item.type}</td>
                                  <td className="px-4 py-3 truncate">
                                      <span className={`px-1.5 py-0.5 border rounded text-xs ${item.priority === 'P0' ? 'text-red-600 border-red-200 bg-red-50' : 'text-orange-600 border-orange-200 bg-orange-50'}`}>{item.priority}</span>
                                  </td>
                                  <td className="px-4 py-3 truncate flex items-center gap-2">
                                      <div className="w-5 h-5 bg-amber-500 rounded-full text-white text-[10px] flex items-center justify-center">Lo</div>
                                      {item.maintainer}
                                  </td>
                                  <td className="px-4 py-3 text-gray-500 text-center">{item.cited}</td>
                                  <td className="px-4 py-3 text-gray-400"><MoreHorizontal className="w-4 h-4" /></td>
                              </tr>
                          ))}

                          {activeModule === 'reviews' && (filteredItems as typeof testReviews).map(item => {
                              const progressPercent = Math.round((item.reviewed / item.total) * 100) || 0;
                              return (
                                  <tr 
                                    key={item.id}
                                    onClick={() => handleReviewClick(item)}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                  >
                                      <td className="px-4 py-3"><span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs border border-blue-100 flex items-center w-fit gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>{item.status}</span></td>
                                      <td className="px-4 py-3 font-medium text-gray-900 truncate">{item.title}</td>
                                      <td className="px-4 py-3 flex items-center gap-2">
                                          <div className="w-5 h-5 bg-amber-500 rounded-full text-white text-[10px] flex items-center justify-center">Lo</div>
                                          {item.owner}
                                      </td>
                                      <td className="px-4 py-3">
                                          <div className="w-full">
                                              <div className="flex justify-between text-xs mb-1 text-gray-600">
                                                  <span>{item.reviewed}/{item.total}</span>
                                                  <span>{progressPercent}%</span>
                                              </div>
                                              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                  <div 
                                                      className="bg-blue-500 h-full rounded-full transition-all duration-500"
                                                      style={{ width: `${progressPercent}%` }}
                                                  ></div>
                                              </div>
                                          </div>
                                      </td>
                                      <td className="px-4 py-3">
                                          <div className="flex h-1.5 w-full rounded-full overflow-hidden bg-gray-100">
                                              <div className="bg-green-500 h-full" style={{ width: '0%' }}></div>
                                              <div className="bg-red-500 h-full" style={{ width: '0%' }}></div>
                                          </div>
                                      </td>
                                      <td className="px-4 py-3 text-xs text-gray-500">
                                          {item.startTime} ~ {item.endTime}
                                      </td>
                                  </tr>
                              );
                          })}

                          {activeModule === 'plans' && (filteredItems as typeof testPlans).map(item => (
                              <tr key={item.id} onClick={() => handlePlanClick(item)} className="hover:bg-gray-50 cursor-pointer transition-colors group">
                                  <td className="px-4 py-3">
                                      <span className={`px-2 py-0.5 rounded text-xs border flex items-center w-fit gap-1 ${
                                          item.status === '已完成' ? 'bg-green-50 text-green-700 border-green-200' :
                                          item.status === '进行中' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                          'bg-gray-100 text-gray-500 border-gray-200'
                                      }`}>
                                          <span className={`w-1.5 h-1.5 rounded-full ${
                                              item.status === '已完成' ? 'bg-green-500' : 
                                              item.status === '进行中' ? 'bg-blue-500' : 'bg-gray-400'
                                          }`}></span>
                                          {item.status}
                                      </span>
                                  </td>
                                  <td className="px-4 py-3 font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">{item.title}</td>
                                  <td className="px-4 py-3 flex items-center gap-2">
                                      <div className="w-5 h-5 bg-amber-500 rounded-full text-white text-[10px] flex items-center justify-center">Lo</div>
                                      {item.owner}
                                  </td>
                                  <td className="px-4 py-3">
                                      <div className="flex items-center gap-2 w-32">
                                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                              <div className="h-full bg-green-500" style={{ width: `${item.percent}%` }}></div>
                                          </div>
                                          <span className="text-xs text-gray-500">{item.percent}%</span>
                                      </div>
                                  </td>
                                  <td className="px-4 py-3 text-xs text-gray-500">{item.startDate} ~ {item.endDate}</td>
                              </tr>
                          ))}

                          {activeModule === 'reports' && (filteredItems as typeof testReports).map(item => (
                              <tr key={item.id} className="hover:bg-gray-50 cursor-pointer transition-colors">
                                  <td className="px-4 py-3 font-medium text-gray-900 truncate">{item.title}</td>
                                  <td className="px-4 py-3 flex items-center gap-2">
                                      <div className="w-5 h-5 bg-amber-500 rounded-full text-white text-[10px] flex items-center justify-center">Lo</div>
                                      {item.creator}
                                  </td>
                                  <td className="px-4 py-3 text-gray-600">{item.plan}</td>
                                  <td className="px-4 py-3 text-xs text-gray-500">{item.createTime}</td>
                                  <td className="px-4 py-3 text-gray-400"><MoreHorizontal className="w-4 h-4" /></td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title={
            activeModule === 'cases' ? '新建测试用例' : 
            activeModule === 'reviews' ? '新建测试评审' : 
            activeModule === 'plans' ? '新建测试计划' : '新建测试报告'
        }
        size="lg"
        footer={
            <>
               <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">取消</button>
               <button onClick={handleCreate} className="px-4 py-2 bg-pink-700 text-white rounded text-sm hover:bg-pink-800">确定</button>
            </>
        }
      >
         <div className="space-y-4">
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">标题 <span className="text-red-500">*</span></label>
                 <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-pink-500 outline-none" 
                    placeholder="请输入标题" 
                    autoFocus
                    value={formData.title || ''}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                 />
             </div>
             
             {activeModule === 'cases' && (
                 <>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">优先级</label>
                            <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white"><option>P0</option><option>P1</option><option>P2</option></select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">用例类型</label>
                            <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white"><option>功能测试</option><option>性能测试</option><option>安全测试</option></select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">前置条件</label>
                        <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-20 resize-none" placeholder="输入前置条件..."></textarea>
                    </div>
                 </>
             )}

             {activeModule === 'plans' && (
                 <>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">负责人</label>
                            <select 
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:ring-pink-500 outline-none"
                                value={formData.owner || 'looking4id'}
                                onChange={(e) => setFormData({...formData, owner: e.target.value})}
                            >
                                <option>looking4id</option>
                                <option>dev01</option>
                                <option>qa01</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">关联迭代</label>
                            <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:ring-pink-500 outline-none">
                                <option>Sprint 1: 功能优化</option>
                                <option>Sprint 2: 自助开票功能开发</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">计划开始</label>
                            <input 
                                type="date" 
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-pink-500 outline-none"
                                value={formData.startDate || ''}
                                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">计划结束</label>
                            <input 
                                type="date" 
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-pink-500 outline-none"
                                value={formData.endDate || ''}
                                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                            />
                        </div>
                    </div>
                 </>
             )}

             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                 <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-32 resize-none" placeholder="输入描述..."></textarea>
             </div>
         </div>
      </Modal>

      {/* Test Case Detail Modal */}
      {selectedTestCase && (
        <Modal
            isOpen={isTestCaseDetailOpen}
            onClose={() => setIsTestCaseDetailOpen(false)}
            title={`测试用例详情: ${selectedTestCase.id}`}
            size="2xl"
        >
            <div className="flex h-[70vh] flex-col">
                <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 pr-6 overflow-y-auto custom-scrollbar">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">{selectedTestCase.title}</h2>
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded border border-gray-100">
                                <h3 className="text-sm font-bold text-gray-800 mb-2">前置条件</h3>
                                <p className="text-sm text-gray-600">用户已注册且账号状态正常。</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-800 mb-2">测试步骤</h3>
                                <table className="w-full text-sm text-left border border-gray-200 rounded">
                                    <thead className="bg-gray-50 text-gray-500">
                                        <tr>
                                            <th className="px-3 py-2 border-b w-16">编号</th>
                                            <th className="px-3 py-2 border-b">步骤描述</th>
                                            <th className="px-3 py-2 border-b">预期结果</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="px-3 py-2 border-b">1</td>
                                            <td className="px-3 py-2 border-b">进入注册页面，输入弱密码（如 123456）</td>
                                            <td className="px-3 py-2 border-b">系统提示密码强度为“弱”</td>
                                        </tr>
                                        <tr>
                                            <td className="px-3 py-2 border-b">2</td>
                                            <td className="px-3 py-2 border-b">输入中等强度密码（字母+数字）</td>
                                            <td className="px-3 py-2 border-b">系统提示密码强度为“中”</td>
                                        </tr>
                                        <tr>
                                            <td className="px-3 py-2">3</td>
                                            <td className="px-3 py-2">输入高强度密码（字母+数字+符号）</td>
                                            <td className="px-3 py-2">系统提示密码强度为“强”</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="w-64 border-l border-gray-200 pl-6 space-y-4 bg-gray-50 p-4 h-full overflow-y-auto">
                        <div>
                            <label className="text-xs text-gray-500 font-medium block mb-1">优先级</label>
                            <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">{selectedTestCase.priority}</span>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 font-medium block mb-1">维护人</label>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-amber-500 rounded-full text-white text-[10px] flex items-center justify-center">Lo</div>
                                <span className="text-sm text-gray-700">{selectedTestCase.maintainer}</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 font-medium block mb-1">用例类型</label>
                            <span className="text-sm text-gray-700">{selectedTestCase.type}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
      )}

      {/* Test Review Detail Modal */}
      {selectedTestReview && (
        <Modal
            isOpen={isTestReviewDetailOpen}
            onClose={() => setIsTestReviewDetailOpen(false)}
            title="测试评审详情"
            size="2xl"
        >
             <div className="h-[60vh] flex flex-col">
                 <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedTestReview.title}</h2>
                 <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 border-b border-gray-100 pb-4">
                     <span className="flex items-center gap-1"><User className="w-4 h-4" /> {selectedTestReview.owner}</span>
                     <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {selectedTestReview.startTime} ~ {selectedTestReview.endTime}</span>
                     <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">进行中</span>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                     <div className="bg-gray-50 p-4 rounded border border-gray-200 text-center">
                         <div className="text-3xl font-bold text-gray-800 mb-1">33%</div>
                         <div className="text-xs text-gray-500">评审进度</div>
                     </div>
                     <div className="bg-gray-50 p-4 rounded border border-gray-200 text-center">
                         <div className="text-3xl font-bold text-green-600 mb-1">-</div>
                         <div className="text-xs text-gray-500">通过率</div>
                     </div>
                 </div>

                 <div className="mt-6 flex-1 overflow-auto">
                     <h3 className="font-bold text-gray-800 mb-3">关联用例 (6)</h3>
                     <table className="w-full text-sm text-left">
                         <thead className="bg-gray-50 text-gray-500">
                             <tr>
                                 <th className="px-3 py-2">ID</th>
                                 <th className="px-3 py-2">标题</th>
                                 <th className="px-3 py-2">评审结果</th>
                                 <th className="px-3 py-2">操作</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100">
                             {testCases.map(tc => (
                                 <tr key={tc.id}>
                                     <td className="px-3 py-2 text-gray-500">{tc.id}</td>
                                     <td className="px-3 py-2">{tc.title}</td>
                                     <td className="px-3 py-2"><span className="text-gray-400">待评审</span></td>
                                     <td className="px-3 py-2">
                                         <button className="text-blue-600 hover:underline">评审</button>
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
             </div>
        </Modal>
      )}

      {/* Test Plan Edit/Detail Modal */}
      {selectedTestPlan && (
          <Modal
             isOpen={isTestPlanDetailOpen}
             onClose={() => setIsTestPlanDetailOpen(false)}
             title={`编辑测试计划: ${selectedTestPlan.id}`}
             size="lg"
             footer={
                 <>
                    <button 
                       onClick={handleDeletePlan} 
                       className="px-4 py-2 border border-red-200 text-red-600 rounded text-sm hover:bg-red-50 mr-auto flex items-center"
                    >
                        <Trash2 className="w-4 h-4 mr-2" /> 删除计划
                    </button>
                    <button onClick={() => setIsTestPlanDetailOpen(false)} className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">取消</button>
                    <button onClick={handleUpdatePlan} className="px-4 py-2 bg-pink-700 text-white rounded text-sm hover:bg-pink-800 shadow-sm">保存更改</button>
                 </>
             }
          >
             <div className="space-y-6">
                 <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                     <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-pink-500 outline-none"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                     />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-6">
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                         <select 
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:ring-pink-500 outline-none"
                            value={formData.status || '未开始'}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                         >
                             <option>未开始</option>
                             <option>进行中</option>
                             <option>已完成</option>
                             <option>阻塞</option>
                         </select>
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">负责人</label>
                         <select 
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:ring-pink-500 outline-none"
                            value={formData.owner || ''}
                            onChange={(e) => setFormData({...formData, owner: e.target.value})}
                         >
                             <option>looking4id</option>
                             <option>dev01</option>
                             <option>qa01</option>
                         </select>
                     </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">计划开始</label>
                         <input 
                            type="date" 
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-pink-500 outline-none"
                            value={formData.startDate || ''}
                            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                         />
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">计划结束</label>
                         <input 
                            type="date" 
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-pink-500 outline-none"
                            value={formData.endDate || ''}
                            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                         />
                     </div>
                 </div>

                 <div>
                     <h4 className="text-sm font-medium text-gray-700 mb-2">执行概览</h4>
                     <div className="bg-gray-50 rounded p-4 border border-gray-200 flex items-center justify-between">
                         <div className="text-center">
                             <div className="text-xs text-gray-500 mb-1">总用例</div>
                             <div className="text-lg font-bold">{formData.total || 0}</div>
                         </div>
                         <div className="h-8 w-px bg-gray-200"></div>
                         <div className="text-center">
                             <div className="text-xs text-gray-500 mb-1">通过</div>
                             <div className="text-lg font-bold text-green-600">{formData.passed || 0}</div>
                         </div>
                         <div className="h-8 w-px bg-gray-200"></div>
                         <div className="text-center">
                             <div className="text-xs text-gray-500 mb-1">进度</div>
                             <div className="text-lg font-bold text-blue-600">{formData.percent || 0}%</div>
                         </div>
                     </div>
                 </div>
             </div>
          </Modal>
      )}
    </div>
  );
};

export default Testing;
