
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Plus, Filter, Search, MoreHorizontal, Calendar as CalendarIcon, SlidersHorizontal, User, Tag, Settings, Eye, Columns, Check, ZoomIn, ZoomOut } from 'lucide-react';
import { WorkItem, Priority, Status } from '../types';
import Modal from '../components/Modal';

// Helper functions for date manipulation
const getDaysDiff = (d1: Date | string, d2: Date | string) => {
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  // Reset hours to avoid daylight saving time issues affecting day difference
  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);
  return Math.round((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
};

const addDays = (dateStr: string, days: number) => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

interface ExtendedWorkItem extends WorkItem {
  predecessors?: string[]; // IDs of tasks this item depends on
}

const VIEW_MODES = ['day', 'week', 'month', 'quarter'] as const;

const Planning: React.FC = () => {
  // Timeline Configuration: Nov 1, 2025 to Dec 31, 2025
  const timelineStartDate = useMemo(() => new Date('2025-11-01'), []);
  const timelineEndDate = useMemo(() => new Date('2025-12-31'), []);
  const totalDays = useMemo(() => getDaysDiff(timelineStartDate, timelineEndDate) + 1, [timelineStartDate, timelineEndDate]);

  // View Settings State
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month' | 'quarter'>('month');
  const [visibleColumns, setVisibleColumns] = useState({
    status: true,
    assignee: true,
    start: true,
    end: true
  });
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  // Initial Data with Dependencies
  const [items, setItems] = useState<ExtendedWorkItem[]>([
    { id: '1', title: '【示例缺陷】手机号注册页面样式异常', type: 'Bug', priority: Priority.High, status: Status.Done, assignee: { name: 'looking4id', avatar: '' }, startDate: '2025-11-05', endDate: '2025-11-12' },
    { id: '2', title: '【示例需求】支持微信小程序在线点餐', type: 'Feature', priority: Priority.Medium, status: Status.ToDo, assignee: { name: 'looking4id', avatar: '' }, startDate: '2025-11-15', endDate: '2025-11-25', predecessors: ['1'] },
    { id: '3', title: '【示例缺陷】多人在点餐页面卡顿', type: 'Bug', priority: Priority.Critical, status: Status.InProgress, assignee: { name: 'looking4id', avatar: '' }, startDate: '2025-11-20', endDate: '2025-12-05' },
    { id: '4', title: '【示例缺陷】多人点餐 PRD', type: 'Bug', priority: Priority.Medium, status: Status.InProgress, assignee: { name: 'looking4id', avatar: '' }, startDate: '2025-12-02', endDate: '2025-12-15', predecessors: ['2', '3'] },
    { id: '5', title: '【示例缺陷】多语言切换失效', type: 'Bug', priority: Priority.Low, status: Status.Done, assignee: { name: 'looking4id', avatar: '' }, startDate: '2025-12-10', endDate: '2025-12-20', predecessors: ['4'] },
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Drag & Drop State
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartPixelWidth, setChartPixelWidth] = useState(0);

  const [dragState, setDragState] = useState<{
    itemId: string | null;
    type: 'move' | 'resize-left' | 'resize-right' | null;
    startX: number;
    initialStartDate: string;
    initialEndDate: string;
  }>({
    itemId: null,
    type: null,
    startX: 0,
    initialStartDate: '',
    initialEndDate: ''
  });

  // Zoom Logic
  const zoomIn = () => {
    const currentIndex = VIEW_MODES.indexOf(viewMode);
    if (currentIndex > 0) {
      setViewMode(VIEW_MODES[currentIndex - 1]);
    }
  };

  const zoomOut = () => {
    const currentIndex = VIEW_MODES.indexOf(viewMode);
    if (currentIndex < VIEW_MODES.length - 1) {
      setViewMode(VIEW_MODES[currentIndex + 1]);
    }
  };

  // Wheel Zoom Listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      // Ctrl + Wheel to zoom
      if (e.ctrlKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          zoomIn();
        } else {
          zoomOut();
        }
      }
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, [viewMode]); // Re-bind when viewMode changes to capture latest state closure

  // Calculate Dynamic Gantt Width and Headers
  const ganttConfig = useMemo(() => {
    let width = '100%';
    const headers = [];
    let current = new Date(timelineStartDate);

    if (viewMode === 'day') {
      width = `${totalDays * 40}px`; // Fixed pixel width per day
      while (current <= timelineEndDate) {
        headers.push({
          name: `${current.getDate()}`,
          sub: ['日','一','二','三','四','五','六'][current.getDay()],
          widthPct: (1 / totalDays) * 100,
          isWeekend: current.getDay() === 0 || current.getDay() === 6
        });
        current.setDate(current.getDate() + 1);
      }
    } else if (viewMode === 'week') {
      width = `${Math.max(100, (totalDays / 7) * 100)}%`; // roughly fit or expand
      
      // Align to Mondays
      while (current <= timelineEndDate) {
        const dayOfWeek = current.getDay(); // 0 is Sunday
        // Calculate days until next Monday (or end of timeline)
        // If today is Monday (1), dist is 7. If Sunday (0), dist is 1.
        // Let's assume weeks start on Monday.
        const daysToNextMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
        
        const segmentEnd = new Date(current);
        segmentEnd.setDate(current.getDate() + daysToNextMonday - 1);
        
        const effectiveEnd = segmentEnd > timelineEndDate ? timelineEndDate : segmentEnd;
        const daysInSegment = getDaysDiff(current, effectiveEnd) + 1;
        
        headers.push({
          name: `${current.getMonth() + 1}/${current.getDate()} - ${effectiveEnd.getMonth() + 1}/${effectiveEnd.getDate()}`,
          sub: `W${getWeekNumber(current)}`,
          widthPct: (daysInSegment / totalDays) * 100
        });
        
        current.setDate(current.getDate() + daysInSegment);
      }
    } else if (viewMode === 'month') {
      width = '100%';
      while (current <= timelineEndDate) {
        const year = current.getFullYear();
        const month = current.getMonth();
        const monthName = `${year}年${month + 1}月`;
        
        const monthEnd = new Date(Math.min(new Date(year, month + 1, 0).getTime(), timelineEndDate.getTime()));
        const visibleDays = getDaysDiff(current, monthEnd) + 1;
        
        headers.push({
          name: monthName,
          sub: '',
          widthPct: (visibleDays / totalDays) * 100
        });
        
        current = new Date(year, month + 1, 1);
      }
    } else if (viewMode === 'quarter') {
      width = '100%';
      while (current <= timelineEndDate) {
        const year = current.getFullYear();
        const month = current.getMonth();
        const quarter = Math.floor(month / 3) + 1;
        
        // Quarter end month is 2 (Mar), 5 (Jun), 8 (Sep), 11 (Dec)
        const qEndMonth = quarter * 3 - 1; 
        const qEndDate = new Date(year, qEndMonth + 1, 0); // Last day of quarter
        
        const effectiveEnd = qEndDate > timelineEndDate ? timelineEndDate : qEndDate;
        const daysInSegment = getDaysDiff(current, effectiveEnd) + 1;

        headers.push({
          name: `${year} Q${quarter}`,
          sub: '',
          widthPct: (daysInSegment / totalDays) * 100
        });

        current = new Date(year, qEndMonth + 1, 1);
      }
    }

    return { width, headers };
  }, [viewMode, timelineStartDate, timelineEndDate, totalDays]);

  function getWeekNumber(d: Date) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    var weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return weekNo;
  }

  // Observer to track chart width for SVG line calculation
  useEffect(() => {
    if (!containerRef.current) return;
    
    // We need to observe the inner content width, not just the scroll container
    // However, the inner content width is set by style, so we can check scrollWidth
    const updateWidth = () => {
      if (containerRef.current) {
        setChartPixelWidth(containerRef.current.scrollWidth);
      }
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, [ganttConfig.width, viewMode]);

  // Handle Drag Interaction
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState.itemId || !containerRef.current) return;

      const containerWidth = containerRef.current.scrollWidth; // Use scrollWidth for accuracy in overflow
      const pixelDiff = e.clientX - dragState.startX;
      const dayDiff = Math.round((pixelDiff / containerWidth) * totalDays);

      if (dayDiff === 0 && dragState.type === 'move') return;

      setItems(prevItems => prevItems.map(item => {
        if (item.id !== dragState.itemId) return item;

        let newStart = item.startDate;
        let newEnd = item.endDate;

        if (dragState.type === 'move') {
          newStart = addDays(dragState.initialStartDate, dayDiff);
          newEnd = addDays(dragState.initialEndDate, dayDiff);
        } else if (dragState.type === 'resize-left') {
          const proposedStart = addDays(dragState.initialStartDate, dayDiff);
          if (getDaysDiff(proposedStart, item.endDate) >= 0) {
            newStart = proposedStart;
          }
        } else if (dragState.type === 'resize-right') {
          const proposedEnd = addDays(dragState.initialEndDate, dayDiff);
          if (getDaysDiff(item.startDate, proposedEnd) >= 0) {
            newEnd = proposedEnd;
          }
        }

        return { ...item, startDate: newStart, endDate: newEnd };
      }));
    };

    const handleMouseUp = () => {
      if (dragState.itemId) {
        setDragState({ itemId: null, type: null, startX: 0, initialStartDate: '', initialEndDate: '' });
      }
    };

    if (dragState.itemId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, totalDays]);

  const handleMouseDown = (e: React.MouseEvent, item: WorkItem, type: 'move' | 'resize-left' | 'resize-right') => {
    e.stopPropagation();
    setDragState({
      itemId: item.id,
      type,
      startX: e.clientX,
      initialStartDate: item.startDate,
      initialEndDate: item.endDate
    });
  };

  const calculatePosition = (start: string, end: string) => {
    const startOffset = getDaysDiff(timelineStartDate, start);
    const duration = getDaysDiff(start, end) + 1;

    const left = Math.max(0, (startOffset / totalDays) * 100);
    const width = Math.max(0, (duration / totalDays) * 100);

    return { left: `${left}%`, width: `${width}%` };
  };

  // Generate Dependency Lines
  const dependencyLines = useMemo(() => {
    if (!chartPixelWidth) return [];

    const lines: React.ReactElement[] = [];
    const ROW_HEIGHT = 45;
    const HALF_ROW = 22.5;

    items.forEach((item, index) => {
      if (!item.predecessors) return;

      item.predecessors.forEach(predId => {
        const predIndex = items.findIndex(i => i.id === predId);
        const predItem = items[predIndex];
        
        if (!predItem || predIndex === -1) return;

        // Calculate Pixels
        const predEndDayOffset = getDaysDiff(timelineStartDate, predItem.endDate) + 1;
        const startX = (predEndDayOffset / totalDays) * chartPixelWidth;
        const startY = predIndex * ROW_HEIGHT + HALF_ROW;

        const currentStartDayOffset = getDaysDiff(timelineStartDate, item.startDate);
        const endX = (currentStartDayOffset / totalDays) * chartPixelWidth;
        const endY = index * ROW_HEIGHT + HALF_ROW;

        // Bezier Curve Logic
        // Start from right of predecessor, curve to left of successor
        const deltaX = endX - startX;
        const controlPointOffset = Math.min(Math.abs(deltaX) / 2, 40);
        
        // Control points
        const cp1x = startX + controlPointOffset;
        const cp1y = startY;
        const cp2x = endX - controlPointOffset;
        const cp2y = endY;

        const d = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;

        lines.push(
          <path
            key={`${predId}-${item.id}`}
            d={d}
            fill="none"
            stroke="#9ca3af" // gray-400
            strokeWidth="1.5"
            markerEnd="url(#arrowhead)"
            className="pointer-events-none opacity-60"
          />
        );
      });
    });

    return lines;
  }, [items, timelineStartDate, totalDays, chartPixelWidth]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Toolbar */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">规划</h1>
          <div className="flex gap-2">
             <div className="relative">
                <button 
                  onClick={() => setShowColumnMenu(!showColumnMenu)}
                  className="bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-50 flex items-center text-sm font-medium transition-colors shadow-sm"
                >
                  <Columns className="w-4 h-4 mr-2" /> 显示列
                </button>
                {showColumnMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowColumnMenu(false)}></div>
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20 py-1">
                       <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">显示字段</div>
                       {Object.keys(visibleColumns).map(key => (
                         <button 
                           key={key}
                           onClick={() => setVisibleColumns(prev => ({...prev, [key]: !prev[key as keyof typeof visibleColumns]}))}
                           className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
                         >
                           <span>
                             {key === 'status' ? '状态' : 
                              key === 'assignee' ? '负责人' : 
                              key === 'start' ? '计划开始' : '计划完成'}
                           </span>
                           {visibleColumns[key as keyof typeof visibleColumns] && <Check className="w-4 h-4 text-pink-600" />}
                         </button>
                       ))}
                    </div>
                  </>
                )}
             </div>
             
             <div className="flex bg-gray-100 p-1 rounded-md">
                {VIEW_MODES.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1 text-sm rounded-sm font-medium transition-all ${
                      viewMode === mode 
                        ? 'bg-white text-pink-700 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {mode === 'day' ? '日' : mode === 'week' ? '周' : mode === 'month' ? '月' : '季'}
                  </button>
                ))}
             </div>

             <div className="flex items-center bg-gray-100 p-1 rounded-md">
                <button 
                  onClick={zoomOut} 
                  disabled={viewMode === VIEW_MODES[VIEW_MODES.length - 1]}
                  className="p-1 hover:bg-white rounded-sm text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                  title="缩小 (Ctrl+Scroll Down)"
                >
                    <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-3 bg-gray-300 mx-1"></div>
                <button 
                  onClick={zoomIn} 
                  disabled={viewMode === VIEW_MODES[0]}
                  className="p-1 hover:bg-white rounded-sm text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                  title="放大 (Ctrl+Scroll Up)"
                >
                    <ZoomIn className="w-3.5 h-3.5" />
                </button>
             </div>

             <button 
               onClick={() => setIsCreateModalOpen(true)}
               className="bg-pink-600 text-white px-4 py-2 rounded shadow hover:bg-pink-700 flex items-center text-sm font-medium transition-colors"
             >
               <Plus className="w-4 h-4 mr-1" /> 新建
             </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
             <div className="flex items-center space-x-1 bg-gray-50 border border-gray-200 rounded px-3 py-1.5 text-sm text-gray-600 cursor-pointer hover:bg-gray-100">
                <span>类型</span> <ChevronDown className="w-3 h-3" />
             </div>
             <div className="flex items-center space-x-1 bg-gray-50 border border-gray-200 rounded px-3 py-1.5 text-sm text-gray-600 cursor-pointer hover:bg-gray-100">
                <span>负责人</span> <ChevronDown className="w-3 h-3" />
             </div>
             <div className="flex items-center space-x-1 bg-gray-50 border border-gray-200 rounded px-3 py-1.5 text-sm text-gray-600 cursor-pointer hover:bg-gray-100">
                <span>状态</span> <ChevronDown className="w-3 h-3" />
             </div>
             <div className="flex items-center space-x-1 bg-gray-50 border border-gray-200 rounded px-3 py-1.5 text-sm text-gray-600 cursor-pointer hover:bg-gray-100">
                <span>迭代</span> <ChevronDown className="w-3 h-3" />
             </div>
             <button 
               onClick={() => setIsFilterModalOpen(true)}
               className="text-gray-400 text-sm px-2 hover:text-gray-600"
             >
               更多筛选
             </button>
             
             <div className="relative group">
                <input type="text" placeholder="输入工作项关键字" className="pl-3 pr-8 py-1.5 border border-gray-300 rounded text-sm w-48 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all" />
                <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-gray-600" />
             </div>
             <button className="text-blue-600 text-sm hover:text-blue-700">清空</button>
          </div>
          <div className="flex items-center text-gray-600 text-sm cursor-pointer hover:text-gray-800">
             <span>快捷筛选</span> <ChevronDown className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>

      {/* Main Content: Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Task List */}
        <div className="border-r border-gray-200 overflow-y-auto flex-shrink-0" style={{ width: '45%' }}>
          <table className="w-full text-left text-sm table-fixed">
             <thead className="bg-gray-50 sticky top-0 z-10 text-gray-500 font-medium shadow-sm">
                <tr>
                   <th className="px-4 py-3 w-10">
                      <div className="flex flex-col items-center">
                        <ChevronDown className="w-3 h-3" />
                      </div>
                   </th>
                   <th className="px-4 py-3">工作项</th>
                   {visibleColumns.status && <th className="px-4 py-3 w-24">状态</th>}
                   {visibleColumns.assignee && <th className="px-4 py-3 w-20">负责人</th>}
                   {visibleColumns.start && <th className="px-4 py-3 w-28">计划开始</th>}
                   {visibleColumns.end && <th className="px-4 py-3 w-28">计划完成</th>}
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 group cursor-pointer transition-colors h-[45px]">
                    <td className="px-4 py-3 text-center">
                       <ChevronDown className="w-3 h-3 text-gray-400 inline" />
                    </td>
                    <td className="px-4 py-3">
                       <div className="flex items-center">
                          {item.type === 'Bug' ? (
                             <span className="bg-red-500 text-white p-0.5 rounded text-[10px] mr-2 shrink-0">Bug</span>
                          ) : (
                             <span className="bg-blue-500 text-white p-0.5 rounded text-[10px] mr-2 shrink-0">Feat</span>
                          )}
                          <span className="text-gray-800 truncate hover:text-blue-600 transition-colors block max-w-[200px]">{item.title}</span>
                       </div>
                    </td>
                    {visibleColumns.status && (
                      <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs border ${
                              item.status === Status.Done ? 'bg-gray-100 text-gray-500 border-gray-200' :
                              item.status === Status.InProgress ? 'bg-blue-50 text-blue-600 border-blue-200' :
                              'bg-yellow-50 text-yellow-600 border-yellow-200'
                          }`}>
                             {item.status === Status.Done ? '已确认' : 
                              item.status === Status.InProgress ? '修复中' : '意向'}
                          </span>
                      </td>
                    )}
                    {visibleColumns.assignee && (
                      <td className="px-4 py-3">
                          <div className="flex items-center justify-center">
                              <div className="w-6 h-6 bg-amber-500 rounded-full text-white text-[10px] flex items-center justify-center cursor-pointer" title={item.assignee.name}>Lo</div>
                          </div>
                      </td>
                    )}
                    {visibleColumns.start && <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{item.startDate}</td>}
                    {visibleColumns.end && <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{item.endDate}</td>}
                  </tr>
                ))}
             </tbody>
          </table>
        </div>

        {/* Right: Gantt Chart Area */}
        <div className="flex-1 bg-white overflow-x-auto custom-scrollbar relative flex flex-col" ref={containerRef}>
           {/* Timeline Header */}
           <div 
             className="sticky top-0 z-20 bg-white border-b border-gray-200 h-10 flex text-xs text-gray-500"
             style={{ width: ganttConfig.width }}
           >
              {ganttConfig.headers.map((header, i) => (
                  <div 
                    key={i} 
                    className={`border-r border-gray-100 px-2 py-1 flex flex-col box-border ${header.isWeekend ? 'bg-gray-50' : ''}`}
                    style={{ width: `${header.widthPct}%` }}
                  >
                      <span className="font-medium text-gray-800 whitespace-nowrap truncate">{header.name}</span>
                      {header.sub && (
                        <div className="text-[10px] opacity-60 truncate">{header.sub}</div>
                      )}
                  </div>
              ))}
           </div>
           
           {/* Gantt Bars and Lines */}
           <div className="relative pt-2 flex-1 z-0" style={{ width: ganttConfig.width }}>
                {/* SVG Layer for Dependencies */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ height: items.length * 45 + 10 }}>
                    <defs>
                        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                            <polygon points="0 0, 8 3, 0 6" fill="#9ca3af" />
                        </marker>
                    </defs>
                    {dependencyLines}
                </svg>

                {items.map((item, index) => {
                    const { left, width } = calculatePosition(item.startDate, item.endDate);
                    return (
                      <div key={item.id} className="h-[45px] relative flex items-center border-b border-gray-50 hover:bg-gray-50 w-full z-10">
                          <div 
                             className={`h-4 rounded-full absolute shadow-sm group cursor-move select-none flex items-center justify-center ${
                                 item.status === Status.Done ? 'bg-gray-400' : 'bg-blue-500'
                             }`}
                             style={{
                                 left, 
                                 width,
                                 transition: dragState.itemId === item.id ? 'none' : 'all 0.1s ease-out'
                             }}
                             onMouseDown={(e) => handleMouseDown(e, item, 'move')}
                          >
                               {/* Left Handle - Optimized */}
                               <div 
                                  className="w-3 h-3 rounded-full bg-white border-2 absolute -left-1.5 opacity-0 group-hover:opacity-100 cursor-ew-resize hover:scale-125 transition-all shadow-sm z-20"
                                  style={{ borderColor: item.status === Status.Done ? '#9ca3af' : '#3b82f6' }}
                                  onMouseDown={(e) => handleMouseDown(e, item, 'resize-left')}
                               ></div>
                               
                               {/* Label inside bar if wide enough */}
                               <span className="text-[11px] text-white px-2 truncate w-full font-medium opacity-90 overflow-hidden leading-none pointer-events-none">
                                  {item.title}
                               </span>

                               {/* Right Handle - Optimized */}
                               <div 
                                  className="w-3 h-3 rounded-full bg-white border-2 absolute -right-1.5 opacity-0 group-hover:opacity-100 cursor-ew-resize hover:scale-125 transition-all shadow-sm z-20"
                                  style={{ borderColor: item.status === Status.Done ? '#9ca3af' : '#3b82f6' }}
                                  onMouseDown={(e) => handleMouseDown(e, item, 'resize-right')}
                               ></div>
                          </div>
                      </div>
                    );
                })}
                
                {/* Background Grid Lines based on headers */}
                <div className="absolute inset-0 pointer-events-none flex z-[-1]">
                   {ganttConfig.headers.map((header, i) => (
                       <div 
                         key={i} 
                         className={`border-r border-gray-50 h-full ${header.isWeekend ? 'bg-gray-50/30' : ''}`}
                         style={{ width: `${header.widthPct}%` }}
                       ></div>
                   ))}
                </div>
           </div>
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="新建工作项"
        size="lg"
        footer={
          <>
            <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">取消</button>
            <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 bg-pink-700 text-white rounded text-sm hover:bg-pink-800 shadow-sm">创建</button>
          </>
        }
      >
         <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
               <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">标题 <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none" placeholder="输入工作项标题" autoFocus />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">类型</label>
                  <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 outline-none">
                     <option>需求 (Feature)</option>
                     <option>缺陷 (Bug)</option>
                     <option>任务 (Task)</option>
                  </select>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">优先级</label>
                   <div className="relative">
                      <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm pl-9 focus:ring-2 focus:ring-pink-500 outline-none appearance-none bg-white">
                         <option>High</option>
                         <option>Medium</option>
                         <option>Low</option>
                         <option>Critical</option>
                      </select>
                      <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                   </div>
               </div>
               <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">负责人</label>
                   <div className="relative">
                      <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm pl-9 focus:ring-2 focus:ring-pink-500 outline-none appearance-none bg-white">
                         <option>looking4id</option>
                         <option>Unassigned</option>
                      </select>
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                   </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">开始时间</label>
                   <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 outline-none" />
               </div>
               <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">结束时间</label>
                   <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 outline-none" />
               </div>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
               <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-32 focus:ring-2 focus:ring-pink-500 outline-none resize-none" placeholder="输入详细描述..."></textarea>
            </div>
         </div>
      </Modal>

      {/* Advanced Filter Modal */}
      <Modal
         isOpen={isFilterModalOpen}
         onClose={() => setIsFilterModalOpen(false)}
         title="高级筛选"
         size="md"
         footer={
            <>
               <button onClick={() => setIsFilterModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">重置</button>
               <button onClick={() => setIsFilterModalOpen(false)} className="px-4 py-2 bg-pink-700 text-white rounded text-sm hover:bg-pink-800 shadow-sm">应用筛选</button>
            </>
         }
      >
         <div className="space-y-4">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">所属迭代</label>
               <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white">
                  <option>所有迭代</option>
                  <option>Sprint 1</option>
                  <option>Sprint 2</option>
               </select>
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">创建人</label>
               <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="输入用户名" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">标签包含</label>
               <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="例如: 前端, 紧急" />
            </div>
         </div>
      </Modal>
    </div>
  );
};

export default Planning;
