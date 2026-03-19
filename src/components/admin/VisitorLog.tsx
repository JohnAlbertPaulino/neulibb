"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, User, Clock, CheckCircle, Timer } from "lucide-react";
import { format } from "date-fns";

export default function VisitorLog({ visits, onUpdateStatus }: { visits: any[], onUpdateStatus: (id: string, status: string) => void }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Waiting": return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Waiting</Badge>;
      case "In-Meeting": return <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">In-Meeting</Badge>;
      case "Completed": return <Badge variant="default" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Visitor</TableHead>
            <TableHead>Department</TableHead>
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
              <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                No visitor activity found for the selected range.
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
                      <p className="font-medium">{visit.visitorName}</p>
                      <p className="text-xs text-muted-foreground">{visit.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{visit.department}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">{visit.facility}</Badge>
                </TableCell>
                <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
                  {visit.reason}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    {format(new Date(visit.timestamp), "h:mm a")}
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