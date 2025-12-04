
import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, Layout, FileText, CheckSquare, Bug, 
  Layers, FlaskConical, BookOpen, GitPullRequest, Box, 
  Trash2, Shield, Webhook, Database, PenTool, Plus, 
  Search, ToggleLeft, ToggleRight, AlertTriangle, Check,
  Edit2, MoreHorizontal, ArrowLeft
} from 'lucide-react';
import Modal from '../components/Modal';

type SettingsTab = 'info' | 'components' | 'delete' | 'webhooks' | 'fields' | 'req-fields' | 'task-fields' | 'defect-fields';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('info');
  const [webhookView, setWebhookView] = useState<'list' | 'create'>('list');
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);

  // Mock Data for Components
  const components = [
    { id: 'planning', name: '规划', desc: '专业的甘特图和日历视图，帮助用户更直观的规划工作项。', icon: Layout, enabled: true },
    { id: 'req', name: '需求', desc: '记录和查看需求，保留需求下的子任务显示，方便用户跟踪管理。', icon: FileText, enabled: true },
    { id: 'task', name: '任务', desc: '记录团队待办事项，跟踪团队进展。', icon: CheckSquare, enabled: true },
    { id: 'defect', name: '缺陷', desc: '管理产品缺陷，可关联测试用例，方便开发和测试同步跟踪。', icon: Bug, enabled: true },
    { id: 'iteration', name: '迭代', desc: '专业的敏捷开发管理功能，提供更快速的工作项规划和跟踪能力。', icon: Layers, enabled: true },
    { id: 'version', name: '版本', desc: '专业的版本管理功能，详细记录版本发布内容，有效控制版本发布流程。', icon: BookOpen, enabled: true },
    { id: 'code', name: '代码评审', desc: '强大的代码审查功能，可以帮助团队提高代码质量，减少缺陷产生。', icon: GitPullRequest, enabled: true },
    { id: 'repo', name: '代码仓库', desc: '集成代码托管服务，方便代码管理。', icon: Box, enabled: false },
  ];

  // Mock Data for WebHooks
  const webhooks = [
      { id: '1', url: 'https://oapi.dingtalk.com/robot/send...', name: '钉钉群通知', status: 'active', events: ['任务变更', '缺陷创建'] }
  ];

  // Sidebar Menu Structure
  const menuGroups = [
    {
      title: '基本设置',
      items: [
        { id: 'info', label: '项目信息', icon: SettingsIcon },
        { id: 'components', label: '组件设置', icon: Box },
        { id: 'delete', label: '删除项目', icon: Trash2 },
      ]
    },
    {
      title: '高级设置',
      items: [
        { id: 'webhooks', label: 'WebHooks', icon: Webhook },
      ]
    },
    {
        title: '项目字段设置',
        items: [
            { id: 'fields', label: '需求类型设置', icon: Database },
        ]
    },
    {
        title: '工作项设置',
        items: [
            { id: 'req-fields', label: '需求', icon: FileText },
            { id: 'task-fields', label: '任务', icon: CheckSquare },
            { id: 'defect-fields', label: '缺陷', icon: Bug },
        ]
    }
  ];

  const renderProjectInfo = () => (
    <div className="max-w-4xl">
        <h2 className="text-xl font-bold text-gray-900 mb-6">项目信息</h2>
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">项目名称 <span className="text-red-500">*</span></label>
                <input type="text" defaultValue="敏捷研发项目01" className="w-full md:w-1/2 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">项目编号 <span className="text-red-500">*</span></label>
                <input type="text" defaultValue="P1000" className="w-full md:w-1/2 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">颜色 <span className="text-red-500">*</span></label>
                <div className="flex gap-3">
                    {['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef'].map(color => (
                        <div key={color} className="relative cursor-pointer">
                            <div className="w-8 h-8 rounded shadow-sm" style={{ backgroundColor: color }}></div>
                            {color === '#ef4444' && <div className="absolute inset-0 flex items-center justify-center text-white"><Check className="w-5 h-5" /></div>}
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">项目简介</label>
                <textarea className="w-full md:w-3/4 border border-gray-300 rounded px-3 py-2 text-sm h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none" defaultValue="这是一个自动创建的示例项目，如不需要可自行删除"></textarea>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">项目状态</label>
                <select className="w-full md:w-1/2 border border-gray-300 rounded px-3 py-2 text-sm bg-white">
                    <option>开始</option>
                    <option>暂停</option>
                    <option>结束</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">项目负责人</label>
                <div className="flex items-center w-full md:w-1/2 border border-gray-300 rounded px-3 py-2 bg-white">
                    <div className="w-5 h-5 bg-amber-500 rounded-full text-white text-xs flex items-center justify-center mr-2">Lo</div>
                    <span className="text-sm">looking4id</span>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">工作项管理模式</label>
                <div className="space-y-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input type="radio" name="mode" className="mt-1 text-blue-600 focus:ring-blue-500" />
                        <div>
                            <div className="text-sm font-medium text-gray-900">极简模式</div>
                            <div className="text-xs text-gray-500">极致简单的管理模式，能够跨属性展示工作项，适用于单团队轻量协同</div>
                        </div>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input type="radio" name="mode" defaultChecked className="mt-1 text-blue-600 focus:ring-blue-500" />
                        <div>
                            <div className="text-sm font-medium text-gray-900">专业模式</div>
                            <div className="text-xs text-gray-500">专业有序的管理模式，分属性（需求、任务、缺陷）展示工作项，适用于多团队规范协同</div>
                        </div>
                    </label>
                </div>
            </div>
            <div className="pt-4">
                <button className="bg-pink-700 text-white px-6 py-2 rounded text-sm hover:bg-pink-800 shadow-sm transition-colors">
                    保存
                </button>
            </div>
        </div>
    </div>
  );

  const renderComponentSettings = () => (
      <div className="max-w-5xl">
          <h2 className="text-xl font-bold text-gray-900 mb-2">组件设置</h2>
          <p className="text-sm text-gray-500 mb-6 bg-blue-50 p-3 rounded border border-blue-100">
              管理员可根据团队协作场景，自由配置项目组件和组件的排列顺序。关闭某一组件后，成员无法访问该模块和数据直至该功能被重新启用
          </p>
          <div className="space-y-4">
              {components.map((comp) => (
                  <div key={comp.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between bg-white hover:shadow-sm transition-shadow">
                      <div className="flex items-start gap-4">
                          <div className="p-2 bg-gray-100 rounded text-gray-600 mt-1">
                              <comp.icon className="w-5 h-5" />
                          </div>
                          <div>
                              <div className="font-medium text-gray-900 mb-1">{comp.name}</div>
                              <p className="text-xs text-gray-500">{comp.desc}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-4">
                          <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${comp.enabled ? 'bg-pink-700' : 'bg-gray-300'}`}>
                              <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${comp.enabled ? 'translate-x-6' : ''}`}></div>
                          </div>
                          <div className="flex items-center text-xs text-gray-400 gap-1 border-l border-gray-200 pl-4">
                              <span>所有角色可见</span>
                              <Edit2 className="w-3 h-3 hover:text-gray-600 cursor-pointer" />
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  const renderDeleteProject = () => (
      <div className="max-w-4xl">
          <h2 className="text-xl font-bold text-gray-900 mb-6">删除项目</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-red-700 font-bold mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> 危险操作
              </h3>
              <p className="text-sm text-red-600 mb-6">
                  删除项目将会连同其相关的所有数据（包括工作项、里程碑等在内）一起删除。此操作无法恢复！
              </p>
              <button className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 shadow-sm transition-colors">
                  确认删除
              </button>
          </div>
      </div>
  );

  const renderWebHooks = () => {
      if (webhookView === 'create') {
          return (
              <div className="max-w-4xl">
                  <div className="flex items-center gap-2 mb-6">
                      <button onClick={() => setWebhookView('list')} className="p-1 hover:bg-gray-100 rounded text-gray-500">
                          <ArrowLeft className="w-5 h-5" />
                      </button>
                      <h2 className="text-xl font-bold text-gray-900">新建 WebHook</h2>
                  </div>
                  
                  <div className="bg-orange-50 border border-orange-100 text-sm text-orange-800 p-4 rounded mb-6">
                      URL: WebHook 被触发后，发送 HTTP / HTTPS 的目标通知地址。<br/>
                      WebHook 密码/签名密钥: 用于 WebHook 鉴权的方式，可通过 <span className="bg-orange-200 px-1 rounded font-mono text-xs">WebHook 密码</span> 进行鉴权，或通过 <span className="bg-orange-200 px-1 rounded font-mono text-xs">签名密钥</span> 生成请求签名进行鉴权。
                  </div>

                  <div className="space-y-6">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">URL <span className="text-red-500">*</span></label>
                          <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="POST 地址" />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">WebHook 别名</label>
                          <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="选填，可用于备注 WebHook 用途" />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">密码/签名密钥</label>
                          <div className="flex gap-2">
                              <select className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                                  <option>密码</option>
                                  <option>签名密钥</option>
                              </select>
                              <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="请输入 WebHook 所使用的密码" />
                          </div>
                      </div>
                      
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">选择事件</label>
                          <div className="space-y-4 border border-gray-200 rounded p-4">
                              <div className="flex items-center gap-4 text-sm border-b border-gray-100 pb-2">
                                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="event" className="text-pink-600" /> 所有事件</label>
                                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="event" className="text-pink-600" /> 项目协同</label>
                                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="event" className="text-pink-600" /> 代码协同</label>
                                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="event" defaultChecked className="text-pink-600" /> 自定义事件</label>
                              </div>
                              
                              <div className="grid grid-cols-1 gap-4">
                                  {[
                                      { name: '项目', events: ['删除项目', '开始项目', '暂停项目', '关闭项目', '成员加入'] },
                                      { name: '测试', events: ['导入测试用例', '新建测试计划', '开始测试计划', '结束测试计划'] },
                                      { name: '版本', events: ['新建版本', '阶段更新'] },
                                      { name: '迭代', events: ['新建迭代', '开始迭代', '结束迭代'] },
                                      { name: '仓库', events: ['推送代码', '推送分支', '删除分支', '推送标签', '删除标签', '评论仓库', '评论 Commit'] },
                                      { name: '代码评审', events: ['新建', '合并', '关闭', '评审', '重新打开 PR', '指派审查者', '取消审查者', '审查通过', '指派测试者', '取消测试者', '测试通过', '更新源分支代码', '更新标签', '设置草稿', '取消草稿', '关联/取消关联工作项'] },
                                      { name: '工作项', events: ['新建工作项', '导入工作项', '彻底删除', '评论工作项', '更改负责人', '取消负责人', '添加协作者', '取消协作者', '更改类型', '更改状态', '更改计划时间', '登记工时', '上传附件', '删除附件'] }
                                  ].map(group => (
                                      <div key={group.name} className="flex items-start gap-4">
                                          <div className="w-20 text-sm font-medium text-gray-600 pt-0.5">{group.name}</div>
                                          <div className="flex-1 grid grid-cols-4 gap-3">
                                              {group.events.map(evt => (
                                                  <label key={evt} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:text-gray-900">
                                                      <input type="checkbox" defaultChecked={['新建', '删除'].some(k => evt.includes(k))} className="rounded text-pink-600 focus:ring-pink-500 border-gray-300" />
                                                      {evt}
                                                  </label>
                                              ))}
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                          <button className="bg-pink-700 text-white px-6 py-2 rounded text-sm hover:bg-pink-800 shadow-sm transition-colors">新建</button>
                          <button onClick={() => setWebhookView('list')} className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded text-sm hover:bg-gray-50 transition-colors">取消</button>
                      </div>
                  </div>
              </div>
          );
      }

      return (
          <div className="max-w-6xl">
              <div className="flex items-center justify-between mb-6">
                  <div>
                      <h2 className="text-xl font-bold text-gray-900">WebHooks 管理</h2>
                      <div className="text-sm text-gray-500 mt-1">
                          项目 WebHooks 对项目所关联的所有仓库的推送、代码评审、工作项有效。
                          <a href="#" className="text-blue-600 hover:underline ml-1">更多说明 »</a>
                      </div>
                  </div>
                  <button onClick={() => setWebhookView('create')} className="bg-pink-700 text-white px-4 py-2 rounded text-sm hover:bg-pink-800 shadow-sm flex items-center">
                      <Plus className="w-4 h-4 mr-2" /> 新建 WebHook
                  </button>
              </div>

              {webhooks.length > 0 ? (
                  <div className="border border-gray-200 rounded-lg bg-white">
                      <div className="flex items-center justify-center p-12 text-gray-400 flex-col">
                          {/* Placeholder for now as per "Empty" or "List" view */}
                          <div className="w-full text-center py-8">暂无 WebHook</div>
                      </div>
                  </div>
              ) : (
                  <div className="border border-gray-200 rounded-lg bg-white flex flex-col items-center justify-center p-12">
                      <Webhook className="w-12 h-12 text-gray-300 mb-4" />
                      <span className="text-gray-500">暂无 WebHook</span>
                  </div>
              )}
          </div>
      );
  };

  const renderFieldSettings = () => (
      <div className="max-w-6xl">
          <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">需求类型设置</h2>
              <div className="flex gap-2">
                  <div className="relative">
                      <input type="text" placeholder="搜索..." className="pl-8 pr-4 py-1.5 border border-gray-300 rounded text-sm w-56 focus:ring-1 focus:ring-blue-500 outline-none" />
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  <button 
                    onClick={() => setShowAddFieldModal(true)}
                    className="bg-pink-700 text-white px-4 py-1.5 rounded text-sm hover:bg-pink-800 shadow-sm flex items-center"
                  >
                      <Plus className="w-4 h-4 mr-2" /> 添加需求类型
                  </button>
              </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                      <tr>
                          <th className="px-6 py-3 w-10"><MoreHorizontal className="w-4 h-4" /></th>
                          <th className="px-6 py-3">名称</th>
                          <th className="px-6 py-3">描述</th>
                          <th className="px-6 py-3">是否启用</th>
                          <th className="px-6 py-3">操作</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-gray-400"><MoreHorizontal className="w-4 h-4 cursor-move" /></td>
                          <td className="px-6 py-4">需求 <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs ml-2">默认类型</span></td>
                          <td className="px-6 py-4 text-gray-500">-</td>
                          <td className="px-6 py-4">
                              <div className="w-10 h-5 bg-pink-700 rounded-full relative cursor-pointer">
                                  <div className="w-3 h-3 bg-white rounded-full absolute right-1 top-1"></div>
                              </div>
                          </td>
                          <td className="px-6 py-4 flex gap-3 text-gray-500">
                              <button className="hover:text-blue-600 flex items-center gap-1"><SettingsIcon className="w-3 h-3" /> 查看配置</button>
                              <button className="hover:text-blue-600 flex items-center gap-1"><Database className="w-3 h-3" /> 数据迁移</button>
                              <button className="hover:text-red-600 flex items-center gap-1"><Trash2 className="w-3 h-3" /> 移除</button>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>
  );

  return (
    <div className="flex h-full bg-gray-50">
       {/* Sidebar */}
       <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto">
           <div className="p-4 border-b border-gray-100 flex items-center gap-2">
               <ArrowLeft className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-900" />
               <h1 className="text-lg font-bold text-gray-800">项目设置</h1>
           </div>
           <div className="p-2 space-y-6">
               {menuGroups.map((group, idx) => (
                   <div key={idx}>
                       <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                           {group.title}
                       </div>
                       <div className="space-y-0.5">
                           {group.items.map(item => (
                               <button
                                   key={item.id}
                                   onClick={() => setActiveTab(item.id as SettingsTab)}
                                   className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                       activeTab === item.id 
                                       ? 'bg-pink-50 text-pink-700' 
                                       : 'text-gray-600 hover:bg-gray-100'
                                   }`}
                               >
                                   <item.icon className={`w-4 h-4 mr-3 ${activeTab === item.id ? 'text-pink-600' : 'text-gray-400'}`} />
                                   {item.label}
                               </button>
                           ))}
                       </div>
                   </div>
               ))}
           </div>
       </div>

       {/* Content */}
       <div className="flex-1 overflow-y-auto p-8">
           {activeTab === 'info' && renderProjectInfo()}
           {activeTab === 'components' && renderComponentSettings()}
           {activeTab === 'delete' && renderDeleteProject()}
           {activeTab === 'webhooks' && renderWebHooks()}
           {activeTab === 'fields' && renderFieldSettings()}
           {['req-fields', 'task-fields', 'defect-fields'].includes(activeTab) && (
               <div className="flex items-center justify-center h-64 text-gray-400">
                   功能开发中...
               </div>
           )}
       </div>

       {/* Add Field Modal */}
       <Modal
          isOpen={showAddFieldModal}
          onClose={() => setShowAddFieldModal(false)}
          title="添加字段"
          size="md"
          footer={
              <>
                 <button onClick={() => setShowAddFieldModal(false)} className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">取消</button>
                 <button onClick={() => setShowAddFieldModal(false)} className="px-4 py-2 bg-pink-700 text-white rounded text-sm hover:bg-pink-800">添加</button>
              </>
          }
       >
          <div className="flex flex-col items-center justify-center py-6 space-y-6">
              <div className="relative w-full max-w-xs">
                  <input type="text" placeholder="请输入项目自定义字段名称" className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none pr-10" />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              
              <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 mb-4 bg-gray-50 rounded-full flex items-center justify-center border border-dashed border-gray-300">
                      <Box className="w-10 h-10 text-gray-300" />
                  </div>
                  <p className="text-gray-500 text-sm">暂无项目自定义字段</p>
                  <p className="text-xs text-gray-400 mt-1">找不到预期的项目自定义字段 <a href="#" className="text-blue-600 hover:underline">去企业管理添加</a></p>
              </div>
          </div>
       </Modal>
    </div>
  );
};

export default Settings;
