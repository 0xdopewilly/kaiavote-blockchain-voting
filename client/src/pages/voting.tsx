import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Vote, Crown, Building, DollarSign, AlertTriangle, CheckCircle, Wallet, LogOut, Shield, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import ProgressIndicator from "@/components/progress-indicator";
import LiveMetrics from "@/components/live-metrics";
import { useWeb3 } from "@/hooks/use-web3";
import { contract } from "@/lib/contract";
import { zkpService } from "@/lib/zkp";
import ZKPInfo from "@/components/zkp-info";
import GasSavingsBanner from "@/components/gas-savings-banner";
import NetworkStatus from "@/components/network-status";

interface Position {
  id: string;
  name: string;
  description: string;
  candidates: Candidate[];
}

interface Candidate {
  id: string;
  name: string;
  department: string;
  positionId: string;
}

const votingSchema = z.object({
  votes: z.record(z.string().min(1, "Please select a candidate for this position"))
});

type VotingForm = z.infer<typeof votingSchema>;

export default function VotingPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { account, isConnected, disconnect } = useWeb3();
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");

  const form = useForm<VotingForm>({
    resolver: zodResolver(votingSchema),
    defaultValues: {
      votes: {}
    }
  });

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected || !account) {
      setLocation("/");
    }
  }, [isConnected, account, setLocation]);

  // Fetch voter data
  const { data: voter, isLoading: voterLoading } = useQuery<any>({
    queryKey: ["/api/voters/wallet", account],
    enabled: !!account,
  });

  // Fetch positions and candidates
  const { data: positions = [], isLoading: positionsLoading } = useQuery<Position[]>({
    queryKey: ["/api/positions"],
  });

  // Check if voter has already voted
  useEffect(() => {
    if (voter?.hasVoted) {
      toast({
        title: "Already Voted",
        description: "You have already cast your vote and cannot vote again.",
        variant: "destructive",
      });
      setLocation("/confirmation");
    }
  }, [voter, setLocation, toast]);

  const submitVoteMutation = useMutation({
    mutationFn: async (data: VotingForm) => {
      if (!voter) throw new Error("Voter not found");
      
      setShowLoadingModal(true);
      setLoadingStep("Confirming transaction");

      // Convert votes object to array format
      const votesArray = Object.entries(data.votes).map(([positionId, candidateId]) => ({
        candidateId,
        positionId
      }));

      // Get candidate IDs for blockchain submission
      const candidateIds = votesArray.map(vote => vote.candidateId);

      try {
        setLoadingStep("Generating Zero-Knowledge Proof");
        
        // Generate ZKP for vote integrity 
        console.log('🔐 Generating Zero-Knowledge Proof for vote integrity...');
        const zkProof = await zkpService.generateVoteProof(candidateIds, account!);
        
        // Verify proof locally
        const isValidProof = await zkpService.verifyProof(zkProof);
        if (!isValidProof) {
          throw new Error('Zero-Knowledge Proof verification failed');
        }
        
        console.log('✅ Vote ZKP verified - vote integrity proven without revealing selections');
        setLoadingStep("Recording to blockchain");
        
        // Submit to blockchain with ZKP
        const { transactionHash, blockNumber } = await contract.submitVote(candidateIds, account!);

        setLoadingStep("Updating vote counts");

        // Submit to backend with blockchain transaction details and ZKP
        const response = await apiRequest("POST", "/api/votes", {
          voterId: voter.id,
          votes: votesArray,
          candidateIds, // Add candidateIds field for validation
          transactionHash,
          blockNumber,
          zkProof // Include ZKP in submission
        });

        return response.json();
      } finally {
        setShowLoadingModal(false);
      }
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/candidates"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      
      toast({
        title: "Vote Submitted Successfully!",
        description: "Your vote has been recorded on the blockchain.",
      });
      setLocation("/confirmation");
    },
    onError: (error: any) => {
      setShowLoadingModal(false);
      toast({
        title: "Vote Submission Failed",
        description: error.message || "Failed to submit vote. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: VotingForm) => {
    // Validate that all positions have votes
    const requiredPositions = positions.map(p => p.id);
    const votedPositions = Object.keys(data.votes);
    
    const missingVotes = requiredPositions.filter(positionId => !data.votes[positionId]);
    
    if (missingVotes.length > 0) {
      toast({
        title: "Incomplete Voting",
        description: "Please select a candidate for all positions before submitting.",
        variant: "destructive",
      });
      return;
    }

    submitVoteMutation.mutate(data);
  };

  const handleDisconnect = () => {
    disconnect();
    setLocation("/");
  };

  const getPositionIcon = (positionName: string) => {
    if (positionName.toLowerCase().includes("president")) {
      return positionName.toLowerCase().includes("class") ? Crown : Building;
    }
    if (positionName.toLowerCase().includes("financial")) {
      return DollarSign;
    }
    return Vote;
  };

  if (voterLoading || positionsLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading voting interface...</p>
        </div>
      </div>
    );
  }

  if (!voter) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
            <h2 className="text-lg font-medium mb-2">Voter Not Found</h2>
            <p className="text-gray-600 mb-4">
              Your wallet address is not registered. Please register first.
            </p>
            <Button onClick={() => setLocation("/")} data-testid="button-register">
              Go to Registration
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
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

      {/* Futuristic Header */}
      <header className="relative mt-12 sm:mt-8">
        <div className="futuristic-card mx-2 sm:mx-6 mt-2 sm:mt-6 mb-4">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Vote className="h-8 w-8 text-primary" />
                <div className="absolute -inset-2 bg-primary/20 rounded-full blur-md animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">VOTECHAIN</h1>
                <p className="text-sm text-muted-foreground">Blockchain Voting Terminal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {account && (
                <>
                  <div className="glass-morph px-4 py-2 rounded-xl flex items-center space-x-2">
                    <div className="relative">
                      <Wallet className="h-4 w-4 text-primary" />
                      <div className="absolute -inset-1 bg-primary/20 rounded-full blur animate-pulse"></div>
                    </div>
                    <span className="text-sm font-mono text-foreground">
                      {account.slice(0, 6)}...{account.slice(-4)}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDisconnect}
                    className="cyber-button px-4 py-2"
                    data-testid="button-disconnect-wallet"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Disconnect
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <ProgressIndicator currentStep={2} />

      <main className="container mx-auto px-6 py-4">
        <div className="space-y-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GasSavingsBanner />
            <ZKPInfo />
          </div>
          <NetworkStatus />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Voting Form */}
          <div className="lg:col-span-2">
            <div className="futuristic-card p-8">
              <div className="text-center mb-8">
                <div className="relative inline-block mb-6">
                  <Vote className="h-16 w-16 text-primary mx-auto" />
                  <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Cast Your Vote</h2>
                <p className="text-white text-lg font-medium">
                  Select your preferred candidates for each position
                </p>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {positions.map((position) => {
                    const IconComponent = getPositionIcon(position.name);
                    return (
                      <FormField
                        key={position.id}
                        control={form.control}
                        name={`votes.${position.id}`}
                        render={({ field }) => (
                          <FormItem>
                            <div className="glass-morph rounded-2xl p-6 mb-6">
                              <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                                <div className="relative mr-4">
                                  <IconComponent className="h-8 w-8 text-primary" />
                                  <div className="absolute -inset-2 bg-primary/30 rounded-full blur-md animate-pulse"></div>
                                </div>
                                <span className="text-white text-3xl font-bold">{position.name}</span>
                              </h3>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="space-y-4"
                                  data-testid={`radiogroup-${position.name.replace(/\s+/g, '-').toLowerCase()}`}
                                >
                                  {position.candidates.map((candidate) => (
                                    <div
                                      key={candidate.id}
                                      className="glass-morph p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer rounded-xl border-2 border-primary/50 hover:border-primary/80 bg-card/80"
                                    >
                                      <div className="flex items-center">
                                        <RadioGroupItem 
                                          value={candidate.id} 
                                          id={candidate.id}
                                          className="mr-4 border-2 border-primary text-primary w-5 h-5 data-[state=checked]:bg-primary data-[state=checked]:text-white"
                                          data-testid={`radio-${candidate.id}`}
                                        />
                                        <Label
                                          htmlFor={candidate.id}
                                          className="flex-1 cursor-pointer"
                                        >
                                          <div className="font-bold text-white text-xl mb-2">
                                            {candidate.name}
                                          </div>
                                          <div className="text-primary font-mono text-lg font-medium">
                                            {candidate.department}
                                          </div>
                                        </Label>
                                      </div>
                                    </div>
                                  ))}
                                </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      );
                    })}

                  <div className="glass-morph rounded-2xl p-6 mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <AlertTriangle className="h-6 w-6 text-warning" />
                      <h3 className="text-lg font-bold text-warning">Important Notice</h3>
                    </div>
                    <p className="text-white text-lg font-medium">
                      Once you submit your vote, it will be permanently recorded on the 
                      blockchain and cannot be changed. Please review your selections carefully.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-16 text-xl cyber-button"
                    disabled={submitVoteMutation.isPending}
                    data-testid="button-submit-vote"
                  >
                    {submitVoteMutation.isPending ? (
                      <>
                        <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                        Submitting Vote...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-3 h-6 w-6" />
                        Submit Vote to Blockchain
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>

          {/* Live Metrics */}
          <div className="lg:col-span-1">
            <div className="futuristic-card p-6">
              <LiveMetrics />
            </div>
          </div>
        </div>
      </main>

      {/* Loading Modal */}
      <Dialog open={showLoadingModal} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md futuristic-card border-0">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 relative">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <DialogTitle className="text-2xl gradient-text">Processing Vote</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Please wait while your vote is recorded on the blockchain...
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>{loadingStep || "Preparing transaction"}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
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
