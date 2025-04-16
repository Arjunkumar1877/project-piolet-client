import { ProjectDetails } from '@/src/types/project';

// Function to generate a project prefix from project name
const generateProjectPrefix = (projectName: string): string => {
  // Take first 3-4 letters of project name, uppercase them
  const prefix = projectName
    .replace(/[^a-zA-Z]/g, '') // Remove non-alphabetic characters
    .slice(0, 4)
    .toUpperCase();
  
  return prefix.length >= 3 ? prefix : prefix.padEnd(3, 'X');
};

// Function to generate a unique ticket number
export const generateTicketNumber = (project: ProjectDetails, existingTicketNumbers: string[]): string => {
  const prefix = generateProjectPrefix(project.projectName);
  let counter = 1;
  
  // Find the highest existing ticket number for this prefix
  const existingNumbers = existingTicketNumbers
    .filter(ticket => ticket.startsWith(prefix))
    .map(ticket => parseInt(ticket.split('-')[1]))
    .filter(num => !isNaN(num));
  
  if (existingNumbers.length > 0) {
    counter = Math.max(...existingNumbers) + 1;
  }
  
  // Format the number with leading zeros (e.g., 001)
  const formattedNumber = counter.toString().padStart(3, '0');
  
  return `${prefix}-${formattedNumber}`;
}; 