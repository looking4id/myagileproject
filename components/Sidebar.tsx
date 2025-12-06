
import React from 'react';
import { 
  Layout, Calendar, FileText, CheckSquare, Bug, 
  GitPullRequest, PlayCircle, Layers, BarChart2, 
  Settings, Users, BookOpen, FlaskConical, MapPin, ShieldAlert
} from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItems = [
    { id: 'dashboard', label: '项目概览', icon: Layout },
    { id: 'planning', label: '规划', icon: Calendar },
    { id: 'requirements', label: '需求', icon: FileText, count: 11 },
    { id: 'tasks', label: '任务', icon: CheckSquare, count: 10 },
    { id: 'defects', label: '缺陷', icon: Bug, count: 4 },
    { id: 'iteration', label: '迭代', icon: Layers },
    { id: 'testing', label: '测试', icon: FlaskConical },
    { id: 'releases', label: '版本', icon: BookOpen },
    { id: 'milestones', label: '里程碑', icon: MapPin },
    { id: 'risks', label: '风险', icon: ShieldAlert, count: 2 },
    { id: 'code', label: '代码评审', icon: GitPullRequest, count: 1 },
    { id: 'pipelines', label: '流水线', icon: PlayCircle },
    { id: 'metrics', label: '效能度量', icon: BarChart2, badge: 'Beta' },
    { id: 'members', label: '成员', icon: Users, count: 1 },
    { id: 'settings', label: '项目设置', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 z-10">
      <div className="h-14 flex items-center px-4 border-b border-gray-100">
        <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center text-white font-bold mr-2">
          Ag
        </div>
        <span className="font-bold text-gray-800">敏捷研发项目01</span>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => {
            const viewId = item.id as ViewState; 
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onChangeView(viewId)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.count && (
                  <span className={`ml-auto inline-block py-0.5 px-2 text-xs rounded-full ${
                    isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {item.count}
                  </span>
                )}
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
