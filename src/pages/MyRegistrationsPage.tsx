import React from "react";
import { useData } from "@/lib/data-context";
import { useAuth } from "@/lib/auth-context";
import StudentNavbar from "@/components/StudentNavbar";
import { CalendarDays, MapPin, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const MyRegistrationsPage = () => {
  const { user } = useAuth();
  const { events, registrations } = useData();
  const myRegistrations = registrations.filter((r) => r.studentId === user?.id);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      approved: "badge-status-approved",
      pending: "badge-status-pending",
      rejected: "badge-status-rejected",
    };
    return map[status] || "badge-category";
  };

  return (
    <div className="min-h-screen bg-background">
      <StudentNavbar />
      <main className="container py-8 max-w-3xl">
        <h1 className="text-3xl font-heading text-foreground mb-2">My Registrations</h1>
        <p className="text-muted-foreground mb-8">Track the status of your event registrations</p>

        {myRegistrations.length === 0 ? (
          <div className="text-center py-16">
            <ClipboardList className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">You haven't registered for any events yet</p>
            <Link to="/events" className="text-accent font-medium hover:underline">
              Browse events
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myRegistrations.map((reg) => {
              const event = events.find((e) => e.id === reg.eventId);
              if (!event) return null;
              return (
                <Link
                  key={reg.id}
                  to={`/events/${event.id}`}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:shadow-md transition-all"
                >
                  <div className="space-y-1">
                    <h3 className="font-medium text-foreground">{event.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {format(new Date(event.date), "MMM d, yyyy")}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.venue}
                      </span>
                    </div>
                  </div>
                  <span className={statusBadge(reg.status)}>{reg.status}</span>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyRegistrationsPage;
