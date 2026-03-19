"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, UserCheck, ShieldAlert } from "lucide-react";
import { getCurrentUser, mockLogout } from "@/lib/auth-mock";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    mockLogout();
    router.push("/");
  };

  return (
    <nav className="border-b bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl">
              C
            </div>
            <Link href="/" className="font-headline font-bold text-xl tracking-tight text-primary">
              Campus<span className="text-foreground">Flow</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                {user.role === 'ADMIN' && (
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      <span className="hidden sm:inline">Dashboard</span>
                    </Button>
                  </Link>
                )}
                <Link href="/check-in">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <UserCheck className="w-4 h-4" />
                    <span className="hidden sm:inline">Check-in</span>
                  </Button>
                </Link>
                <div className="h-6 w-px bg-border mx-2" />
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                  </div>
                  <Button variant="outline" size="icon" onClick={handleLogout} className="rounded-full">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <Link href="/">
                <Button variant="default" className="bg-primary hover:bg-primary/90">
                  Institutional Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}