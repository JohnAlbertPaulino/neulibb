"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserX, UserCheck, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  // Mock users
  const [users, setUsers] = useState([
    { id: "1", name: "Alice Thompson", email: "alice.thompson@neu.edu.ph", role: "VISITOR", isBlocked: false },
    { id: "2", name: "Bob Wilson", email: "bob.wilson@neu.edu.ph", role: "VISITOR", isBlocked: true },
    { id: "3", name: "Charlie Davis", email: "charlie.davis@neu.edu.ph", role: "VISITOR", isBlocked: false },
    { id: "4", name: "Admin One", email: "admin@neu.edu.ph", role: "ADMIN", isBlocked: false },
  ]);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleBlock = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, isBlocked: !u.isBlocked } : u));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-headline font-bold">User Management</h2>
          <p className="text-muted-foreground">Monitor and manage institutional accounts.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name or email..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">No users found.</TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className={user.isBlocked ? "bg-red-50/30" : ""}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    {user.isBlocked ? (
                      <Badge variant="destructive" className="gap-1">
                        <ShieldAlert className="w-3 h-3" /> Blocked
                      </Badge>
                    ) : (
                      <Badge variant="default" className="bg-green-600">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {user.role !== 'ADMIN' && (
                      <Button 
                        variant={user.isBlocked ? "outline" : "destructive"} 
                        size="sm"
                        onClick={() => toggleBlock(user.id)}
                        className="gap-2"
                      >
                        {user.isBlocked ? (
                          <>
                            <UserCheck className="w-4 h-4" /> Unblock
                          </>
                        ) : (
                          <>
                            <UserX className="w-4 h-4" /> Block User
                          </>
                        )}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}