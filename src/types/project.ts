

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



export type Project = {
  _id?: string;
  userId: string;
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


export type ProjectDetails = {
  _id?: string;
  userId: string;
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
  teamMembers?: TeamMember[];
  notes?: string;
};
