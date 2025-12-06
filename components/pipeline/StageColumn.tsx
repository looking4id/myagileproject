
import React, { useState } from 'react';
import { Stage, Job } from '../../types';
import { Icons } from './Icons';

interface StageColumnProps {
  stage: Stage;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  isDragging: boolean;
  onAddJob: (stageId: string, groupIndex?: number) => void;
  onEditJob: (job: Job) => void;
  onDeleteJob: (stageId: string, jobId: string) => void;
  onDeleteStage: (stageId: string) => void;
  onCopyStage: (stage: Stage) => void;
  onEditStage: (stage: Stage) => void;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onDragEnd: () => void;
  onViewLogs: (job: Job) => void;
}

export const StageColumn: React.FC<StageColumnProps> = ({
  stage,
  index,
  isDragging,
  onAddJob,
  onEditJob,
  onDeleteJob,
  onDeleteStage,
  onCopyStage,
  onEditStage,
  onDragStart,
  onDragEnter,
  onDragEnd
}) => {
  const [showStageActions, setShowStageActions] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.drag-handle')) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(index);
  };

  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      onDragEnter={() => onDragEnter(index)}
      onDragOver={(e) => e.preventDefault()}
      onDragEnd={onDragEnd}
      className={`relative flex flex-col min-w-[280px] mx-4 transition-all duration-200 group/stage rounded-xl ${
        isDragging 
          ? 'bg-blue-50/80 border-2 border-dashed border-blue-400 shadow-inner' 
          : 'border-2 border-transparent'
      }`}
    >
      <div className={`flex flex-col h-full transition-opacity duration-200 ${isDragging ? 'opacity-20 blur-[1px] pointer-events-none' : ''}`}>
          {/* Stage Header */}
          <div 
            className="flex items-center justify-between mb-4 px-1"
            onMouseEnter={() => setShowStageActions(true)}
            onMouseLeave={() => setShowStageActions(false)}
          >
              <div className="flex items-center gap-2 drag-handle cursor-grab active:cursor-grabbing">
                 <h3 
                    className="font-medium text-gray-500 text-sm hover:text-blue-600 cursor-pointer"
                    onClick={() => onEditStage(stage)}
                 >
                    {stage.name}
                 </h3>
              </div>
              
              <div className="relative">
                 <Icons.GripVertical className="w-4 h-4 text-gray-300 cursor-grab drag-handle" />
                 
                 {/* Stage Actions Popover */}
                 {showStageActions && !isDragging && (
                     <div className="absolute right-0 top-6 bg-white shadow-lg rounded-md border border-gray-100 p-1 flex flex-col z-50 w-24 animate-fade-in">
                         <button 
                            onClick={() => onCopyStage(stage)}
                            className="flex items-center px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-sm"
                         >
                             <Icons.Copy className="w-3 h-3 mr-2" /> 复制
                         </button>
                         <button 
                            onClick={() => onDeleteStage(stage.id)}
                            className="flex items-center px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-red-600 rounded-sm"
                         >
                             <Icons.Trash2 className="w-3 h-3 mr-2" /> 删除
                         </button>
                     </div>
                 )}
              </div>
          </div>

          {/* Jobs Container */}
          <div className="flex flex-col space-y-4 relative">
            {stage.groups.flat().map((job, jobIndex) => (
                <div key={job.id} className="relative group/job flex items-center">
                    {/* Job Card */}
                    <div 
                        onClick={() => onEditJob(job)}
                        className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-3 shadow-sm hover:shadow-md hover:border-blue-400 cursor-pointer transition-all flex items-center justify-between z-10"
                    >
                        <div className="flex items-center gap-3">
                            {/* Job Icon */}
                            <div className={`p-1.5 rounded-full ${job.type.includes('test') ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'}`}>
                                {job.type.includes('git') ? <Icons.GitBranch className="w-4 h-4" /> :
                                 job.type.includes('build') ? <Icons.Box className="w-4 h-4" /> :
                                 <Icons.Terminal className="w-4 h-4" />}
                            </div>
                            <span className="text-sm text-gray-700 font-medium">{job.name}</span>
                        </div>
                        
                        {/* Hover Actions */}
                        <div className="hidden group-hover/job:flex items-center gap-1">
                            <button 
                                onClick={(e) => { e.stopPropagation(); onDeleteJob(stage.id, job.id); }}
                                className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full"
                            >
                                <Icons.X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Add Button Below Job (Visualized as connected) */}
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover/job:opacity-100 transition-opacity pt-1">
                         <button 
                            onClick={() => onAddJob(stage.id, jobIndex + 1)} // Insert after
                            className="w-5 h-5 bg-white border border-blue-500 text-blue-500 rounded-full flex items-center justify-center hover:bg-blue-50 shadow-sm"
                         >
                             <Icons.Plus className="w-3 h-3" />
                         </button>
                    </div>
                    
                    {/* Connector Line to Next Job */}
                    {jobIndex < stage.groups.flat().length - 1 && (
                        <div className="absolute left-1/2 top-full h-4 w-px bg-gray-300 -translate-x-1/2 -z-10"></div>
                    )}
                </div>
            ))}

            {/* Empty State Add Button */}
            {stage.groups.flat().length === 0 && (
                <button 
                    onClick={() => onAddJob(stage.id)}
                    className="w-full py-4 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center"
                >
                    <Icons.Plus className="w-5 h-5 mr-2" /> 添加任务
                </button>
            )}
          </div>
      </div>

      {/* Dragging Placeholder Overlay */}
      {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="bg-white/90 text-blue-600 px-4 py-2 rounded-full shadow-md border border-blue-100 font-medium flex items-center gap-2 animate-pulse">
                  <Icons.Move className="w-4 h-4" />
                  放置于此
              </div>
          </div>
      )}
    </div>
  );
};
