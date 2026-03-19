"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Library, Building, CheckCircle2, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser } from "@/lib/auth-mock";
import { useRouter } from "next/navigation";

export default function CheckInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [facility, setFacility] = useState<"Library" | "Dean's Office">("Library");
  const [formData, setFormData] = useState({
    department: "",
    reason: "",
    purposeCategory: "Inquiry",
    studentId: "",
  });

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) router.push("/");
    setUser(u);
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate database write
    const newVisit = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      email: user?.email,
      visitorName: user?.name,
      facility,
      status: "Waiting",
      ...formData,
    };

    // Store in local storage to simulate backend for the dashboard to read
    const visits = JSON.parse(localStorage.getItem('campusflow_visits') || '[]');
    visits.push(newVisit);
    localStorage.setItem('campusflow_visits', JSON.stringify(visits));

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast({
        title: `Welcome to NEU ${facility}!`,
        description: "Your visit has been recorded successfully.",
      });
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-4xl font-headline font-bold text-foreground">Welcome to NEU {facility}!</h1>
          <p className="text-xl text-muted-foreground">
            Thank you for checking in. Your session has been automatically timestamped.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button onClick={() => setSubmitted(false)} variant="outline">New Check-in</Button>
            <Button onClick={() => router.push("/")} className="bg-primary hover:bg-primary/90">Return Home</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-headline font-bold text-foreground">Facility Check-in</h1>
              <p className="text-muted-foreground">Select where you are visiting and fill in the details.</p>
            </div>
            
            <div className="grid gap-4">
              <Button 
                variant={facility === "Library" ? "default" : "outline"}
                className={`h-24 flex flex-col gap-2 rounded-xl transition-all ${facility === "Library" ? "bg-primary shadow-lg border-primary" : "hover:bg-primary/5"}`}
                onClick={() => setFacility("Library")}
              >
                <Library className="w-6 h-6" />
                <span>Library</span>
              </Button>
              <Button 
                variant={facility === "Dean's Office" ? "default" : "outline"}
                className={`h-24 flex flex-col gap-2 rounded-xl transition-all ${facility === "Dean's Office" ? "bg-primary shadow-lg border-primary" : "hover:bg-primary/5"}`}
                onClick={() => setFacility("Dean's Office")}
              >
                <Building className="w-6 h-6" />
                <span>Dean's Office</span>
              </Button>
            </div>
          </div>

          <div className="flex-1">
            <Card className="border shadow-lg">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="flex items-center gap-2">
                  {facility === "Library" ? <Library className="w-5 h-5 text-primary" /> : <Building className="w-5 h-5 text-primary" />}
                  {facility} Form
                </CardTitle>
                <CardDescription>All entries are automatically timestamped for your records.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={user?.name || ""} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="id">Student/Employee ID (Optional)</Label>
                      <Input 
                        id="id" 
                        placeholder="e.g. 2021-0001" 
                        value={formData.studentId}
                        onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dept">College Department</Label>
                    <Select onValueChange={(v) => setFormData({...formData, department: v})} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CAS">College of Arts & Sciences</SelectItem>
                        <SelectItem value="CBA">College of Business & Accountancy</SelectItem>
                        <SelectItem value="CCMS">College of Computer Science</SelectItem>
                        <SelectItem value="CED">College of Education</SelectItem>
                        <SelectItem value="COE">College of Engineering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {facility === "Dean's Office" && (
                    <div className="space-y-2">
                      <Label htmlFor="purpose">Purpose Category</Label>
                      <Select 
                        onValueChange={(v) => setFormData({...formData, purposeCategory: v})}
                        defaultValue="Inquiry"
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inquiry">Inquiry</SelectItem>
                          <SelectItem value="Signature">Signature</SelectItem>
                          <SelectItem value="Meeting">Meeting</SelectItem>
                          <SelectItem value="Others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Visit</Label>
                    <Textarea 
                      id="reason" 
                      placeholder="Briefly describe why you are visiting today..." 
                      className="min-h-[100px]"
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full h-12 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Submit Check-in"}
                    </Button>
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>Current Time: {new Date().toLocaleTimeString()}</span>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}