export interface Student {
  rollNumber: string; // Unique primary key
  name: string;
  cgpa: number;
  marks: number;
  financialNeed: number; // 1-10 (high means more need)
  department: string;
  email: string;
  enrolledCourses: string[];
}

export interface Course {
  code: string; // e.g., "CS101"
  name: string;
  credits: number;
  prerequisites: string[]; // List of course codes required before enrolling
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  department: string;
}

export interface FeeRecord {
  id: string;
  rollNumber: string;
  studentName: string;
  amount: number;
  status: 'PENDING' | 'PAID';
  timestamp: string;
}

export interface Book {
  isbn: string;
  title: string;
  author: string;
  isAvailable: boolean;
  borrowedBy?: string; // Roll number
}

export interface CampusBuilding {
  id: string;
  name: string;
  x: number; // For visualization
  y: number; // For visualization
}

export interface CampusEdge {
  from: string;
  to: string;
  weight: number; // Distance in meters
}

export interface AdminAction {
  type: 'ADD' | 'DELETE' | 'UPDATE';
  entity: 'student' | 'course' | 'notice' | 'fee';
  prevData: any;
  newData: any;
  timestamp: string;
}
