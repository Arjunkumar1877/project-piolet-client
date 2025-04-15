export interface CreateTaskDto {
    ticketNumber: string;
    title: string;
    description?: string;
    project: string;
    status?: 'pending' | 'in-progress' | 'completed' | 'cancelled';
    startDate: Date;
    dueDate: Date;
  }

  


  export interface UpdateTaskDto {
    ticketNumber?: string;
    title?: string;
    description?: string;
    project?: string;
    status?: 'pending' | 'in-progress' | 'completed' | 'cancelled';
    startDate?: Date;
    dueDate?: Date;
  }
  