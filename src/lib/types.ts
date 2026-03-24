export type UserRole = "admin" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type EventCategory = "Technical" | "Cultural" | "Sports" | "Workshop" | "Seminar" | "Social";

export interface CollegeEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: EventCategory;
  posterUrl: string;
  totalSeats: number;
  registeredCount: number;
  createdBy: string;
}

export type RegistrationStatus = "pending" | "approved" | "rejected";

export interface Registration {
  id: string;
  eventId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  status: RegistrationStatus;
  registeredAt: string;
}
