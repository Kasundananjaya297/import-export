export type ComplaintStatus = 'Open' | 'In Progress' | 'Resolved';
export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  submittedBy: string;
  submittedDate: string;
  department: string;
  category: string;
}

export interface ComplaintsData {
  complaints: Complaint[];
} 