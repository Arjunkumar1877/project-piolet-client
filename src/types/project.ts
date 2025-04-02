export interface Project {
  id: string;
  projectName: string;
  description?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'on-hold';
  tasks: {
    total: number;
    completed: number;
  };
  members: ProjectMember[];
} 

export interface ProjectMember {
  name: string;
  role: string;
  email: string;
}
