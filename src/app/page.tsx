
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Mail, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockLogin } from "@/lib/auth-mock";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useAuth, useUser } from "@/firebase";
import { signInAnonymously, updateEmail } from "firebase/auth";

export default function Home() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-campus');

  useEffect(() => {
    if (!isUserLoading && user) {
      const role = user.email?.startsWith('admin') ? 'ADMIN' : 'VISITOR';
      router.push(role === 'ADMIN' ? "/dashboard" : "/check-in");
    }
  }, [user, isUserLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith('@neu.edu.ph')) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Please use your institutional @neu.edu.ph email address.",
      });
      return;
    }

    setLoading(true);
    try {
      // For demo purposes, we use anonymous sign-in and link the email
      const cred = await signInAnonymously(auth);
      // Mocking the user profile in our mock system too for role consistency
      mockLogin(email);
      
      toast({
        title: "Login Successful",
        description: `Welcome to CampusFlow!`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 grid lg:grid-cols-2">
        <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-24 py-12 order-2 lg:order-1">
          <div className="max-w-md w-full mx-auto space-y-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-lg">
                C
              </div>
              <h1 className="text-4xl font-headline font-extrabold tracking-tight text-foreground lg:text-5xl">
                Campus<span className="text-primary">Flow</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Institutional Visitor Management & Appointment Tracking for modern campuses.
              </p>
            </div>

            <Card className="border-none shadow-xl bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Institutional Access
                </CardTitle>
                <CardDescription>
                  Sign in with your @neu.edu.ph email to proceed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="student.name@neu.edu.ph"
                      className="pl-10 h-12 rounded-lg"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg"
                    disabled={loading || isUserLoading}
                  >
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Login with Google"}
                    {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                  </Button>
                </form>
                <div className="mt-6 text-center">
                  <p className="text-xs text-muted-foreground">
                    Try <b>admin@neu.edu.ph</b> for Admin Dashboard <br/> or <b>visitor@neu.edu.ph</b> for Check-in.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="relative hidden lg:block order-1 lg:order-2">
          {heroImg && (
            <Image
              src={heroImg.imageUrl}
              alt={heroImg.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImg.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <h2 className="text-3xl font-bold font-headline drop-shadow-md">Modern, Professional, Academic.</h2>
            <p className="text-lg opacity-90 drop-shadow-md">Unified visitor self-service portal for Library and Dean's Office.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
