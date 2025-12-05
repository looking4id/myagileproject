
export type ViewState = 'planning' | 'requirements' | 'tasks' | 'defects' | 'iteration' | 'testing' | 'releases' | 'pipelines' | 'code' | 'dashboard' | 'metrics' | 'members' | 'settings';

export interface User {
  name: string;
  avatar: string;
}

export enum Priority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
  Critical = 'Critical'
}

export enum Status {
  ToDo = 'ToDo',
  InProgress = 'InProgress',
  Done = 'Done',
  Blocked = 'Blocked'
}

export interface WorkItem {
  id: string;
  title: string;
  type: 'Feature' | 'Bug' | 'Task';
  priority: Priority;
  status: Status;
  assignee: User;
  startDate: string;
  endDate: string;
}

export interface Pipeline {
  id: string;
  name: string;
  status: 'Success' | 'Failed' | 'Running' | 'Pending';
  stage: string;
  trigger: string;
  time: string;
  duration: string;
}

export interface Release {
  version: string;
  name: string;
  date: string;
  status: 'Released' | 'Planned' | 'Delayed';
  progress: number;
}

// --- Pipeline Editor Types ---

export interface JobConfig {
  timeout?: number;
  repo?: string;
  branch?: string;
  image?: string;
  dockerfile?: string;
  context?: string;
  jdkVersion?: string;
  mvnCommand?: string;
  goVersion?: string;
  command?: string;
  namespace?: string;
  yamlPath?: string;
  scanLevel?: string;
  blockOnFailure?: boolean;
  approvers?: string[];
  script?: string;
  scriptPath?: string;
  chartType?: string;
  showTooltips?: boolean;
  [key: string]: any;
}

export interface Job {
  id: string;
  name: string;
  type: string;
  config: JobConfig;
}

export interface Stage {
  id: string;
  name: string;
  isParallel?: boolean;
  groups: Job[][];
}

export interface PipelineVariable {
  id: string;
  name: string;
  type: 'string' | 'boolean' | 'enum';
  defaultValue: string;
  description?: string;
}

export interface PipelineSettings {
  timeout: number;
  retryCount: number;
}

export interface PipelineData {
  id: string;
  name: string;
  description: string;
  stages: Stage[];
  variables: PipelineVariable[];
  settings: PipelineSettings;
}
