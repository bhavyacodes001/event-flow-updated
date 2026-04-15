import React, { useMemo } from "react";
import { useData } from "@/lib/data-context";
import { CalendarDays, Users, ClipboardList, TrendingUp, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import { format, parseISO } from "date-fns";

const COLORS = ['hsl(var(--chart-1, 221.2 83.2% 53.3%))', 'hsl(var(--chart-2, 160 84% 39%))', 'hsl(var(--chart-3, 38 92% 50%))', 'hsl(var(--chart-4, 0 84% 60%))', 'hsl(var(--chart-5, 262 83% 58%))'];

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

  const registrationsByCategoryData = useMemo(() => {
    const counts = registrations.reduce((acc, reg) => {
      const event = events.find((e) => e.id === reg.eventId);
      if (event) {
        acc[event.category] = (acc[event.category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [registrations, events]);

  const categoryData = useMemo(() => {
    const counts = events.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [events]);

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

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Registrations Chart */}
        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="text-xl font-heading text-foreground mb-6">Registrations by Category</h3>
          <div className="h-64 mt-4">
            {registrationsByCategoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={registrationsByCategoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-lg">
                No registration data yet
              </div>
            )}
          </div>
        </div>

        {/* Categories Chart */}
        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="text-xl font-heading text-foreground mb-6">Events by Category</h3>
          <div className="h-64 mt-4">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-lg">
                No event data yet
              </div>
            )}
          </div>
        </div>
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
