
import React, { useState, useMemo } from 'react';
import { Plus, ChevronLeft, ChevronRight, LayoutGrid, List, Calendar as CalendarIcon, X, CheckCircle, Clock, AlertCircle, FileText, MoreHorizontal, User, Tag } from 'lucide-react';
import Modal from '../components/Modal';

const Releases: React.FC = () => {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [calendarView, setCalendarView] = useState<'month' | 'week'>('month');
  const [currentDate, setCurrentDate] = useState(new Date('2025-11-01')); // Default to mock date
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRelease, setSelectedRelease] = useState<any>(null);

  // Form State
  const [newRelease, setNewRelease] = useState({
    version: '',
    name: '',
    owner: 'looking4id',
    date: '2025.12.01',
    description: ''
  });

  // Data State
  const [releases, setReleases] = useState([
    {
      id: '1',
      version: '1.2.1',
      name: '紧急补丁',
      stage: '开发环境',
      owner: 'looking4id',
      date: '2025.11.30 00:00',
      progress: 0,
      description: '修复了线上支付回调延迟的问题，以及部分用户无法登录的Bug。',
      status: 'planned',
      workItems: [
          { id: 'BUG-102', title: '支付回调超时导致订单状态未更新', type: 'Bug', status: 'Fixing' },
          { id: 'BUG-105', title: 'iOS 16 下登录页面白屏', type: 'Bug', status: 'ToDo' }
      ]
    },
    {
      id: '2',
      version: '1.2.0',
      name: '自助开票功能上线',
      stage: '生产环境',
      owner: 'looking4id',
      date: '2025.11.15 00:00',
      progress: 100,
      description: '新增自助开票功能，支持增值税普通发票和专用发票。',
      status: 'released',
      workItems: [
          { id: 'FEAT-201', title: '用户端自助申请发票', type: 'Feature', status: 'Done' },
          { id: 'FEAT-202', title: '后台发票审核流程', type: 'Feature', status: 'Done' },
          { id: 'TASK-305', title: '税务接口对接', type: 'Task', status: 'Done' }
      ]
    }
  ]);

  // Calendar Logic
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = [];

    if (calendarView === 'month') {
        const firstDayOfMonth = new Date(year, month, 1);
        // Day of week: 0 (Sun) - 6 (Sat). We want Mon (1) - Sun (0)
        let startDay = firstDayOfMonth.getDay(); 
        let startOffset = startDay === 0 ? 6 : startDay - 1;

        const prevMonthDaysCount = new Date(year, month, 0).getDate();
        
        // Prev month filler
        for (let i = startOffset - 1; i >= 0; i--) {
            days.push({ 
                date: new Date(year, month - 1, prevMonthDaysCount - i),
                currentMonth: false 
            });
        }
        
        // Current month
        const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
        for (let i = 1; i <= daysInCurrentMonth; i++) {
            days.push({
                date: new Date(year, month, i),
                currentMonth: true
            });
        }
        
        // Next month filler
        const totalSlots = days.length > 35 ? 42 : 35;
        const remainingCells = totalSlots - days.length;
        for (let i = 1; i <= remainingCells; i++) {
            days.push({
                date: new Date(year, month + 1, i),
                currentMonth: false
            });
        }
    } else {
        // Week View
        const day = currentDate.getDay();
        const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
        const monday = new Date(currentDate);
        monday.setDate(diff);
        
        for (let i = 0; i < 7; i++) {
            const nextDay = new Date(monday);
            nextDay.setDate(monday.getDate() + i);
            days.push({
                date: nextDay,
                currentMonth: nextDay.getMonth() === month
            });
        }
    }
    return days;
  }, [currentDate, calendarView]);

  const handlePrev = () => {
      const newDate = new Date(currentDate);
      if (calendarView === 'month') {
          newDate.setMonth(newDate.getMonth() - 1);
      } else {
          newDate.setDate(newDate.getDate() - 7);
      }
      setCurrentDate(newDate);
  };

  const handleNext = () => {
      const newDate = new Date(currentDate);
      if (calendarView === 'month') {
          newDate.setMonth(newDate.getMonth() + 1);
      } else {
          newDate.setDate(newDate.getDate() + 7);
      }
      setCurrentDate(newDate);
  };

  const handleToday = () => {
      setCurrentDate(new Date());
  };

  const isReleaseOnDay = (release: any, date: Date) => {
      // Mock data format is '2025.11.30 00:00' or '2025-11-30'
      const datePart = release.date.replace(/-/g, '.').split(' ')[0]; // Normalize
      const [y, m, d] = datePart.split('.');
      return parseInt(y) === date.getFullYear() && 
             parseInt(m) === date.getMonth() + 1 && 
             parseInt(d) === date.getDate();
  };

  const handleRowClick = (release: any) => {
      setSelectedRelease(release);
      setShowDetailModal(true);
  };

  const handleCalendarReleaseClick = (e: React.MouseEvent, release: any) => {
      e.stopPropagation();
      handleRowClick(release);
  };

  const handleCreateRelease = () => {
      if (!newRelease.version.trim()) {
          alert('请输入版本号');
          return;
      }

      const releaseObj = {
          id: Date.now().toString(),
          version: newRelease.version,
          name: newRelease.name,
          stage: '规划中',
          owner: newRelease.owner,
          date: newRelease.date.replace(/-/g, '.') + ' 00:00',
          progress: 0,
          description: newRelease.description,
          status: 'planned',
          workItems: []
      };

      setReleases([releaseObj, ...releases]);
      setShowCreateModal(false);
      // Reset form
      setNewRelease({
          version: '',
          name: '',
          owner: 'looking4id',
          date: '2025.12.01',
          description: ''
      });
  };

  return (
    <div className="flex flex-col h-full bg-white">
        <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">版本</h1>
                <button 
                  onClick={() => setShowCreateModal(true)}
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
             <div className="flex-1 flex flex-col p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-4 shrink-0">
                    <button 
                        onClick={handleToday}
                        className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50"
                    >
                        今天
                    </button>
                    <div className="flex items-center gap-4 text-lg font-medium text-gray-800">
                        <button onClick={handlePrev} className="p-1 hover:bg-gray-100 rounded"><ChevronLeft className="w-5 h-5" /></button>
                        <span>
                            {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
                            {calendarView === 'week' && ` (第 ${Math.ceil((currentDate.getDate() - 1) / 7) + 1} 周)`}
                        </span>
                        <button onClick={handleNext} className="p-1 hover:bg-gray-100 rounded"><ChevronRight className="w-5 h-5" /></button>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex border border-gray-200 rounded overflow-hidden">
                            <button 
                                onClick={() => setCalendarView('month')}
                                className={`px-3 py-1.5 text-sm transition-colors ${calendarView === 'month' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                            >
                                月
                            </button>
                            <button 
                                onClick={() => setCalendarView('week')}
                                className={`px-3 py-1.5 text-sm border-l border-gray-200 transition-colors ${calendarView === 'week' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                            >
                                周
                            </button>
                        </div>
                        <button className="p-1.5 border border-gray-200 rounded text-gray-500 hover:bg-gray-50"><LayoutGrid className="w-4 h-4" /></button>
                    </div>
                </div>

                <div className="flex-1 border border-gray-200 rounded-lg flex flex-col shadow-sm overflow-hidden">
                    {/* Week Header */}
                    <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 shrink-0">
                        {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map(d => (
                            <div key={d} className="py-2 text-center text-sm text-gray-500 font-medium">{d}</div>
                        ))}
                    </div>
                    {/* Days Grid */}
                    <div className={`flex-1 grid grid-cols-7 ${calendarView === 'month' ? 'grid-rows-5' : 'grid-rows-1'} overflow-auto`}>
                        {calendarDays.map((d, i) => {
                            const dayReleases = releases.filter(r => isReleaseOnDay(r, d.date));
                            const isToday = new Date().toDateString() === d.date.toDateString();

                            return (
                                <div key={i} className={`border-b border-r border-gray-100 p-2 relative min-h-[100px] ${!d.currentMonth ? 'bg-gray-50/50' : 'bg-white'} hover:bg-gray-50 transition-colors`}>
                                    <span className={`text-sm inline-block w-6 h-6 text-center leading-6 rounded-full ${
                                        isToday ? 'bg-blue-600 text-white font-bold' : 
                                        !d.currentMonth ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        {d.date.getDate()}
                                    </span>
                                    
                                    <div className="mt-2 space-y-2">
                                        {dayReleases.map(release => (
                                            <div 
                                              key={release.id}
                                              onClick={(e) => handleCalendarReleaseClick(e, release)}
                                              className={`
                                                  p-2 rounded-r text-xs cursor-pointer hover:shadow-md transition-shadow group border-l-4
                                                  ${release.status === 'released' ? 'bg-green-50 border-green-600' : 'bg-pink-50 border-pink-700'}
                                              `}
                                            >
                                                <div className={`
                                                    font-bold text-white px-1 py-0.5 rounded inline-block mr-1
                                                    ${release.status === 'released' ? 'bg-green-600 group-hover:bg-green-700' : 'bg-pink-700 group-hover:bg-pink-800'}
                                                `}>
                                                    {release.version}
                                                </div>
                                                <span className={`font-medium ${release.status === 'released' ? 'text-green-900' : 'text-pink-900'}`}>
                                                    {release.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
             </div>
        ) : (
             <div className="p-6 overflow-auto flex-1">
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
                             {releases.map(release => (
                               <tr key={release.id} onClick={() => handleRowClick(release)} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                                   <td className="px-6 py-4">
                                       <span className={`px-1.5 py-0.5 rounded text-xs font-medium text-white ${release.status === 'released' ? 'bg-green-600' : 'bg-pink-700'}`}>
                                           {release.version}
                                       </span>
                                   </td>
                                   <td className="px-6 py-4 font-medium group-hover:text-blue-600 transition-colors">{release.name}</td>
                                   <td className="px-6 py-4 text-gray-500">◎ {release.stage}</td>
                                   <td className="px-6 py-4">
                                       <div className="flex items-center gap-2">
                                           <div className="w-5 h-5 bg-amber-500 rounded-full text-white text-[10px] flex items-center justify-center">Lo</div>
                                           <span>{release.owner}</span>
                                       </div>
                                   </td>
                                   <td className="px-6 py-4 text-gray-500">{release.date}</td>
                                   <td className="px-6 py-4 w-48">
                                       <div className="flex items-center gap-2">
                                           <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                               <div 
                                                 className={`h-full ${release.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`} 
                                                 style={{ width: `${release.progress}%` }}
                                               ></div>
                                           </div>
                                           <span className="text-xs text-gray-500">{release.progress}%</span>
                                       </div>
                                   </td>
                               </tr>
                             ))}
                        </tbody>
                    </table>
                 </div>
             </div>
        )}

        {/* Create Modal */}
        <Modal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            title="新建版本"
            size="lg"
            footer={
                <>
                    <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">取消</button>
                    <button onClick={handleCreateRelease} className="px-4 py-2 bg-pink-700 text-white rounded text-sm hover:bg-pink-800">确定</button>
                </>
            }
        >
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">版本号 <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-pink-500 focus:border-pink-500 outline-none" 
                            placeholder="请输入版本号" 
                            autoFocus 
                            value={newRelease.version}
                            onChange={(e) => setNewRelease({...newRelease, version: e.target.value})}
                        />
                        {!newRelease.version && <p className="text-xs text-red-500 mt-1">版本号必填</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-pink-500 focus:border-pink-500 outline-none" 
                            placeholder="请输入标题"
                            value={newRelease.name}
                            onChange={(e) => setNewRelease({...newRelease, name: e.target.value})}
                        />
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
                            <input 
                                type="date" 
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-pink-500 focus:border-pink-500 outline-none" 
                                value={newRelease.date}
                                onChange={(e) => setNewRelease({...newRelease, date: e.target.value})}
                            />
                        </div>
                    </div>
                </div>
                <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">发布日志</label>
                        <textarea 
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-32 resize-none focus:ring-pink-500 focus:border-pink-500 outline-none" 
                            placeholder="请输入发布日志"
                            value={newRelease.description}
                            onChange={(e) => setNewRelease({...newRelease, description: e.target.value})}
                        ></textarea>
                </div>
            </div>
        </Modal>

        {/* Detail Modal */}
        {selectedRelease && (
            <Modal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                title={`版本详情: ${selectedRelease.version}`}
                size="2xl"
            >
                <div className="flex flex-col h-[65vh]">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-gray-900">{selectedRelease.name}</h2>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
                                selectedRelease.status === 'released' 
                                ? 'bg-green-50 text-green-700 border-green-200' 
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}>
                                {selectedRelease.status === 'released' ? '已发布' : '计划中'}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <button className="text-gray-500 hover:bg-gray-100 p-2 rounded"><MoreHorizontal className="w-5 h-5" /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 mb-6 text-sm">
                        <div className="p-4 bg-gray-50 rounded border border-gray-100">
                            <span className="text-gray-500 block mb-1">负责人</span>
                            <div className="flex items-center gap-2 font-medium text-gray-900">
                                <div className="w-5 h-5 bg-amber-500 rounded-full text-white text-[10px] flex items-center justify-center">Lo</div>
                                {selectedRelease.owner}
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded border border-gray-100">
                            <span className="text-gray-500 block mb-1">发布时间</span>
                            <div className="flex items-center gap-2 font-medium text-gray-900">
                                <Clock className="w-4 h-4 text-gray-400" />
                                {selectedRelease.date}
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded border border-gray-100">
                            <span className="text-gray-500 block mb-1">当前阶段</span>
                            <div className="flex items-center gap-2 font-medium text-gray-900">
                                <Tag className="w-4 h-4 text-gray-400" />
                                {selectedRelease.stage}
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-gray-900 mb-2">发布进度</h3>
                        <div className="bg-gray-100 rounded-full h-2 w-full overflow-hidden">
                            <div 
                                className={`h-full rounded-full transition-all duration-500 ${selectedRelease.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`} 
                                style={{ width: `${selectedRelease.progress}%` }}
                            ></div>
                        </div>
                        <div className="text-right text-xs text-gray-500 mt-1">{selectedRelease.progress}% 完成</div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-gray-900 mb-2">发布日志</h3>
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-100 min-h-[80px]">
                            {selectedRelease.description || '暂无描述'}
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                            <h3 className="text-sm font-bold text-gray-900">关联工作项 ({selectedRelease.workItems?.length || 0})</h3>
                        </div>
                        <div className="overflow-auto flex-1 custom-scrollbar">
                            <table className="w-full text-sm text-left">
                                <tbody className="divide-y divide-gray-50">
                                    {selectedRelease.workItems?.map((item: any) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="py-2 text-gray-500 font-mono text-xs w-24">{item.id}</td>
                                            <td className="py-2">
                                                <div className="flex items-center gap-2">
                                                    {item.type === 'Bug' ? (
                                                        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                                                    ) : (
                                                        <FileText className="w-3.5 h-3.5 text-blue-500" />
                                                    )}
                                                    <span className="text-gray-800">{item.title}</span>
                                                </div>
                                            </td>
                                            <td className="py-2 text-right">
                                                <span className={`text-xs px-2 py-0.5 rounded ${
                                                    item.status === 'Done' ? 'bg-green-50 text-green-700' : 
                                                    item.status === 'Fixing' ? 'bg-blue-50 text-blue-700' :
                                                    'bg-gray-100 text-gray-600'
                                                }`}>{item.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!selectedRelease.workItems || selectedRelease.workItems.length === 0) && (
                                        <tr>
                                            <td colSpan={3} className="py-4 text-center text-gray-400 text-xs">暂无关联事项</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Modal>
        )}
    </div>
  );
};

export default Releases;
