
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