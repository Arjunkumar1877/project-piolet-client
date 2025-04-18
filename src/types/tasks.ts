import { TeamMember } from "./project";

export interface CreateTaskDto {
    ticketNumber: string;
    title: string;
    description?: string;
    project: string;
    assignedTo?: string[];
    status?: 'todo' | 'in-progress' | 'completed' | 'cancelled';
    priority?: 'low' | 'medium' | 'high';
    startDate: Date;
    dueDate: Date;
  }

  


  export interface UpdateTaskDto {
    ticketNumber?: string;
    title?: string;
    description?: string;
    project?: string;
    assignedTo?: string[];
    status?: 'todo' | 'in-progress' | 'completed' | 'cancelled';
    startDate?: Date;
    dueDate?: Date;
  }
  

  export interface Task {
    _id: string;
    ticketNumber: string;
    title: string;
    description?: string;
    project: string;
    assignedTo?: TeamMember[];
    status: 'todo' | 'in-progress' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high';
    startDate: Date;
    dueDate: Date;
    createdAt: Date;
    updatedAt: Date;
  }