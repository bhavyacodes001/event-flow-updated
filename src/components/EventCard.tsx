import React from "react";
import { CollegeEvent } from "@/lib/types";
import { CalendarDays, MapPin, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface EventCardProps {
  event: CollegeEvent;
  linkPrefix?: string;
}

const categoryColors: Record<string, string> = {
  Technical: "bg-blue-100 text-blue-700",
  Cultural: "bg-pink-100 text-pink-700",
  Sports: "bg-green-100 text-green-700",
  Workshop: "bg-purple-100 text-purple-700",
  Seminar: "bg-amber-100 text-amber-700",
  Social: "bg-orange-100 text-orange-700",
};

const EventCard = ({ event, linkPrefix = "/events" }: EventCardProps) => {
  const isFull = event.registeredCount >= event.totalSeats;
  const seatsLeft = event.totalSeats - event.registeredCount;
  const fillPercent = Math.min((event.registeredCount / event.totalSeats) * 100, 100);

  return (
    <Link to={`${linkPrefix}/${event.id}`} className="event-card block group">
      {/* Poster area */}
      <div className="h-40 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative overflow-hidden">
        <span className="text-4xl font-heading text-primary/20">{event.category.charAt(0)}</span>
        <span className={`absolute top-3 left-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[event.category] || "bg-secondary text-secondary-foreground"}`}>
          {event.category}
        </span>
        {isFull && (
          <span className="absolute top-3 right-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
            Full
          </span>
        )}
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-heading text-lg text-foreground group-hover:text-accent transition-colors line-clamp-1">
          {event.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>

        <div className="space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {format(new Date(event.date), "MMM d, yyyy")}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {event.time}
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {event.venue}
          </div>
        </div>

        {/* Seat capacity bar */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3" />
              {event.registeredCount}/{event.totalSeats}
            </span>
            <span className={isFull ? "text-destructive font-medium" : "text-muted-foreground"}>
              {isFull ? "No seats left" : `${seatsLeft} left`}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${isFull ? "bg-destructive" : "bg-accent"}`}
              style={{ width: `${fillPercent}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
