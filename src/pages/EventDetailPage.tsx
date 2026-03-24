import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockEvents, mockRegistrations } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import StudentNavbar from "@/components/StudentNavbar";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, MapPin, Users, ArrowLeft, Check, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const event = mockEvents.find((e) => e.id === id);

  const [isRegistered, setIsRegistered] = useState(() => {
    if (!user) return false;
    return mockRegistrations.some((r) => r.eventId === id && r.studentId === user.id);
  });

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <StudentNavbar />
        <div className="container py-16 text-center">
          <p className="text-muted-foreground">Event not found</p>
        </div>
      </div>
    );
  }

  const isFull = event.registeredCount >= event.totalSeats;
  const seatsLeft = event.totalSeats - event.registeredCount;

  const handleRegister = () => {
    if (isFull) {
      toast.error("This event is full");
      return;
    }
    setIsRegistered(true);
    toast.success("Successfully registered! Your registration is pending approval.");
  };

  const handleCancel = () => {
    setIsRegistered(false);
    toast.success("Registration cancelled");
  };

  return (
    <div className="min-h-screen bg-background">
      <StudentNavbar />
      <main className="container py-8 max-w-3xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to events
        </button>

        <div className="animate-fade-in">
          {/* Poster */}
          <div className="h-48 md:h-64 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-8">
            <span className="text-6xl font-heading text-primary/15">{event.category}</span>
          </div>

          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <span className="badge-category mb-2 inline-block">{event.category}</span>
              <h1 className="text-3xl font-heading text-foreground">{event.title}</h1>
            </div>

            <div>
              {isRegistered ? (
                <div className="flex items-center gap-2">
                  <span className="badge-status-approved flex items-center gap-1">
                    <Check className="h-3 w-3" /> Registered
                  </span>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="h-3.5 w-3.5 mr-1" /> Cancel
                  </Button>
                </div>
              ) : (
                <Button onClick={handleRegister} disabled={isFull}>
                  {isFull ? "Event Full" : "Register Now"}
                </Button>
              )}
            </div>
          </div>

          {/* Meta info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: CalendarDays, label: "Date", value: format(new Date(event.date), "MMM d, yyyy") },
              { icon: Clock, label: "Time", value: event.time },
              { icon: MapPin, label: "Venue", value: event.venue },
              { icon: Users, label: "Seats", value: `${seatsLeft} of ${event.totalSeats} left` },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </div>
                <p className="text-sm font-medium text-foreground">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Capacity bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Registration capacity</span>
              <span className="font-medium text-foreground">{Math.round((event.registeredCount / event.totalSeats) * 100)}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${isFull ? "bg-destructive" : "bg-accent"}`}
                style={{ width: `${(event.registeredCount / event.totalSeats) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-heading text-foreground mb-3">About this event</h2>
            <p className="text-muted-foreground leading-relaxed">{event.description}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetailPage;
