import React from "react";
import { useAuth } from "@/lib/auth-context";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, CalendarDays, ClipboardList, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const StudentNavbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = [
    { to: "/events", label: "Events", icon: CalendarDays },
    { to: "/my-registrations", label: "My Registrations", icon: ClipboardList },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/events" className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-accent" />
          <span className="font-heading text-lg text-foreground hidden sm:inline">Campus Events</span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <link.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            {user?.name}
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default StudentNavbar;
