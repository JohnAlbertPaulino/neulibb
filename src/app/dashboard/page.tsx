"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Library, Building, BarChart4, Filter, Search } from "lucide-react";
import VisitorLog from "@/components/admin/VisitorLog";
import UserManagement from "@/components/admin/UserManagement";
import AIAnalytics from "@/components/admin/AIAnalytics";
import { Input } from "@/components/ui/input";
import { getCurrentUser } from "@/lib/auth-mock";
import { useRouter } from "next/navigation";
import { isToday, isThisWeek, isThisMonth } from "date-fns";

export default function AdminDashboard() {
  const router = useRouter();
  const [visits, setVisits] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'ADMIN') router.push("/");

    const storedVisits = JSON.parse(localStorage.getItem('campusflow_visits') || '[]');
    setVisits(storedVisits);
  }, [router]);

  const updateVisitStatus = (id: string, newStatus: string) => {
    const updated = visits.map(v => v.id === id ? { ...v, status: newStatus } : v);
    setVisits(updated);
    localStorage.setItem('campusflow_visits', JSON.stringify(updated));
  };

  const filteredVisits = visits.filter(v => {
    const matchesFacility = filter === "all" || v.facility === filter;
    const matchesSearch = v.visitorName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFacility && matchesSearch;
  });

  const stats = {
    total: visits.length,
    today: visits.filter(v => isToday(new Date(v.timestamp))).length,
    week: visits.filter(v => isThisWeek(new Date(v.timestamp))).length,
    month: visits.filter(v => isThisMonth(new Date(v.timestamp))).length,
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold text-foreground tracking-tight">Admin Console</h1>
            <p className="text-muted-foreground">Real-time oversight of campus facility traffic.</p>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Lookup visitor name..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-none shadow-sm bg-primary text-primary-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-wider">Total Visitors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
              <p className="text-xs opacity-70 mt-1">Lifetime analytics</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.today}</div>
              <p className="text-xs text-muted-foreground mt-1">Active current session</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.week}</div>
              <p className="text-xs text-muted-foreground mt-1">Rolling 7-day traffic</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.month}</div>
              <p className="text-xs text-muted-foreground mt-1">Seasonal patterns</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="log" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 max-w-md mx-auto sm:mx-0">
            <TabsTrigger value="log" className="gap-2">
              <BarChart4 className="w-4 h-4" /> Activity Log
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" /> User Mgmt
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2">
              <BarChart4 className="w-4 h-4" /> AI Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="log" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                <Filter className="w-4 h-4" /> Filter by:
                <button 
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1 rounded-full border transition-colors ${filter === "all" ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilter("Library")}
                  className={`px-3 py-1 rounded-full border transition-colors ${filter === "Library" ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`}
                >
                  Library
                </button>
                <button 
                  onClick={() => setFilter("Dean's Office")}
                  className={`px-3 py-1 rounded-full border transition-colors ${filter === "Dean's Office" ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`}
                >
                  Dean's Office
                </button>
              </div>
            </div>
            <VisitorLog visits={filteredVisits} onUpdateStatus={updateVisitStatus} />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="ai">
            <AIAnalytics visitorData={visits} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}