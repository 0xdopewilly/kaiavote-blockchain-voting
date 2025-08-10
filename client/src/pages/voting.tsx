import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Vote, Crown, Building, DollarSign, AlertTriangle, CheckCircle, Wallet, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import ProgressIndicator from "@/components/progress-indicator";
import LiveMetrics from "@/components/live-metrics";
import { useWeb3 } from "@/hooks/use-web3";
import { contract } from "@/lib/contract";
import { zkpService } from "@/lib/zkp";
import ZKPInfo from "@/components/zkp-info";

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
            <div className="flex items-center space-x-4">
              {account && (
                <>
                  <div className="flex items-center space-x-2 bg-accent/10 px-3 py-2 rounded-lg">
                    <Wallet className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium text-accent">
                      {account.slice(0, 6)}...{account.slice(-4)}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDisconnect}
                    className="text-warning border-warning hover:bg-warning hover:text-white"
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

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-3 mb-6">
            <ZKPInfo />
          </div>
          
          {/* Voting Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  <Vote className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-2xl font-medium text-secondary">
                  Cast Your Vote
                </CardTitle>
                <CardDescription>
                  Select your preferred candidates for each position
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                              <div className="border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-medium text-secondary mb-4 flex items-center">
                                  <IconComponent className="mr-2 h-5 w-5 text-warning" />
                                  {position.name}
                                </h3>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="space-y-3"
                                    data-testid={`radiogroup-${position.name.replace(/\s+/g, '-').toLowerCase()}`}
                                  >
                                    {position.candidates.map((candidate) => (
                                      <div
                                        key={candidate.id}
                                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                      >
                                        <RadioGroupItem 
                                          value={candidate.id} 
                                          id={candidate.id}
                                          className="mr-4"
                                          data-testid={`radio-${candidate.id}`}
                                        />
                                        <Label
                                          htmlFor={candidate.id}
                                          className="flex-1 cursor-pointer"
                                        >
                                          <div className="font-medium text-gray-900">
                                            {candidate.name}
                                          </div>
                                          <div className="text-sm text-gray-600">
                                            {candidate.department}
                                          </div>
                                        </Label>
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

                    <Alert className="border-amber-200 bg-amber-50">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800">
                        <p className="font-medium mb-1">Important</p>
                        <p>
                          Once you submit your vote, it will be permanently recorded on the 
                          blockchain and cannot be changed.
                        </p>
                      </AlertDescription>
                    </Alert>

                    <Button
                      type="submit"
                      className="w-full bg-accent hover:bg-accent/90 text-white py-4 text-lg"
                      disabled={submitVoteMutation.isPending}
                      data-testid="button-submit-vote"
                    >
                      {submitVoteMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Submitting Vote...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-5 w-5" />
                          Submit Vote to Blockchain
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Live Metrics */}
          <div className="lg:col-span-1">
            <LiveMetrics />
          </div>
        </div>
      </main>

      {/* Loading Modal */}
      <Dialog open={showLoadingModal} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
            <DialogTitle>Processing Vote</DialogTitle>
            <DialogDescription>
              Please wait while your vote is recorded on the blockchain...
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>{loadingStep || "Preparing transaction"}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
