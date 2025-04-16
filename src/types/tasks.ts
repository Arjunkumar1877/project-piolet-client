import { TeamMember } from "./project";

export interface CreateTaskDto {
    ticketNumber: string;
    title: string;
    description?: string;
    project: string;
    assignedTo?: string[];
    status?: 'pending' | 'in-progress' | 'completed' | 'cancelled';
    startDate: Date;
    dueDate: Date;
  }

  


  export interface UpdateTaskDto {
    ticketNumber?: string;
    title?: string;
    description?: string;
    project?: string;
    assignedTo?: string[];
    status?: 'pending' | 'in-progress' | 'completed' | 'cancelled';
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
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
    startDate: Date;
    dueDate: Date;
    createdAt: Date;
    updatedAt: Date;
  }