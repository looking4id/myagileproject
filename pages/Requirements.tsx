
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Plus, ChevronDown, LayoutList, MoreHorizontal, User, Calendar, Tag, MessageSquare, Paperclip, CheckSquare, Clock, AlertCircle, X, ChevronRight, Edit3, Kanban, FileText, Trash2, GripVertical } from 'lucide-react';
import Modal from '../components/Modal';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface RequirementsProps {
  viewType: 'requirements' | 'tasks' | 'defects';
}

interface Column {
  id: string;
  title: string;
  statuses: string[];
  defaultStatus: string;
}

interface RequirementItem {
  id: string;
  title: string;
  type: string;
  priority: string;
  status: string;
  author: string;
  created: string;
  due: string;
  desc: string;
}

const Requirements: React.FC<RequirementsProps> = ({ viewType }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RequirementItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'board'>('board');

  // Kanban State
  const [items, setItems] = useState<RequirementItem[]>([
    { id: 'ICQMBW', title: '【示例缺陷】手机号注册页面样式异常', type: 'Defect', priority: 'High', status: 'Fixing', author: 'looking4id', created: '8月2日 20:23', due: '08-16~08-30 逾期92天', desc: '在某些低分辨率手机上，注册页面的输入框对齐有问题，且验证码按钮显示不全。' },
    { id: 'ICQMBV', title: '【示例缺陷】多人在点餐页面卡顿', type: 'Defect', priority: 'High', status: 'Fixing', author: 'looking4id', created: '8月2日 20:23', due: '08-02~08-16 逾期106天', desc: '并发用户超过50人时，点餐页面加载延迟超过3秒，购物车同步有明显延迟。' },
    { id: 'ICQMBP', title: '【示例需求】支持微信小程序在线点餐', type: 'Req', priority: 'High', status: 'InProgress', author: 'looking4id', created: '8月2日 20:24', due: '08-16~08-30 逾期92天', desc: '用户可以通过微信小程序扫描桌码进行点餐，支持多人同时点餐，购物车实时同步。' },
    { id: 'ICQMBU', title: '【示例缺陷】多语言切换失效', type: 'Defect', priority: 'Medium', status: 'Verified', author: 'looking4id', created: '8月2日 20:23', due: '08-02~08-16 逾期106天', desc: '切换到英文模式后，部分菜单项仍然显示为中文。' },
    { id: 'ICQMC7', title: '【示例需求】支持多语言切换', type: 'Req', priority: 'Medium', status: 'ToDo', author: 'looking4id', created: '8月2日 20:24', due: '08-16~08-30 逾期92天', desc: '系统需支持中文、英文、日文三种语言切换，后台可配置语言包。' },
    // Tasks
    { id: 'ICQMC8', title: '【示例任务】多人点餐 PRD 编写', type: 'Task', priority: 'High', status: 'Done', author: 'looking4id', created: '8月2日 20:24', due: '08-16~08-30 逾期92天', desc: '完成多人点餐功能的详细需求文档编写，包括流程图和交互原型。' },
    { id: 'ICQMC9', title: '【示例任务】前端页面切图', type: 'Task', priority: 'Medium', status: 'InProgress', author: 'looking4id', created: '8月2日 20:24', due: '08-16~08-30 逾期92天', desc: '根据UI设计稿完成点餐页面的HTML/CSS切图。' },
    { id: 'ICQMCB', title: '【示例任务】后端接口设计', type: 'Task', priority: 'High', status: 'ToDo', author: 'looking4id', created: '8月2日 20:24', due: '08-16~08-30 逾期92天', desc: '设计并输出多人点餐功能的后端API接口文档。' },
  ]);

  const [columns, setColumns] = useState<Column[]>([
    { id: 'col-todo', title: '待处理', statuses: ['ToDo'], defaultStatus: 'ToDo' },
    { id: 'col-doing', title: '进行中', statuses: ['InProgress', 'Fixing'], defaultStatus: 'InProgress' },
    { id: 'col-done', title: '已完成', statuses: ['Done', 'Verified'], defaultStatus: 'Done' }
  ]);

  // Column Management State
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [columnForm, setColumnForm] = useState({ id: '', title: '' });
  const [isEditingColumn, setIsEditingColumn] = useState(false);

  const config = useMemo(() => {
    switch (viewType) {
      case 'defects': return { title: '缺陷', createBtn: '新建缺陷', filterType: 'Defect' };
      case 'tasks': return { title: '任务', createBtn: '新建任务', filterType: 'Task' };
      case 'requirements': default: return { title: '需求', createBtn: '新建需求', filterType: 'Req' };
    }
  }, [viewType]);

  const filteredItems = items.filter(item => item.type === config.filterType);

  const openDetail = (item: RequirementItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  // Drag and Drop Handlers
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Reordering Columns
    if (type === 'column') {
      const newColumns = Array.from(columns);
      const [removed] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, removed);
      setColumns(newColumns);
      return;
    }

    // Moving Cards
    if (type === 'card') {
      const startCol = columns.find(col => col.id === source.droppableId);
      const finishCol = columns.find(col => col.id === destination.droppableId);

      if (!startCol || !finishCol) return;

      // Moving within the same column (Reorder not fully persisted in this simplified model, but needed for UI)
      if (startCol === finishCol) {
        // Since we are filtering items dynamically, reordering the 'items' array
        // to reflect the new visual order is tricky without an explicit 'order' field.
        // For this demo, we will just update the array order.
        const newItems = Array.from(items);
        const itemIndex = newItems.findIndex(i => i.id === draggableId);
        // We are just updating state to trigger re-render if needed, but logic for reordering inside filtered list is skipped for brevity
        return; 
      }

      // Moving to a different column
      const newItems = items.map(item => {
        if (item.id === draggableId) {
          return { ...item, status: finishCol.defaultStatus };
        }
        return item;
      });
      setItems(newItems);
    }
  };

  const handleAddColumn = () => {
    setColumnForm({ id: '', title: '' });
    setIsEditingColumn(false);
    setShowColumnModal(true);
  };

  const handleEditColumn = (col: Column) => {
    setColumnForm({ id: col.id, title: col.title });
    setIsEditingColumn(true);
    setShowColumnModal(true);
  };

  const handleDeleteColumn = (colId: string) => {
    if (confirm('确定要删除此列吗？该列下的任务将不会被删除，但可能无法在看板中正确显示。')) {
      setColumns(columns.filter(c => c.id !== colId));
    }
  };

  const saveColumn = () => {
    if (!columnForm.title) return;

    if (isEditingColumn) {
      setColumns(columns.map(c => c.id === columnForm.id ? { ...c, title: columnForm.title } : c));
    } else {
      const newId = `col-${Date.now()}`;
      setColumns([...columns, { 
        id: newId, 
        title: columnForm.title, 
        statuses: [columnForm.title], // Simplified status mapping
        defaultStatus: columnForm.title 
      }]);
    }
    setShowColumnModal(false);
  };

  const renderBoard = () => {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-columns" direction="horizontal" type="column">
          {(provided) => (
            <div 
              className="flex-1 overflow-x-auto overflow-y-hidden p-6 bg-gray-50 flex h-full gap-6 min-w-max"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {columns.map((col, index) => {
                const colItems = filteredItems.filter(item => col.statuses.includes(item.status) || item.status === col.defaultStatus);
                
                return (
                  <Draggable key={col.id} draggableId={col.id} index={index}>
                    {(provided) => (
                      <div 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="w-80 flex flex-col bg-gray-100/50 rounded-lg border border-gray-200 h-full max-h-full"
                      >
                        {/* Column Header */}
                        <div 
                          {...provided.dragHandleProps}
                          className="p-3 flex items-center justify-between border-b border-gray-200 bg-gray-50 rounded-t-lg shrink-0 group"
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${
                              col.id === 'col-done' ? 'bg-green-500' : 
                              col.id === 'col-doing' ? 'bg-blue-500' : 
                              col.id === 'col-todo' ? 'bg-gray-400' : 'bg-purple-500'
                            }`}></span>
                            <span className="font-semibold text-gray-700 text-sm">{col.title}</span>
                            <span className="bg-white px-2 py-0.5 rounded-full text-xs text-gray-500 border border-gray-200 shadow-sm">
                              {colItems.length}
                            </span>
                          </div>
                          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                             <button onClick={() => handleEditColumn(col)} className="p-1 hover:bg-gray-200 rounded text-gray-500">
                               <Edit3 className="w-3 h-3" />
                             </button>
                             <button onClick={() => handleDeleteColumn(col.id)} className="p-1 hover:bg-red-100 rounded text-red-500">
                               <Trash2 className="w-3 h-3" />
                             </button>
                          </div>
                        </div>

                        {/* Cards Container */}
                        <Droppable droppableId={col.id} type="card">
                          {(provided, snapshot) => (
                            <div 
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`p-3 flex-1 overflow-y-auto custom-scrollbar space-y-3 transition-colors ${snapshot.isDraggingOver ? 'bg-blue-50/50' : ''}`}
                            >
                              {colItems.map((item, itemIndex) => (
                                <Draggable key={item.id} draggableId={item.id} index={itemIndex}>
                                  {(provided, snapshot) => (
                                    <div 
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      onClick={() => openDetail(item)}
                                      style={{ ...provided.draggableProps.style }}
                                      className={`bg-white p-3 rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group ${snapshot.isDragging ? 'rotate-2 shadow-lg ring-2 ring-pink-100' : ''}`}
                                    >
                                      <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-mono text-gray-500 bg-gray-50 px-1 rounded border border-gray-100">{item.id}</span>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                           <MoreHorizontal className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                        </div>
                                      </div>
                                      
                                      <div className="mb-3">
                                        <div className="flex items-start gap-1.5">
                                           {item.type === 'Defect' && <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
                                           {item.type === 'Req' && <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />}
                                           {item.type === 'Task' && <CheckSquare className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />}
                                           <span className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-pink-600 transition-colors">{item.title}</span>
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                                        <div className="flex items-center gap-2">
                                           <div className="w-5 h-5 bg-amber-500 rounded-full text-white text-[10px] flex items-center justify-center">Lo</div>
                                           <span className="text-xs text-gray-500">{item.author}</span>
                                        </div>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                           item.priority === 'High' ? 'text-red-600 bg-red-50 border-red-100' : 
                                           item.priority === 'Medium' ? 'text-orange-600 bg-orange-50 border-orange-100' :
                                           'text-green-600 bg-green-50 border-green-100'
                                        }`}>
                                           {item.priority === 'High' ? '紧急' : item.priority === 'Medium' ? '高' : '中'}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
              
              {/* Add Column Button */}
              <div className="w-80 shrink-0">
                 <button 
                   onClick={handleAddColumn}
                   className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-pink-400 hover:text-pink-600 hover:bg-pink-50 transition-all flex items-center justify-center font-medium"
                 >
                    <Plus className="w-5 h-5 mr-2" /> 添加新列
                 </button>
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white">
       {/* Header */}
       <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-20">
           <div className="flex items-center gap-2">
               <h1 className="text-xl font-bold text-gray-900">{config.title}</h1>
           </div>
           <div className="flex gap-2">
               <div className="flex bg-gray-100 rounded-md p-0.5 mr-2">
                   <button 
                     onClick={() => setViewMode('list')}
                     className={`p-1.5 rounded-sm transition-colors ${viewMode === 'list' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                     title="列表视图"
                   >
                       <LayoutList className="w-4 h-4" />
                   </button>
                   <button 
                     onClick={() => setViewMode('board')}
                     className={`p-1.5 rounded-sm transition-colors ${viewMode === 'board' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                     title="看板视图"
                   >
                       <Kanban className="w-4 h-4" />
                   </button>
               </div>
               <button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-pink-700 text-white px-4 py-2 rounded shadow hover:bg-pink-800 flex items-center text-sm transition-colors"
               >
                  <Plus className="w-4 h-4 mr-2" /> {config.createBtn}
               </button>
               <button className="p-2 border border-gray-300 rounded text-gray-500 hover:bg-gray-50"><MoreHorizontal className="w-4 h-4" /></button>
           </div>
       </div>

       {/* Toolbar */}
       <div className="p-4 flex items-center justify-between bg-white border-b border-gray-200 sticky top-[69px] z-10">
           <div className="flex items-center gap-3">
               <span className="text-sm text-gray-500">共 {filteredItems.length} 项</span>
               <div className="relative">
                    <input type="text" placeholder="输入关键词" className="pl-8 pr-8 py-1.5 border border-gray-300 rounded text-sm w-48 focus:ring-1 focus:ring-blue-500 outline-none" />
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               </div>
               <div className="flex gap-2">
                   <button className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm text-gray-600 flex items-center hover:bg-gray-50 transition-colors">
                       负责人 <ChevronDown className="w-3 h-3 ml-1" />
                   </button>
                   <button className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm text-gray-600 flex items-center hover:bg-gray-50 transition-colors">
                       优先级 <ChevronDown className="w-3 h-3 ml-1" />
                   </button>
                   <button className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm text-gray-600 flex items-center hover:bg-gray-50 transition-colors">
                       状态 <ChevronDown className="w-3 h-3 ml-1" />
                   </button>
               </div>
           </div>
           <div className="flex items-center gap-3 text-sm text-gray-600">
               <button className="flex items-center hover:text-gray-900"><Filter className="w-4 h-4 mr-1" /> 筛选</button>
           </div>
       </div>

       {/* Content Area */}
       {viewMode === 'board' ? renderBoard() : (
           <div className="flex-1 overflow-auto bg-white">
               <table className="w-full text-left text-sm">
                   <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200 sticky top-0 z-10">
                       <tr>
                           <th className="px-4 py-3 w-8"><input type="checkbox" className="rounded border-gray-300 text-pink-600 focus:ring-pink-500" /></th>
                           <th className="px-4 py-3 w-24">ID</th>
                           <th className="px-4 py-3">标题</th>
                           <th className="px-4 py-3 w-20">优先级</th>
                           <th className="px-4 py-3 w-24">标签</th>
                           <th className="px-4 py-3 w-24">状态</th>
                           <th className="px-4 py-3 w-32">创建时间</th>
                           <th className="px-4 py-3 w-24">负责人</th>
                           <th className="px-4 py-3 w-20">类型</th>
                           <th className="px-4 py-3 w-48">计划时间</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                       {filteredItems.length > 0 ? (
                           filteredItems.map(item => (
                               <tr 
                                  key={item.id} 
                                  onClick={() => openDetail(item)}
                                  className="hover:bg-gray-50 group transition-colors cursor-pointer"
                               >
                                   <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                      <input type="checkbox" className="rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
                                   </td>
                                   <td className="px-4 py-3 text-gray-500 font-mono text-xs"><span className="bg-gray-100 rounded px-1.5 py-0.5">{item.id}</span></td>
                                   <td className="px-4 py-3">
                                       <div className="flex items-center gap-2">
                                           {item.type === 'Defect' ? (
                                               <span className="bg-red-500 text-white p-0.5 rounded text-[10px] shrink-0">Bug</span>
                                           ) : item.type === 'Task' ? (
                                               <span className="bg-blue-400 text-white p-0.5 rounded text-[10px] shrink-0">Task</span>
                                           ) : (
                                               <span className="bg-blue-600 text-white p-0.5 rounded text-[10px] shrink-0">Req</span>
                                           )}
                                           <span className="text-gray-900 font-medium hover:text-pink-600 transition-colors">{item.title}</span>
                                       </div>
                                   </td>
                                   <td className="px-4 py-3">
                                       <span className={`border px-1.5 py-0.5 rounded text-xs ${item.priority === 'High' ? 'text-red-600 border-red-200 bg-red-50' : 'text-yellow-600 border-yellow-200 bg-yellow-50'}`}>
                                           {item.priority === 'High' ? '紧急' : '高'}
                                       </span>
                                   </td>
                                   <td className="px-4 py-3">
                                       <span className="bg-blue-50 text-blue-700 text-xs px-1.5 py-0.5 rounded border border-blue-100">新手引导</span>
                                   </td>
                                   <td className="px-4 py-3">
                                       <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded w-fit">
                                           <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Verified' || item.status === 'Done' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                                           {item.status === 'Fixing' ? '修复中' : item.status === 'Verified' ? '已修复' : item.status === 'Done' ? '已完成' : '进行中'}
                                       </div>
                                   </td>
                                   <td className="px-4 py-3 text-gray-500 text-xs">{item.created}</td>
                                   <td className="px-4 py-3">
                                       <div className="flex items-center gap-1">
                                           <div className="w-5 h-5 bg-amber-500 rounded-full text-white text-[10px] flex items-center justify-center">Lo</div>
                                           <span className="text-gray-600 text-xs">{item.author}</span>
                                       </div>
                                   </td>
                                   <td className="px-4 py-3 text-gray-600 text-xs">
                                       {item.type === 'Defect' ? '缺陷' : item.type === 'Task' ? '任务' : '需求'}
                                   </td>
                                   <td className="px-4 py-3 text-red-500 text-xs">{item.due}</td>
                               </tr>
                           ))
                       ) : (
                           <tr>
                               <td colSpan={10} className="px-4 py-12 text-center text-gray-400">
                                   暂无数据
                               </td>
                           </tr>
                       )}
                   </tbody>
               </table>
           </div>
       )}

       {/* Create/Edit Column Modal */}
       <Modal
          isOpen={showColumnModal}
          onClose={() => setShowColumnModal(false)}
          title={isEditingColumn ? "编辑列" : "添加新列"}
          size="sm"
          footer={
             <>
                <button onClick={() => setShowColumnModal(false)} className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">取消</button>
                <button onClick={saveColumn} className="px-4 py-2 bg-pink-700 text-white rounded text-sm hover:bg-pink-800">保存</button>
             </>
          }
       >
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">列名称</label>
             <input 
                type="text" 
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 outline-none" 
                placeholder="例如: 测试中, 待发布" 
                autoFocus
                value={columnForm.title}
                onChange={(e) => setColumnForm({ ...columnForm, title: e.target.value })}
             />
          </div>
       </Modal>

       {/* Create Item Modal */}
       <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title={config.createBtn}
          size="lg"
          footer={
             <>
                <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">取消</button>
                <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-pink-700 text-white rounded text-sm hover:bg-pink-800 shadow-sm">创建</button>
             </>
          }
       >
          <div className="space-y-4">
             {/* Common Title */}
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标题 <span className="text-red-500">*</span></label>
                <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 outline-none" placeholder={`输入${config.title}标题`} autoFocus />
             </div>

             {/* Dynamic Form Content */}
             {viewType === 'requirements' && (
                 <>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">优先级</label>
                            <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-pink-500 outline-none">
                                <option>High (高)</option>
                                <option>Medium (中)</option>
                                <option>Low (低)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">需求类型</label>
                            <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-pink-500 outline-none">
                                <option>功能特性 (Feature)</option>
                                <option>非功能需求 (NFR)</option>
                                <option>用户体验 (UX)</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">计划开始</label>
                             <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 outline-none" />
                         </div>
                         <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">计划完成</label>
                             <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 outline-none" />
                         </div>
                    </div>
                 </>
             )}

             {viewType === 'tasks' && (
                 <>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">优先级</label>
                            <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-pink-500 outline-none">
                                <option>High (高)</option>
                                <option>Medium (中)</option>
                                <option>Low (低)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">任务类型</label>
                            <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-pink-500 outline-none">
                                <option>开发任务</option>
                                <option>测试任务</option>
                                <option>设计任务</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">指派给</label>
                            <div className="flex items-center border border-gray-300 rounded px-3 py-2 bg-white">
                                <User className="w-4 h-4 text-gray-400 mr-2" />
                                <input type="text" placeholder="搜索成员" className="flex-1 text-sm outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">预计工时</label>
                            <div className="flex items-center border border-gray-300 rounded px-3 py-2 bg-white">
                                <Clock className="w-4 h-4 text-gray-400 mr-2" />
                                <input type="number" placeholder="小时" className="flex-1 text-sm outline-none" />
                            </div>
                        </div>
                    </div>
                 </>
             )}

             {viewType === 'defects' && (
                 <>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">严重程度</label>
                            <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-pink-500 outline-none">
                                <option className="text-red-600">Critical (致命)</option>
                                <option className="text-orange-500">Major (严重)</option>
                                <option>Minor (一般)</option>
                                <option>Trivial (轻微)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">优先级</label>
                            <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-pink-500 outline-none">
                                <option>High (高)</option>
                                <option>Medium (中)</option>
                                <option>Low (低)</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">发现版本</label>
                             <input type="text" placeholder="例如: v1.2.0" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 outline-none" />
                         </div>
                         <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">环境</label>
                             <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-pink-500 outline-none">
                                 <option>生产环境 (Prod)</option>
                                 <option>预发布环境 (UAT)</option>
                                 <option>测试环境 (Test)</option>
                             </select>
                         </div>
                    </div>
                 </>
             )}

             {/* Common Description */}
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {viewType === 'defects' ? '缺陷描述 / 复现步骤' : '详细描述'}
                </label>
                <textarea 
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-32 resize-none focus:ring-2 focus:ring-pink-500 outline-none" 
                    placeholder={viewType === 'defects' ? '1. 打开页面...\n2. 点击按钮...\n3. 报错信息...' : '输入详细信息...'}
                ></textarea>
             </div>
             
             {/* Common Attachments */}
             <div className="border border-dashed border-gray-300 rounded px-4 py-3 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                  <Paperclip className="w-5 h-5 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">拖拽文件到此处或点击上传附件</span>
             </div>
          </div>
       </Modal>

       {/* Detail Modal */}
       {selectedItem && (
          <Modal
             isOpen={isDetailModalOpen}
             onClose={() => setIsDetailModalOpen(false)}
             title={`${selectedItem.id} ${selectedItem.type === 'Defect' ? '缺陷详情' : selectedItem.type === 'Task' ? '任务详情' : '需求详情'}`}
             size="2xl"
          >
             <div className="flex flex-col h-[70vh]">
                 <div className="flex flex-1 overflow-hidden">
                    {/* Main Content */}
                    <div className="flex-1 pr-6 overflow-y-auto custom-scrollbar">
                         <div className="flex items-start gap-2 mb-4">
                              {selectedItem.type === 'Defect' ? (
                                  <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-xs mt-1 shrink-0">Bug</span>
                              ) : selectedItem.type === 'Task' ? (
                                  <span className="bg-blue-400 text-white px-1.5 py-0.5 rounded text-xs mt-1 shrink-0">Task</span>
                              ) : (
                                  <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-xs mt-1 shrink-0">Req</span>
                              )}
                              <h2 className="text-xl font-bold text-gray-900 leading-snug">{selectedItem.title}</h2>
                         </div>

                         <div className="flex items-center gap-3 mb-6">
                            <button className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-700">
                                <Edit3 className="w-3 h-3" /> 编辑
                            </button>
                            <button className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-700">
                                <Paperclip className="w-3 h-3" /> 附件
                            </button>
                            <button className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-700">
                                <MoreHorizontal className="w-3 h-3" /> 更多
                            </button>
                         </div>

                         <div className="space-y-6">
                             <section>
                                 <h3 className="text-sm font-bold text-gray-900 mb-2">描述</h3>
                                 <div className="text-sm text-gray-700 leading-relaxed p-3 bg-gray-50 rounded border border-gray-100 min-h-[100px]">
                                     {selectedItem.desc}
                                 </div>
                             </section>

                             <section>
                                 <div className="border-b border-gray-200 mb-4">
                                     <div className="flex gap-6">
                                         <button className="text-sm font-medium text-pink-600 border-b-2 border-pink-600 pb-2">活动</button>
                                         <button className="text-sm font-medium text-gray-500 hover:text-gray-800 pb-2">评论</button>
                                         <button className="text-sm font-medium text-gray-500 hover:text-gray-800 pb-2">关联</button>
                                         <button className="text-sm font-medium text-gray-500 hover:text-gray-800 pb-2">工时</button>
                                     </div>
                                 </div>
                                 
                                 <div className="space-y-4">
                                     <div className="flex gap-3">
                                         <div className="w-8 h-8 bg-amber-500 rounded-full text-white text-xs flex items-center justify-center shrink-0">Lo</div>
                                         <div className="flex-1">
                                             <div className="bg-gray-50 rounded px-3 py-2 text-sm text-gray-700">
                                                 <span className="font-bold text-gray-900 mr-2">looking4id</span>
                                                 <span>创建了工作项</span>
                                             </div>
                                             <div className="text-xs text-gray-400 mt-1">{selectedItem.created}</div>
                                         </div>
                                     </div>
                                     
                                     {selectedItem.status === 'Verified' && (
                                         <div className="flex gap-3">
                                             <div className="w-8 h-8 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center shrink-0">QA</div>
                                             <div className="flex-1">
                                                 <div className="bg-gray-50 rounded px-3 py-2 text-sm text-gray-700">
                                                     <span className="font-bold text-gray-900 mr-2">TestUser</span>
                                                     <span>将状态更新为 <span className="text-green-600 font-medium">已修复</span></span>
                                                 </div>
                                                 <div className="text-xs text-gray-400 mt-1">10分钟前</div>
                                             </div>
                                         </div>
                                     )}
                                 </div>
                             </section>
                         </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-72 border-l border-gray-200 pl-6 space-y-6 overflow-y-auto custom-scrollbar">
                         <div>
                             <label className="block text-xs font-medium text-gray-500 mb-1">状态</label>
                             <div className="relative">
                                 <select 
                                    className="w-full appearance-none bg-white border border-gray-300 hover:border-gray-400 px-3 py-1.5 rounded text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    defaultValue={selectedItem.status}
                                 >
                                     <option value="ToDo">待处理</option>
                                     <option value="InProgress">进行中</option>
                                     <option value="Fixing">修复中</option>
                                     <option value="Verified">已修复</option>
                                     <option value="Done">已完成</option>
                                 </select>
                                 <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                             </div>
                         </div>

                         <div>
                             <label className="block text-xs font-medium text-gray-500 mb-1">负责人</label>
                             <div className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded cursor-pointer border border-transparent hover:border-gray-200">
                                 <div className="w-6 h-6 bg-amber-500 rounded-full text-white text-[10px] flex items-center justify-center">Lo</div>
                                 <span className="text-sm text-gray-700">{selectedItem.author}</span>
                             </div>
                         </div>

                         <div>
                             <label className="block text-xs font-medium text-gray-500 mb-1">优先级</label>
                             <div className="flex items-center gap-2">
                                 {selectedItem.priority === 'High' ? (
                                     <span className="text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded text-xs flex items-center gap-1 w-fit">
                                         <AlertCircle className="w-3 h-3" /> 紧急
                                     </span>
                                 ) : (
                                     <span className="text-yellow-600 bg-yellow-50 border border-yellow-100 px-2 py-0.5 rounded text-xs flex items-center gap-1 w-fit">
                                         <AlertCircle className="w-3 h-3" /> 高
                                     </span>
                                 )}
                             </div>
                         </div>

                         <div className="space-y-3 pt-3 border-t border-gray-100">
                             <div>
                                 <div className="flex items-center gap-2 text-gray-500 mb-1">
                                     <Calendar className="w-3.5 h-3.5" />
                                     <span className="text-xs">计划开始</span>
                                 </div>
                                 <div className="text-sm text-gray-800 pl-6">2025-08-16</div>
                             </div>
                             <div>
                                 <div className="flex items-center gap-2 text-gray-500 mb-1">
                                     <Calendar className="w-3.5 h-3.5" />
                                     <span className="text-xs">计划截止</span>
                                 </div>
                                 <div className="text-sm text-gray-800 pl-6">2025-08-30</div>
                             </div>
                         </div>

                         <div className="pt-3 border-t border-gray-100">
                             <label className="block text-xs font-medium text-gray-500 mb-2">所属迭代</label>
                             <div className="text-sm text-blue-600 hover:underline cursor-pointer">Sprint1: 功能优化</div>
                         </div>

                         <div className="pt-3 border-t border-gray-100">
                             <label className="block text-xs font-medium text-gray-500 mb-2">标签</label>
                             <div className="flex flex-wrap gap-2">
                                 <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">新手引导</span>
                                 <span className="border border-dashed border-gray-300 text-gray-400 px-2 py-0.5 rounded-full text-xs hover:border-gray-400 cursor-pointer flex items-center">
                                     <Plus className="w-3 h-3 mr-1" /> 添加
                                 </span>
                             </div>
                         </div>
                    </div>
                 </div>
             </div>
          </Modal>
       )}
    </div>
  );
};

export default Requirements;
