
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Planning from './pages/Planning';
import Pipelines from './pages/Pipelines';
import Releases from './pages/Releases';
import PullRequests from './pages/PullRequests';
import Iterations from './pages/Iterations';
import Requirements from './pages/Requirements';
import Testing from './pages/Testing';
import Milestones from './pages/Milestones';
import Risks from './pages/Risks';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import { ViewState } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('planning');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'planning':
        return <Planning />;
      case 'pipelines':
        return <Pipelines />;
      case 'releases':
        return <Releases />;
      case 'milestones':
        return <Milestones />;
      case 'risks':
        return <Risks />;
      case 'code':
        return <PullRequests />;
      case 'iteration':
        return <Iterations />;
      case 'requirements':
        return <Requirements viewType="requirements" />;
      case 'tasks':
        return <Requirements viewType="tasks" />;
      case 'defects':
        return <Requirements viewType="defects" />;
      case 'testing':
        return <Testing />;
      case 'settings':
        return <Settings />;
      default:
        // Default fallbacks for unimplemented pages in this demo
        if (['metrics', 'members'].includes(currentView)) {
             return <div className="p-10 text-center text-gray-500">该模块正在开发中...</div>;
        }
        return <Planning />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 text-slate-900 font-sans">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      <div className="flex-1 flex flex-col ml-64 min-w-[800px]">
        <TopBar title="敏捷研发项目01" />
        <main className="flex-1 overflow-hidden">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
