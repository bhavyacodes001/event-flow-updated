import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mockEvents } from "@/lib/mock-data";
import { EventCategory } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

const categories: EventCategory[] = ["Technical", "Cultural", "Sports", "Workshop", "Seminar", "Social"];

const AdminEventFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id && id !== "new");
  const existingEvent = isEdit ? mockEvents.find((e) => e.id === id) : null;

  const [form, setForm] = useState({
    title: existingEvent?.title || "",
    description: existingEvent?.description || "",
    date: existingEvent?.date || "",
    time: existingEvent?.time || "",
    venue: existingEvent?.venue || "",
    category: existingEvent?.category || ("Technical" as EventCategory),
    totalSeats: existingEvent?.totalSeats?.toString() || "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.venue || !form.totalSeats) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success(isEdit ? "Event updated successfully" : "Event created successfully");
    navigate("/admin/events");
  };

  return (
    <div className="animate-fade-in max-w-2xl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <h1 className="text-3xl font-heading text-foreground mb-8">{isEdit ? "Edit Event" : "Create New Event"}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Event Title *</Label>
          <Input id="title" value={form.title} onChange={(e) => handleChange("title", e.target.value)} placeholder="e.g. TechFest 2026" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={form.description} onChange={(e) => handleChange("description", e.target.value)} placeholder="Describe the event..." rows={4} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input id="date" type="date" value={form.date} onChange={(e) => handleChange("date", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input id="time" type="time" value={form.time} onChange={(e) => handleChange("time", e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="venue">Venue *</Label>
            <Input id="venue" value={form.venue} onChange={(e) => handleChange("venue", e.target.value)} placeholder="e.g. Main Auditorium" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalSeats">Total Seats *</Label>
            <Input id="totalSeats" type="number" min="1" value={form.totalSeats} onChange={(e) => handleChange("totalSeats", e.target.value)} placeholder="e.g. 200" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleChange("category", cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  form.category === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" /> {isEdit ? "Update Event" : "Create Event"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminEventFormPage;
