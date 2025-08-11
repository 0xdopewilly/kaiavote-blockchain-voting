import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { z } from "zod";
import { Wallet, UserPlus, Loader2, Shield, ArrowLeft } from "lucide-react";
import { insertVoterSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ProgressIndicator from "@/components/progress-indicator";
import WalletConnector from "@/components/wallet-connector";
import { useWeb3 } from "@/hooks/use-web3";
import { zkpService } from "@/lib/zkp";
import ZKPInfo from "@/components/zkp-info";
import GasSavingsBanner from "@/components/gas-savings-banner";

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
        zkProof
      });
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Registration Successful!",
        description: `Welcome ${data.fullName}! Please connect your wallet to proceed.`,
      });
      
      // Pre-fill wallet address for connection
      form.setValue('walletAddress', data.walletAddress);
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
          description: "This wallet needs to be registered first.",
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
    <div className="min-h-screen p-2 sm:p-4 relative">
      <div className="container mx-auto max-w-full px-2 sm:px-4">
        {/* Home Button - Top Left */}
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-50">
          <Link href="/">
            <Button
              variant="outline"
              className="cyber-button bg-primary/10 hover:bg-primary/20 border-primary/30 hover:border-primary/60 backdrop-blur-sm text-xs sm:text-sm"
              data-testid="button-home"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-primary" />
              <span className="text-white font-medium">Home</span>
            </Button>
          </Link>
        </div>
        {/* Hero Section with Beautiful Title */}
        <div className="text-center mb-6 sm:mb-8 relative mt-12 sm:mt-8">
          <div className="inline-block relative">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3 sm:mb-4 tracking-wider" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 25%, #c7d2fe 50%, #a78bfa 75%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 30px rgba(255, 255, 255, 0.5)'
            }}>
              CRYPTOVOTE
            </h1>
            <div className="absolute -inset-6 bg-gradient-to-r from-transparent via-primary/30 to-transparent blur-2xl"></div>
          </div>
          <div className="space-y-2 sm:space-y-3 px-2">
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold neon-text tracking-wide">
              Academic Blockchain Democracy
            </p>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-foreground font-medium">
              🔒 Secure • 🎭 Anonymous • 🌟 Transparent • ⛓️ Immutable
            </p>
          </div>
          
          {/* Enhanced floating elements */}
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-accent/20 rounded-full blur-2xl animate-pulse delay-700"></div>
        </div>

        <ProgressIndicator currentStep={1} />

        <div className="max-w-2xl mx-auto space-y-4 sm:space-y-8">
          {/* Side by side banners */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <GasSavingsBanner />
            <ZKPInfo />
          </div>
          
          {/* Registration Form */}
          <div className="futuristic-card p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <UserPlus className="h-6 w-6 text-primary" />
                <div className="absolute -inset-1 bg-primary/20 rounded-full blur animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Voter Registration</h2>
                <p className="text-muted-foreground">Secure your identity with Zero-Knowledge Proof</p>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your full name" 
                          {...field} 
                          className="cyber-input h-12 text-lg"
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
                      <FormLabel className="text-foreground font-medium">Matric Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="CSC/2012/001" 
                          {...field} 
                          className="cyber-input h-12 text-lg font-mono"
                          data-testid="input-matricnumber"
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground">
                        Only Computer Science Department (CSC) students are eligible. Format: CSC/YYYY/XXX
                      </p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="walletAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Wallet Address</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="0x..." 
                          {...field} 
                          className="cyber-input h-12 text-lg font-mono"
                          data-testid="input-walletaddress"
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground">
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
                      <FormLabel className="text-foreground font-medium">Confirm Wallet Address</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="0x..." 
                          {...field} 
                          className="cyber-input h-12 text-lg font-mono"
                          data-testid="input-confirmwalletaddress"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg cyber-button" 
                  disabled={registerMutation.isPending}
                  data-testid="button-register"
                >
                  {registerMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating ZK Proof...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-5 w-5" />
                      Register to Vote
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>

          {/* Primary Wallet Connection */}
          <WalletConnector
            title="Connect Your Wallet" 
            description="Connect MetaMask to securely register and vote on the blockchain"
            onConnect={handleWalletConnect}
          />
        </div>
      </div>
      
      {/* ZKP Info Button - Bottom Right */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          className="cyber-button bg-primary/10 hover:bg-primary/20 border-primary/30 hover:border-primary/60 backdrop-blur-sm px-3 py-2 h-auto"
          onClick={() => document.querySelector('[data-testid="button-zkp-info"]')?.click()}
          data-testid="floating-zkp-info-small"
        >
          <Shield className="h-4 w-4 text-primary mr-2" />
          <span className="text-xs text-white font-medium">ZKP Info</span>
        </Button>
        <div className="absolute -inset-1 bg-primary/10 rounded-lg blur animate-pulse pointer-events-none"></div>
      </div>

    </div>
  );
}