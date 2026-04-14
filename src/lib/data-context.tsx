import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CollegeEvent, Registration, RegistrationStatus } from "./types";
import { mockEvents, mockRegistrations } from "./mock-data";

interface DataContextType {
  events: CollegeEvent[];
  registrations: Registration[];
  addEvent: (event: Omit<CollegeEvent, "id" | "registeredCount">) => void;
  updateEvent: (id: string, updates: Partial<CollegeEvent>) => void;
  deleteEvent: (id: string) => void;
  registerStudent: (eventId: string, student: { id: string; name: string; email: string }) => void;
  updateRegistrationStatus: (registrationId: string, status: RegistrationStatus) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_EVENTS = "event-flow-events";
const LOCAL_STORAGE_KEY_REGISTRATIONS = "event-flow-registrations";

export function DataProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<CollegeEvent[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize data from local storage or fallback to mock data
  useEffect(() => {
    const storedEvents = localStorage.getItem(LOCAL_STORAGE_KEY_EVENTS);
    const storedRegistrations = localStorage.getItem(LOCAL_STORAGE_KEY_REGISTRATIONS);

    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    } else {
      setEvents(mockEvents);
      localStorage.setItem(LOCAL_STORAGE_KEY_EVENTS, JSON.stringify(mockEvents));
    }

    if (storedRegistrations) {
      setRegistrations(JSON.parse(storedRegistrations));
    } else {
      setRegistrations(mockRegistrations);
      localStorage.setItem(LOCAL_STORAGE_KEY_REGISTRATIONS, JSON.stringify(mockRegistrations));
    }
    
    setIsLoaded(true);
  }, []);

  // Sync back to local storage whenever events change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LOCAL_STORAGE_KEY_EVENTS, JSON.stringify(events));
    }
  }, [events, isLoaded]);

  // Sync back to local storage whenever registrations change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LOCAL_STORAGE_KEY_REGISTRATIONS, JSON.stringify(registrations));
    }
  }, [registrations, isLoaded]);

  const addEvent = (eventData: Omit<CollegeEvent, "id" | "registeredCount">) => {
    const newEvent: CollegeEvent = {
      ...eventData,
      id: `e${Date.now()}`,
      registeredCount: 0,
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  const updateEvent = (id: string, updates: Partial<CollegeEvent>) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, ...updates } : event))
    );
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
    // optionally cleanup related registrations
    setRegistrations((prev) => prev.filter((reg) => reg.eventId !== id));
  };

  const registerStudent = (eventId: string, student: { id: string; name: string; email: string }) => {
    const newRegistration: Registration = {
      id: `r${Date.now()}`,
      eventId,
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      status: "pending",
      registeredAt: new Date().toISOString(),
    };
    
    setRegistrations((prev) => [...prev, newRegistration]);
    
    // Increment registered count for the event
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? { ...event, registeredCount: event.registeredCount + 1 }
          : event
      )
    );
  };

  const updateRegistrationStatus = (registrationId: string, status: RegistrationStatus) => {
    setRegistrations((prev) =>
      prev.map((reg) => {
        if (reg.id === registrationId) {
          return { ...reg, status };
        }
        return reg;
      })
    );
    
    // If a registration is rejected, decrement the event's registeredCount
    if (status === "rejected") {
      const reg = registrations.find(r => r.id === registrationId);
      if (reg) {
        setEvents((prevEvents) => prevEvents.map(event => 
          event.id === reg.eventId ? { ...event, registeredCount: Math.max(0, event.registeredCount - 1) } : event
        ));
      }
    }
  };

  // Don't render children until data is loaded from local storage to prevent flicker
  if (!isLoaded) return null;

  return (
    <DataContext.Provider
      value={{
        events,
        registrations,
        addEvent,
        updateEvent,
        deleteEvent,
        registerStudent,
        updateRegistrationStatus,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
