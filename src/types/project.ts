export interface Project {
  id?: string;
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


export type TeamMember = {
  _id: string
  name: string
  role: string
  email: string
  projects: string[] 
  createdAt: string
  updatedAt: string
  __v: number
}



export type CreateProject = {
  projectName: string;
  description: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled';
  budget: string;
  priority: 'low' | 'medium' | 'high';
  teamMembers?: string[];
  notes?: string;
};
