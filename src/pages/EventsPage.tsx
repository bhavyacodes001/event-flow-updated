import React, { useState, useMemo } from "react";
import { useData } from "@/lib/data-context";
import { EventCategory } from "@/lib/types";
import StudentNavbar from "@/components/StudentNavbar";
import EventCard from "@/components/EventCard";
import { Search, Filter, CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";

const categories: EventCategory[] = ["Technical", "Cultural", "Sports", "Workshop", "Seminar", "Social"];

const EventsPage = () => {
  const { events: contextEvents } = useData();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | "All">("All");
  const [sortBy, setSortBy] = useState<"date" | "seats">("date");

  const filteredEvents = useMemo(() => {
    let events = [...contextEvents];

    if (search) {
      const q = search.toLowerCase();
      events = events.filter(
        (e) => e.title.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "All") {
      events = events.filter((e) => e.category === selectedCategory);
    }

    if (sortBy === "date") {
      events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else {
      events.sort((a, b) => (b.totalSeats - b.registeredCount) - (a.totalSeats - a.registeredCount));
    }

    return events;
  }, [search, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <StudentNavbar />
      <main className="container py-8">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading text-foreground mb-2">Upcoming Events</h1>
          <p className="text-muted-foreground">Discover and register for events happening on campus</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events or venues..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["All", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as EventCategory | "All")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-secondary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <CalendarDays className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground">No events found matching your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default EventsPage;
