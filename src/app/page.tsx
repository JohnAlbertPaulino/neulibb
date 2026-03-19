"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Mail, ArrowRight, Loader2, LogOut, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockLogin, mockLogout } from "@/lib/auth-mock";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useAuth, useUser } from "@/firebase";
import { signInAnonymously, signOut } from "firebase/auth";

export default function Home() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-campus');

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
      await signInAnonymously(auth);
      mockLogin(email);
      
      toast({
        title: "Login Successful",
        description: `Welcome to PageVoyage!`,
      });
      
      const role = email === 'jcesperanza@neu.edu.ph' ? 'ADMIN' : 'VISITOR';
      router.push(role === 'ADMIN' ? "/dashboard" : "/check-in");
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

  const handleSignOut = async () => {
    await signOut(auth);
    mockLogout();
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 grid lg:grid-cols-2">
        {/* Left Side: Login Form */}
        <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-24 py-12 order-2 lg:order-1 bg-background">
          <div className="max-w-md w-full mx-auto space-y-8">
            <div className="space-y-4">
              <div className="relative w-20 h-20 mb-6">
                <Image 
                  src="https://neu.edu.ph/main/img/neu.png" 
                  alt="NEU Logo" 
                  fill 
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className="text-4xl font-headline font-extrabold tracking-tight text-foreground lg:text-5xl">
                Page<span className="text-primary">Voyage</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Official Visitor Management System of <span className="font-semibold text-foreground">New Era University</span>.
              </p>
            </div>

            <Card className="border-none shadow-2xl bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                  {user ? "Session Active" : "Institutional Access"}
                </CardTitle>
                <CardDescription>
                  {user ? "Manage your campus activities." : "Sign in with your @neu.edu.ph email to proceed."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isUserLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : user ? (
                  <div className="space-y-4">
                    <Button 
                      onClick={() => {
                        const currentUser = JSON.parse(localStorage.getItem('pagevoyage_auth') || '{}');
                        router.push(currentUser.role === 'ADMIN' ? "/dashboard" : "/check-in");
                      }}
                      className="w-full h-12 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg"
                    >
                      Go to Workspace
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <Button variant="ghost" onClick={handleSignOut} className="w-full gap-2 text-muted-foreground hover:text-destructive">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="institutional.email@neu.edu.ph"
                        className="pl-10 h-12 rounded-lg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-12 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg"
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Login to Portal"}
                      {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                    </Button>
                    <div className="mt-6 text-center">
                      <p className="text-xs text-muted-foreground">
                        Use <b>jcesperanza@neu.edu.ph</b> for Administrator access.
                      </p>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
            
            <footer className="pt-8 text-center lg:text-left">
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} New Era University. All rights reserved.
              </p>
            </footer>
          </div>
        </div>

        {/* Right Side: Hero Image and VMGO */}
        <div className="relative hidden lg:flex flex-col justify-end p-12 order-1 lg:order-2 overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          <div className="relative z-10 space-y-8 text-white max-w-lg">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Info className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-widest">Our Foundation</span>
              </div>
              <h2 className="text-4xl font-extrabold font-headline leading-tight">New Era University VMGO</h2>
            </div>

            <div className="grid gap-6">
              <section className="space-y-2">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary" />
                  VISION
                </h3>
                <p className="text-sm leading-relaxed opacity-90 italic">
                  "A world-class Institution of learning with a unique Christian culture of excellence, discipline, and service for humanity."
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary" />
                  MISSION
                </h3>
                <p className="text-sm leading-relaxed opacity-90 italic">
                  "To provide quality education that will develop the students' full potential as God-fearing, responsible, and productive members of the society."
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary" />
                  GOALS & OBJECTIVES
                </h3>
                <ul className="text-xs leading-relaxed opacity-80 list-disc list-inside space-y-1">
                  <li>Academic excellence and spiritual growth</li>
                  <li>Inculcation of Christian values and moral discipline</li>
                  <li>Community service and social responsibility</li>
                  <li>Development of globally competitive skills</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
