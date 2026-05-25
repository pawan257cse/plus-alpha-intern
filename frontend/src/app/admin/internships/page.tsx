"use client";

import { useEffect, useState } from "react";
import { Trash2, Loader2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";

interface Internship {
  _id: string;
  title: string;
  company: string;
  domain: string;
  location: string;
  duration: string;
  stipend: string;
  description: string;
  requirements: string[];
}

export default function AdminInternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    domain: "",
    location: "",
    duration: "",
    stipend: "",
    description: "",
    requirements: "",
  });

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const { data } = await api.get("/internships");
      if (data.success) setInternships(data.data || []);
    } catch (error) {
      console.error("Error fetching internships:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addInternship = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const requirementsArray = formData.requirements
        .split(",")
        .map((req) => req.trim())
        .filter((req) => req);

      const { data } = await api.post("/internships", {
        ...formData,
        requirements: requirementsArray,
      });

      if (data.success) {
        alert("Internship added successfully!");
        setFormData({
          title: "",
          company: "",
          domain: "",
          location: "",
          duration: "",
          stipend: "",
          description: "",
          requirements: "",
        });
        fetchInternships();
      }
    } catch (error) {
      alert("Failed to add internship");
      console.error(error);
    }
  };

  const removeInternship = async (id: string) => {
    if (!confirm("Are you sure you want to remove this internship?")) return;
    
    try {
      const { data } = await api.delete(`/internships/${id}`);
      if (data.success) {
        alert("Internship removed successfully!");
        fetchInternships();
      }
    } catch (error) {
      alert("Failed to remove internship");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <Plus className="h-7 w-7 text-violet-500" />
        Manage Internships
      </h1>

      {/* Add Internship Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Internship</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addInternship} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 3 months"
                  required
                />
              </div>
              <div>
                <Label htmlFor="stipend">Stipend</Label>
                <Input
                  id="stipend"
                  name="stipend"
                  value={formData.stipend}
                  onChange={handleChange}
                  placeholder="e.g., $1000/month"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                required
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div>
              <Label htmlFor="requirements">Requirements (comma-separated)</Label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="e.g., React, Node.js, MongoDB"
                rows={2}
                required
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <Button type="submit">Add Internship</Button>
          </form>
        </CardContent>
      </Card>

      {/* Internships List */}
      <Card>
        <CardHeader>
          <CardTitle>Current Internships ({internships.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {internships.length === 0 ? (
            <p className="text-sm text-muted-foreground">No internships added yet.</p>
          ) : (
            <ul className="space-y-3">
              {internships.map((internship) => (
                <li
                  key={internship._id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 p-4"
                >
                  <div>
                    <p className="font-medium">{internship.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {internship.company} · {internship.domain} · {internship.location}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {internship.duration} · {internship.stipend}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => removeInternship(internship._id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}