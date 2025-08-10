import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { insertVoterSchema } from "@shared/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, UserPlus, Info, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ProgressIndicator from "@/components/progress-indicator";
import WalletConnector from "@/components/wallet-connector";
import { useWeb3 } from "@/hooks/use-web3";
import { zkpService } from "@/lib/zkp";
import ZKPInfo from "@/components/zkp-info";

const registrationSchema = insertVoterSchema.extend({
  confirmWalletAddress: z.string().min(1, "Please confirm your wallet address"),
}).refine((data) => data.walletAddress === data.confirmWalletAddress, {
  message: "Wallet addresses don't match",
  path: ["confirmWalletAddress"],
});

type RegistrationForm = z.infer<typeof registrationSchema>;

export default function RegistrationPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { account, isConnected } = useWeb3();
  const [showExistingWalletConnect, setShowExistingWalletConnect] = useState(false);

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      matricNumber: "",
      walletAddress: "",
      confirmWalletAddress: "",
    },
  });

  // Check if voter exists by wallet address
  const checkExistingVoter = async (walletAddress: string) => {
    try {
      const response = await apiRequest("GET", `/api/voters/wallet/${walletAddress}`);
      return await response.json();
    } catch (error: any) {
      if (error.message.includes("404")) {
        return null; // Voter doesn't exist
      }
      throw error;
    }
  };

  const registerMutation = useMutation({
    mutationFn: async (data: RegistrationForm) => {
      const { confirmWalletAddress, ...registrationData } = data;
      
      // Generate ZKP for voter eligibility
      console.log('🔐 Generating Zero-Knowledge Proof for voter eligibility...');
      const zkProof = await zkpService.generateEligibilityProof(
        registrationData.matricNumber,
        registrationData.walletAddress
      );
      
      // Verify proof locally before submission
      const isValidProof = await zkpService.verifyProof(zkProof);
      if (!isValidProof) {
        throw new Error('Zero-Knowledge Proof verification failed');
      }
      
      console.log('✅ ZKP verified - voter eligibility proven without revealing matric number');
      
      const response = await apiRequest("POST", "/api/voters/register", {
        ...registrationData,
        zkProof // Include ZKP in registration
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "You have been successfully registered. Please connect your wallet to continue.",
      });
      setShowExistingWalletConnect(true);
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleWalletConnect = async (walletAddress: string) => {
    try {
      const existingVoter = await checkExistingVoter(walletAddress);
      if (existingVoter) {
        toast({
          title: "Welcome Back!",
          description: `Logged in as ${existingVoter.fullName}`,
        });
        setLocation("/voting");
      } else {
        toast({
          title: "Wallet Not Registered",
          description: "Please register first before connecting your wallet.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: RegistrationForm) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white shadow-md border-b-2 border-primary">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-primary text-2xl">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <h1 className="text-xl font-medium text-secondary">Academic Voting Platform</h1>
            </div>
            {isConnected && account && (
              <div className="flex items-center space-x-2 bg-accent/10 px-3 py-2 rounded-lg">
                <Wallet className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-accent">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <ProgressIndicator currentStep={1} />

      <main className="container mx-auto px-6 py-8">
        {showExistingWalletConnect ? (
          <div className="max-w-md mx-auto">
            <WalletConnector
              title="Connect Your Wallet"
              description="Connect the wallet you just registered to proceed to voting."
              onConnect={handleWalletConnect}
            />
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-8">
            <ZKPInfo />
            
            {/* Registration Form */}
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  <UserPlus className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-2xl font-medium text-secondary">
                  Voter Registration
                </CardTitle>
                <CardDescription>
                  Register to participate in academic elections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your full name" 
                              {...field} 
                              data-testid="input-fullname"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="matricNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Matric Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., 20/1234567" 
                              {...field} 
                              data-testid="input-matricnumber"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="walletAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Wallet Address</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="0x..." 
                              {...field} 
                              data-testid="input-walletaddress"
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-gray-500">
                            Your Web3 wallet address for voting authentication
                          </p>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmWalletAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Wallet Address</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Re-enter your wallet address" 
                              {...field} 
                              data-testid="input-confirm-walletaddress"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        <p className="font-medium mb-1">Privacy Notice</p>
                        <p className="text-sm">
                          Your personal information is stored securely and used only for voting 
                          eligibility verification. Wallet addresses are used for blockchain authentication.
                        </p>
                      </AlertDescription>
                    </Alert>

                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90 text-white"
                      disabled={registerMutation.isPending}
                      data-testid="button-register"
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        "Register & Connect Wallet"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Existing Voter Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium text-secondary">
                  Already Registered?
                </CardTitle>
                <CardDescription>
                  Connect your wallet to automatically log in and proceed to voting.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WalletConnector
                  title="Connect Existing Wallet"
                  description="Connect your registered wallet to continue"
                  onConnect={handleWalletConnect}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
