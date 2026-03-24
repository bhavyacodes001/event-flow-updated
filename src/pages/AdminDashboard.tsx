import React from "react";
import { mockEvents, mockRegistrations } from "@/lib/mock-data";
import { CalendarDays, Users, ClipboardList, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  const totalEvents = mockEvents.length;
  const totalRegistrations = mockRegistrations.length;
  const pendingApprovals = mockRegistrations.filter((r) => r.status === "pending").length;
  const totalSeatsUsed = mockEvents.reduce((sum, e) => sum + e.registeredCount, 0);

  const stats = [
    { label: "Total Events", value: totalEvents, icon: CalendarDays, color: "text-accent" },
    { label: "Total Registrations", value: totalRegistrations, icon: ClipboardList, color: "text-blue-500" },
    { label: "Pending Approvals", value: pendingApprovals, icon: Users, color: "text-amber-500" },
    { label: "Seats Filled", value: totalSeatsUsed, icon: TrendingUp, color: "text-green-500" },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-heading text-foreground mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-8">Overview of your event management system</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="p-5 rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="text-3xl font-heading text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent events */}
      <h2 className="text-xl font-heading text-foreground mb-4">Recent Events</h2>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Event</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Category</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">Date</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Seats</th>
            </tr>
          </thead>
          <tbody>
            {mockEvents.slice(0, 5).map((event) => (
              <tr key={event.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 font-medium text-foreground">{event.title}</td>
                <td className="py-3 px-4 hidden md:table-cell">
                  <span className="badge-category">{event.category}</span>
                </td>
                <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{event.date}</td>
                <td className="py-3 px-4 text-muted-foreground">
                  {event.registeredCount}/{event.totalSeats}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
