import React, { useState } from "react";
import { mockEvents } from "@/lib/mock-data";
import { CollegeEvent } from "@/lib/types";
import { Plus, Pencil, Trash2, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const AdminEventsPage = () => {
  const [events, setEvents] = useState<CollegeEvent[]>(mockEvents);

  const handleDelete = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    toast.success("Event deleted");
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading text-foreground mb-1">Manage Events</h1>
          <p className="text-muted-foreground">Create, edit, and manage campus events</p>
        </div>
        <Link to="/admin/events/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> New Event
          </Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-16">
          <CalendarDays className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">No events yet. Create your first event!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:shadow-sm transition-all"
            >
              <div className="flex-1 min-w-0 mr-4">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-foreground truncate">{event.title}</h3>
                  <span className="badge-category shrink-0">{event.category}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{format(new Date(event.date), "MMM d, yyyy")}</span>
                  <span>{event.venue}</span>
                  <span>{event.registeredCount}/{event.totalSeats} seats</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link to={`/admin/events/${event.id}/edit`}>
                  <Button variant="ghost" size="sm">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(event.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEventsPage;
