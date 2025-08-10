import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { Wallet, UserPlus } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto">
        <ProgressIndicator currentStep={1} />
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Student Registration</h1>
          <p className="text-lg text-gray-600">
            Register to participate in academic elections with blockchain security
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-8">
          <GasSavingsBanner />
          
          {/* Wallet Connection Section for Existing Users */}
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <Wallet className="h-5 w-5" />
                <span>Already Registered?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-700 mb-4">
                If you've registered before, connect your wallet to continue voting.
              </p>
              <WalletConnector
                title="Connect Registered Wallet" 
                description="Connect your wallet to restore your session and proceed to voting."
                onConnect={handleWalletConnect}
              />
            </CardContent>
          </Card>
          
          <ZKPInfo />

          {/* Registration Form for New Users */}
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <UserPlus className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl font-medium">
                New Voter Registration
              </CardTitle>
              <CardDescription>
                Complete your details to register for academic elections
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
                            placeholder="Confirm your wallet address" 
                            {...field} 
                            data-testid="input-confirmwalletaddress"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={registerMutation.isPending}
                    data-testid="button-register"
                  >
                    {registerMutation.isPending ? "Registering..." : "Register Voter"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}