import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, Link } from "wouter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Shield, Eye, EyeOff, ArrowLeft, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/page-header";

const adminLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type AdminLoginForm = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: AdminLoginForm) => {
    setIsLoading(true);
    
    // Simple admin authentication - in production, use proper authentication
    if (data.username === "admin" && data.password === "cryptovote2025") {
      // Store admin session
      localStorage.setItem("adminAuthenticated", "true");
      localStorage.setItem("adminLoginTime", Date.now().toString());
      
      toast({
        title: "Login Successful",
        description: "Welcome to the CryptoVote Admin Dashboard",
      });
      
      setLocation("/admin-dashboard");
    } else {
      toast({
        title: "Login Failed", 
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen p-2 sm:p-4 relative">
      {/* Page Header */}
      <PageHeader showHomeButton={true} />
      
      <div className="container mx-auto max-w-full px-2 sm:px-4 pt-16">

        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8 relative mt-12 sm:mt-8">
          <div className="inline-block relative">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 sm:mb-4 tracking-wider" style={{
              background: 'linear-gradient(135deg, #ffeb3b 0%, #fdd835 25%, #f9a825 50%, #f57f17 75%, #ffeb3b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 30px rgba(255, 235, 59, 0.5)'
            }}>
              CryptoVote
            </h1>
            <div className="absolute -inset-6 bg-gradient-to-r from-transparent via-primary/30 to-transparent blur-2xl"></div>
          </div>
          <div className="space-y-2 px-2">
            <p className="text-lg sm:text-xl md:text-2xl font-semibold neon-text tracking-wide flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              Admin Dashboard Login
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="max-w-md mx-auto">
          <Card className="glass-morph border-primary/30 shadow-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold gradient-text">
                Administrator Access
              </CardTitle>
              <CardDescription className="text-white/80">
                Enter your admin credentials to access the dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Username</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter admin username"
                            className="cyber-input text-white"
                            data-testid="input-admin-username"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter admin password"
                              className="cyber-input text-white pr-12"
                              data-testid="input-admin-password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full reference-main-button"
                    data-testid="button-admin-login"
                  >
                    {isLoading ? "Logging in..." : "Access Dashboard"}
                    <Shield className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm text-white/80 font-medium mb-2">Demo Credentials:</p>
                <p className="text-xs text-white/70">Username: admin</p>
                <p className="text-xs text-white/70">Password: cryptovote2025</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced floating elements */}
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-primary/10 rounded-full blur-lg animate-pulse delay-500"></div>
      </div>
    </div>
  );
}