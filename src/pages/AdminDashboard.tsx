import React from "react";
import { useData } from "@/lib/data-context";
import { CalendarDays, Users, ClipboardList, TrendingUp, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { events, registrations } = useData();
  const totalEvents = events.length;
  const totalRegistrations = registrations.length;
  const pendingApprovals = registrations.filter((r) => r.status === "pending").length;
  const totalSeatsUsed = events.reduce((sum, e) => sum + e.registeredCount, 0);

  const stats = [
    { label: "Total Events", value: totalEvents, icon: CalendarDays, accent: "bg-blue-500/10 text-blue-600" },
    { label: "Registrations", value: totalRegistrations, icon: ClipboardList, accent: "bg-accent/10 text-accent" },
    { label: "Pending", value: pendingApprovals, icon: Users, accent: "bg-amber-500/10 text-amber-600" },
    { label: "Seats Filled", value: totalSeatsUsed, icon: TrendingUp, accent: "bg-emerald-500/10 text-emerald-600" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading text-foreground mb-1">
          Welcome back, {user?.name || "Admin"} 👋
        </h1>
        <p className="text-muted-foreground">Here's what's happening with your events</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="group p-5 rounded-xl border border-border bg-card hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.accent}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-foreground transition-colors" />
            </div>
            <p className="text-3xl font-heading text-foreground mb-0.5">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <Link
          to="/admin/events/new"
          className="p-5 rounded-xl border border-border bg-card hover:border-accent hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <CalendarDays className="h-4 w-4 text-accent" />
            </div>
            <span className="font-medium text-foreground group-hover:text-accent transition-colors">Create New Event</span>
          </div>
          <p className="text-sm text-muted-foreground">Add a new event with details, venue, and capacity</p>
        </Link>
        <Link
          to="/admin/registrations"
          className="p-5 rounded-xl border border-border bg-card hover:border-accent hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <ClipboardList className="h-4 w-4 text-amber-600" />
            </div>
            <span className="font-medium text-foreground group-hover:text-accent transition-colors">
              Review Registrations
              {pendingApprovals > 0 && (
                <span className="ml-2 badge-status-pending">{pendingApprovals} pending</span>
              )}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Approve or reject student registrations</p>
        </Link>
      </div>

      {/* Recent events table */}
      <h2 className="text-xl font-heading text-foreground mb-4">Recent Events</h2>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Event</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Category</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">Date</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Capacity</th>
            </tr>
          </thead>
          <tbody>
            {events.slice(0, 5).map((event) => {
              const fill = Math.round((event.registeredCount / event.totalSeats) * 100);
              return (
                <tr key={event.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-medium text-foreground">{event.title}</td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="badge-category">{event.category}</span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{event.date}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${fill >= 95 ? "bg-destructive" : "bg-accent"}`}
                          style={{ width: `${fill}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{fill}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
