
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, User, Clock, CheckCircle, Timer, GraduationCap, Briefcase, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function VisitorLog({ visits, onUpdateStatus, isLoading }: { visits: any[], onUpdateStatus: (id: string, status: string) => void, isLoading?: boolean }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Waiting": return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Waiting</Badge>;
      case "In-Meeting": return <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">In-Meeting</Badge>;
      case "Completed": return <Badge variant="default" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getVisitorIcon = (type: string) => {
    if (type === "Student") return <GraduationCap className="w-3 h-3 text-primary" />;
    return <Briefcase className="w-3 h-3 text-accent" />;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-card gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Syncing visitor logs...</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Visitor</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>College</TableHead>
            <TableHead>Facility</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Time In</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visits.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                No visitor activity found for the selected filters.
              </TableCell>
            </TableRow>
          ) : (
            visits.map((visit) => (
              <TableRow key={visit.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-xs sm:text-sm">{visit.visitorName}</p>
                      <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">{visit.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    {getVisitorIcon(visit.visitorType)}
                    {visit.visitorType}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0">
                    {visit.department}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal text-[10px]">{visit.facility}</Badge>
                </TableCell>
                <TableCell className="max-w-[150px] truncate text-[11px] text-muted-foreground">
                  {visit.reasonForVisit}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    {visit.checkInTime?.toDate ? format(visit.checkInTime.toDate(), "h:mm a") : 'Just now'}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(visit.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onUpdateStatus(visit.id, "Waiting")}>
                        <Timer className="mr-2 h-4 w-4" /> Set Waiting
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateStatus(visit.id, "In-Meeting")}>
                        <Clock className="mr-2 h-4 w-4" /> Set In-Meeting
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateStatus(visit.id, "Completed")}>
                        <CheckCircle className="mr-2 h-4 w-4" /> Set Completed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
