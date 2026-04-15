import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CollegeEvent, Registration, RegistrationStatus } from "./types";
import { supabase } from "./supabase";
import { toast } from "sonner";

interface DataContextType {
  events: CollegeEvent[];
  registrations: Registration[];
  addEvent: (event: Omit<CollegeEvent, "id" | "registeredCount">) => Promise<void>;
  updateEvent: (id: string, updates: Partial<CollegeEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  registerStudent: (eventId: string, student: { id: string; name: string; email: string }) => Promise<void>;
  updateRegistrationStatus: (registrationId: string, status: RegistrationStatus) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<CollegeEvent[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [{ data: eventsData }, { data: regsData }] = await Promise.all([
        supabase.from("events").select("*").order("date", { ascending: true }),
        supabase.from("registrations").select("*").order("registeredAt", { ascending: false }),
      ]);

      if (eventsData) setEvents(eventsData as CollegeEvent[]);
      if (regsData) setRegistrations(regsData as Registration[]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoaded(true);
    }
  };

  const addEvent = async (eventData: Omit<CollegeEvent, "id" | "registeredCount">) => {
    const { data: newEvent, error } = await supabase
      .from("events")
      .insert([eventData])
      .select()
      .single();

    if (error) {
      toast.error(error.message);
      return;
    }
    if (newEvent) {
      setEvents((prev) => [...prev, newEvent as CollegeEvent]);
    }
  };

  const updateEvent = async (id: string, updates: Partial<CollegeEvent>) => {
    const { data: updatedEvent, error } = await supabase
      .from("events")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      toast.error(error.message);
      return;
    }
    if (updatedEvent) {
      setEvents((prev) => prev.map((e) => (e.id === id ? (updatedEvent as CollegeEvent) : e)));
    }
  };

  const deleteEvent = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setEvents((prev) => prev.filter((event) => event.id !== id));
    setRegistrations((prev) => prev.filter((reg) => reg.eventId !== id));
  };

  const registerStudent = async (eventId: string, student: { id: string; name: string; email: string }) => {
    const newReg = {
      eventId,
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      status: "pending",
    };

    const { data: insertedReg, error } = await supabase
      .from("registrations")
      .insert([newReg])
      .select()
      .single();

    if (error) {
      toast.error("Registration failed: " + error.message);
      return;
    }

    if (insertedReg) {
      setRegistrations((prev) => [...prev, insertedReg as Registration]);
      
      const event = events.find((e) => e.id === eventId);
      if (event) {
        const newCount = event.registeredCount + 1;
        await supabase.from("events").update({ registeredCount: newCount }).eq("id", eventId);
        setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, registeredCount: newCount } : e)));
      }
    }
  };

  const updateRegistrationStatus = async (registrationId: string, status: RegistrationStatus) => {
    const { error } = await supabase
      .from("registrations")
      .update({ status })
      .eq("id", registrationId);

    if (error) {
      toast.error(error.message);
      return;
    }

    setRegistrations((prev) =>
      prev.map((reg) => (reg.id === registrationId ? { ...reg, status } : reg))
    );

    if (status === "rejected") {
      const reg = registrations.find((r) => r.id === registrationId);
      if (reg) {
        const event = events.find((e) => e.id === reg.eventId);
        if (event) {
          const newCount = Math.max(0, event.registeredCount - 1);
          await supabase.from("events").update({ registeredCount: newCount }).eq("id", event.id);
          setEvents((prevEvents) =>
            prevEvents.map((e) => (e.id === event.id ? { ...e, registeredCount: newCount } : e))
          );
        }
      }
    }
  };

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
