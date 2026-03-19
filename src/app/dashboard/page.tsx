"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Library, Building, BarChart4, Filter, Search, Globe, Users2, Briefcase } from "lucide-react";
import VisitorLog from "@/components/admin/VisitorLog";
import UserManagement from "@/components/admin/UserManagement";
import AIAnalytics from "@/components/admin/AIAnalytics";
import ActiveSessions from "@/components/admin/ActiveSessions";
import { Input } from "@/components/ui/input";
import { getCurrentUser } from "@/lib/auth-mock";
import { useRouter } from "next/navigation";
import { isToday, isThisWeek, isThisMonth } from "date-fns";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, updateDoc, doc } from "firebase/firestore";

export default function AdminDashboard() {
  const router = useRouter();
  const db = useFirestore();
  
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const visitsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "visits"), orderBy("checkInTime", "desc"));
  }, [db]);

  const { data: visits = [], isLoading } = useCollection(visitsQuery);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'ADMIN') router.push("/");
  }, [router]);

  const updateVisitStatus = (id: string, newStatus: string) => {
    const visitRef = doc(db, "visits", id);
    updateDoc(visitRef, { status: newStatus });
  };

  const filteredVisits = (visits || []).filter(v => {
    const matchesFacility = filter === "all" || v.facility === filter;
    const matchesSearch = v.visitorName?.toLowerCase().includes(searchTerm.toLowerCase()) || v.reasonForVisit?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === "all" || v.department === deptFilter;
    
    let matchesType = true;
    if (typeFilter === "Employee") {
      matchesType = v.visitorType === "Teacher" || v.visitorType === "Staff";
    } else if (typeFilter === "Student") {
      matchesType = v.visitorType === "Student";
    }

    return matchesFacility && matchesSearch && matchesDept && matchesType;
  });

  const stats = {
    total: visits?.length || 0,
    today: (visits || []).filter(v => v.checkInTime?.toDate && isToday(v.checkInTime.toDate())).length,
    week: (visits || []).filter(v => v.checkInTime?.toDate && isThisWeek(v.checkInTime.toDate())).length,
    month: (visits || []).filter(v => v.checkInTime?.toDate && isThisMonth(v.checkInTime.toDate())).length,
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
                placeholder="Search name or reason..." 
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
              <p className="text-xs opacity-70 mt-1">Live from Cloud</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.today}</div>
              <p className="text-xs text-muted-foreground mt-1">Active current sessions</p>
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
          <TabsList className="grid w-full grid-cols-4 mb-8 max-w-xl mx-auto sm:mx-0">
            <TabsTrigger value="log" className="gap-2">
              <BarChart4 className="w-4 h-4" /> Activity Log
            </TabsTrigger>
            <TabsTrigger value="sessions" className="gap-2">
              <Globe className="w-4 h-4" /> Active Sessions
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" /> User Mgmt
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2">
              <BarChart4 className="w-4 h-4" /> AI Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="log" className="space-y-6">
            <div className="flex flex-wrap gap-4 items-center bg-muted/20 p-4 rounded-lg border">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Facility:</span>
                <div className="flex gap-1">
                  {["all", "Library", "Dean's Office"].map((f) => (
                    <button 
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1 text-xs rounded-full border transition-colors ${filter === f ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted"}`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Department:</span>
                <Select value={deptFilter} onValueChange={setDeptFilter}>
                  <SelectTrigger className="w-[160px] h-8 text-xs">
                    <SelectValue placeholder="All Colleges" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Colleges</SelectItem>
                    <SelectItem value="CAS">CAS (Arts & Sciences)</SelectItem>
                    <SelectItem value="CBA">CBA (Business)</SelectItem>
                    <SelectItem value="CCMS">CCMS (CS)</SelectItem>
                    <SelectItem value="CED">CED (Education)</SelectItem>
                    <SelectItem value="COE">COE (Engineering)</SelectItem>
                    <SelectItem value="CON">CON (Nursing)</SelectItem>
                    <SelectItem value="COM">COM (Music)</SelectItem>
                    <SelectItem value="CL">CL (Law)</SelectItem>
                    <SelectItem value="CTHM">CTHM (Tourism)</SelectItem>
                    <SelectItem value="CA">CA (Architecture)</SelectItem>
                    <SelectItem value="CG">CG (Graduate Studies)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Type:</span>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[140px] h-8 text-xs">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Visitors</SelectItem>
                    <SelectItem value="Student">Students Only</SelectItem>
                    <SelectItem value="Employee">Employees Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <VisitorLog visits={filteredVisits} onUpdateStatus={updateVisitStatus} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="sessions">
            <ActiveSessions />
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
