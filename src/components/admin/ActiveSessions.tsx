"use client";

import { useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy, limit } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, Smartphone, Globe, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { useFirestore } from "@/firebase";

export default function ActiveSessions() {
  const db = useFirestore();

  const sessionsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, "user_sessions"),
      where("isActive", "==", true),
      orderBy("loginTime", "desc"),
      limit(100)
    );
  }, [db]);

  const { data: sessions, isLoading } = useCollection(sessionsQuery);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse h-32 bg-muted/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-headline font-bold">Live Active Sessions</h2>
          <p className="text-muted-foreground text-sm">Real-time monitoring of currently logged-in users.</p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1.5 py-1 px-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          {sessions?.length || 0} Online
        </Badge>
      </div>

      {sessions?.length === 0 ? (
        <Card className="border-dashed border-2 p-12 text-center bg-muted/5">
          <CardContent className="space-y-2">
            <Globe className="w-12 h-12 text-muted-foreground/30 mx-auto" />
            <h3 className="font-medium">No active sessions</h3>
            <p className="text-sm text-muted-foreground">All users are currently offline.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions?.map((session) => (
            <Card key={session.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2 space-y-0">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold truncate max-w-[150px]">{session.email}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{session.userId.substring(0, 8)}...</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-800">LIVE</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-2 text-xs space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Logged in {session.loginTime?.toDate ? format(session.loginTime.toDate(), "h:mm a") : 'Just now'}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  {session.email?.includes('admin') ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
                  <span>{session.email?.includes('admin') ? 'Admin Terminal' : 'Mobile Access'}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}