import React, { useState } from "react";
import { useData } from "@/lib/data-context";
import { Button } from "@/components/ui/button";
import { Check, X, ClipboardList, Filter } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const AdminRegistrationsPage = () => {
  const { events, registrations, updateRegistrationStatus } = useData();
  const [filterEvent, setFilterEvent] = useState<string>("all");

  const filtered = filterEvent === "all" ? registrations : registrations.filter((r) => r.eventId === filterEvent);

  const handleApprove = (id: string) => {
    updateRegistrationStatus(id, "approved");
    toast.success("Registration approved");
  };

  const handleReject = (id: string) => {
    updateRegistrationStatus(id, "rejected");
    toast.success("Registration rejected");
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      approved: "badge-status-approved",
      pending: "badge-status-pending",
      rejected: "badge-status-rejected",
    };
    return map[status] || "badge-category";
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-heading text-foreground mb-2">Registrations</h1>
      <p className="text-muted-foreground mb-6">View and manage student registrations</p>

      {/* Event filter */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <button
          onClick={() => setFilterEvent("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            filterEvent === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"
          }`}
        >
          All Events
        </button>
        {events.map((event) => (
          <button
            key={event.id}
            onClick={() => setFilterEvent(event.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filterEvent === event.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"
            }`}
          >
            {event.title}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <ClipboardList className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">No registrations found</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Student</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Event</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">Date</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((reg) => {
                const event = events.find((e) => e.id === reg.eventId);
                return (
                  <tr key={reg.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-foreground">{reg.studentName}</p>
                        <p className="text-xs text-muted-foreground">{reg.studentEmail}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{event?.title || "—"}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">
                      {format(new Date(reg.registeredAt), "MMM d, yyyy")}
                    </td>
                    <td className="py-3 px-4">
                      <span className={statusBadge(reg.status)}>{reg.status}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-1">
                        {reg.status === "pending" && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => handleApprove(reg.id)} className="text-success hover:text-success">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleReject(reg.id)} className="text-destructive hover:text-destructive">
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminRegistrationsPage;
