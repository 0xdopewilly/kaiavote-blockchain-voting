import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Users, 
  Vote, 
  TrendingUp, 
  Shield, 
  LogOut, 
  ArrowLeft, 
  Crown, 
  Building, 
  DollarSign,
  RefreshCw,
  Calendar,
  Wallet,
  Upload,
  Trash2,
  UserCheck,
  FileSpreadsheet
} from "lucide-react";
import PageHeader from "@/components/page-header";

interface Voter {
  id: string;
  fullName: string;
  matricNumber: string;
  department: string;
  walletAddress: string;
  createdAt: string;
}

interface VoteRecord {
  id: string;
  voter: {
    fullName: string;
    matricNumber: string;
  };
  candidate: {
    name: string;
    department: string;
  };
  position: {
    name: string;
  };
  transactionHash: string;
  createdAt: string;
}

interface Stats {
  totalVotes: string;
  eligibleVoters: string;
  turnoutPercentage: string;
}

interface EligibleVoter {
  id: string;
  matricNumber: string;
  department: string;
  level?: string;
  uploadedBy: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [, setLocation] = useLocation();
  const [refreshKey, setRefreshKey] = useState(0);
  const [uploadText, setUploadText] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check admin authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    const loginTime = localStorage.getItem("adminLoginTime");
    
    if (!isAuthenticated || !loginTime) {
      setLocation("/admin-login");
      return;
    }
    
    // Check if session is expired (24 hours)
    const now = Date.now();
    const loginTimestamp = parseInt(loginTime);
    const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
    
    if (now - loginTimestamp > sessionDuration) {
      localStorage.removeItem("adminAuthenticated");
      localStorage.removeItem("adminLoginTime");
      setLocation("/admin-login");
    }
  }, [setLocation]);

  // Fetch voters
  const { data: voters, refetch: refetchVoters } = useQuery<Voter[]>({
    queryKey: ["/api/admin/voters"],
    refetchInterval: 2000, // Refresh every 2 seconds
  });

  // Fetch votes
  const { data: votes, refetch: refetchVotes } = useQuery<VoteRecord[]>({
    queryKey: ["/api/admin/votes"],
    refetchInterval: 2000,
  });

  // Fetch stats
  const { data: stats, refetch: refetchStats } = useQuery<Stats>({
    queryKey: ["/api/stats"],
    refetchInterval: 2000,
  });

  // Fetch eligible voters
  const { data: eligibleVoters, refetch: refetchEligibleVoters } = useQuery<EligibleVoter[]>({
    queryKey: ["/api/admin/eligible-voters"],
    refetchInterval: 2000,
  });

  // Upload eligible voters mutation
  const uploadEligibleVotersMutation = useMutation({
    mutationFn: async (data: { voters: any[], clearExisting: boolean }) => {
      const response = await fetch("/api/admin/eligible-voters/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload eligible voters");
      }
      return await response.json();
    },
    onSuccess: (response) => {
      toast({
        title: "Success",
        description: response.message,
      });
      setUploadText("");
      // Force refresh all data
      queryClient.invalidateQueries({ queryKey: ["/api/admin/eligible-voters"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/voters"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/votes"] });
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload eligible voters",
        variant: "destructive",
      });
    },
  });

  // Clear eligible voters mutation
  const clearEligibleVotersMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/eligible-voters", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to clear eligible voters");
      }
      return await response.json();
    },
    onSuccess: (response) => {
      toast({
        title: "Success",
        description: response.message,
      });
      // Force refresh all data
      queryClient.invalidateQueries({ queryKey: ["/api/admin/eligible-voters"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/voters"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/votes"] });
    },
    onError: (error: any) => {
      toast({
        title: "Clear Failed",
        description: error.message || "Failed to clear eligible voters",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminLoginTime");
    setLocation("/admin-login");
  };

  const handleRefresh = () => {
    // Force refresh all queries
    queryClient.invalidateQueries({ queryKey: ["/api/admin/voters"] });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/votes"] });
    queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/eligible-voters"] });
  };

  const handleUploadEligibleVoters = () => {
    if (!uploadText.trim()) {
      toast({
        title: "No Data",
        description: "Please enter voter data to upload",
        variant: "destructive",
      });
      return;
    }

    try {
      const lines = uploadText.trim().split('\n').filter(line => line.trim());
      const voters = lines.map(line => {
        const parts = line.split(',').map(part => part.trim());
        if (parts.length < 2) {
          throw new Error(`Invalid line format: ${line}. Expected: matricNumber,department[,level]`);
        }
        return {
          matricNumber: parts[0].toUpperCase(),
          department: parts[1],
          level: parts[2] || undefined,
        };
      });

      uploadEligibleVotersMutation.mutate({
        voters,
        clearExisting: true,
      });
    } catch (error: any) {
      toast({
        title: "Invalid Format",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleClearEligibleVoters = () => {
    if (window.confirm("Are you sure you want to clear all eligible voters? This action cannot be undone.")) {
      clearEligibleVotersMutation.mutate();
    }
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

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  return (
    <div className="min-h-screen p-2 sm:p-4 relative">
      {/* Page Header */}
      <PageHeader showHomeButton={true} />
      
      <div className="container mx-auto max-w-full px-2 sm:px-4 pt-16">
        {/* Admin Controls */}
        <div className="flex justify-end items-center mb-6">
          <div className="flex gap-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="cyber-button bg-accent/10 hover:bg-accent/20 border-accent/30 hover:border-accent/60 backdrop-blur-sm text-xs sm:text-sm"
              data-testid="button-refresh"
            >
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="text-white font-medium">Refresh</span>
            </Button>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="cyber-button bg-destructive/10 hover:bg-destructive/20 border-destructive/30 hover:border-destructive/60 backdrop-blur-sm text-xs sm:text-sm"
              data-testid="button-logout"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-destructive" />
              <span className="text-white font-medium">Logout</span>
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 tracking-wider" style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 25%, #c7d2fe 50%, #a78bfa 75%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 30px rgba(255, 255, 255, 0.5)'
          }}>
            CryptoVote Admin Dashboard
          </h1>
          <p className="text-white/80 flex items-center justify-center gap-2">
            <Shield className="h-4 w-4" />
            Real-time voting system monitoring
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="glass-morph border-primary/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Registered Voters</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.eligibleVoters || "0"}</div>
              <p className="text-xs text-white/60">CSC students registered</p>
            </CardContent>
          </Card>

          <Card className="glass-morph border-accent/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Votes Cast</CardTitle>
              <Vote className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.totalVotes || "0"}</div>
              <p className="text-xs text-white/60">Votes recorded on blockchain</p>
            </CardContent>
          </Card>

          <Card className="glass-morph border-green-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Turnout Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.turnoutPercentage || "0"}%</div>
              <p className="text-xs text-white/60">Voter participation</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Registered Voters */}
          <Card className="glass-morph border-primary/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Registered Voters
              </CardTitle>
              <CardDescription className="text-white/70">
                All registered CSC students with wallet addresses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {voters?.map((voter) => (
                    <div key={voter.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-white">{voter.fullName}</p>
                          <p className="text-sm text-primary font-mono">{voter.matricNumber}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {voter.department}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-white/60">
                        <Wallet className="h-3 w-3" />
                        <span className="font-mono">
                          {voter.walletAddress.slice(0, 6)}...{voter.walletAddress.slice(-4)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-white/50 mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatTimestamp(voter.createdAt)}</span>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-white/60">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No voters registered yet</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Recent Votes */}
          <Card className="glass-morph border-accent/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Vote className="h-5 w-5 text-accent" />
                Recent Votes
              </CardTitle>
              <CardDescription className="text-white/70">
                Latest voting activity with blockchain verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {votes?.map((vote) => {
                    const PositionIcon = getPositionIcon(vote.position.name);
                    return (
                      <div key={vote.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <PositionIcon className="h-4 w-4 text-accent" />
                            <div>
                              <p className="text-sm font-medium text-white">{vote.position.name}</p>
                              <p className="text-xs text-accent">{vote.candidate.name}</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {vote.candidate.department}
                          </Badge>
                        </div>
                        <Separator className="my-2 bg-white/10" />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-white/60">
                            <span>Voter: {vote.voter.fullName}</span>
                            <span className="font-mono">({vote.voter.matricNumber})</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-white/50">
                            <span className="font-mono">TX: {vote.transactionHash.slice(0, 10)}...</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-white/50">
                            <Calendar className="h-3 w-3" />
                            <span>{formatTimestamp(vote.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }) || (
                    <div className="text-center py-8 text-white/60">
                      <Vote className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No votes cast yet</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Eligible Voters Management */}
        <div className="mt-8">
          <Card className="glass-morph border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-yellow-400" />
                Eligible Voters Management
              </CardTitle>
              <CardDescription className="text-white/70">
                Manage the list of students eligible to vote
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <FileSpreadsheet className="h-4 w-4 text-yellow-400" />
                  <span className="text-white font-medium">Upload Eligible Voters</span>
                </div>
                
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-xs text-yellow-200 mb-2">
                    Format: Each line should contain: <code>MatricNumber,Department,Level</code>
                  </p>
                  <p className="text-xs text-yellow-200/70 mb-4">
                    Example: CSC/2012/001,Computer Science Department,300L
                  </p>
                  
                  <Textarea
                    placeholder="CSC/2012/001,Computer Science Department,300L&#10;ENG/2020/045,Engineering Department,200L&#10;BUS/2021/123,Business Administration,100L"
                    value={uploadText}
                    onChange={(e) => setUploadText(e.target.value)}
                    className="min-h-[120px] bg-white/5 border-white/20 text-white placeholder:text-white/50"
                    data-testid="textarea-upload-voters"
                  />
                  
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={handleUploadEligibleVoters}
                      disabled={uploadEligibleVotersMutation.isPending}
                      className="cyber-button bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-500/40 hover:border-yellow-500/60"
                      data-testid="button-upload-voters"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadEligibleVotersMutation.isPending ? "Uploading..." : "Upload & Replace"}
                    </Button>
                    
                    <Button
                      onClick={handleClearEligibleVoters}
                      disabled={clearEligibleVotersMutation.isPending}
                      variant="outline"
                      className="cyber-button bg-red-500/10 hover:bg-red-500/20 border-red-500/30 hover:border-red-500/60"
                      data-testid="button-clear-voters"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {clearEligibleVotersMutation.isPending ? "Clearing..." : "Clear All"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Current Eligible Voters List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-yellow-400" />
                    <span className="text-white font-medium">Current Eligible Voters</span>
                  </div>
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400/50">
                    {eligibleVoters?.length || 0} eligible
                  </Badge>
                </div>
                
                <ScrollArea className="h-[300px] border border-white/10 rounded-lg bg-white/5">
                  <div className="p-4 space-y-2">
                    {eligibleVoters?.map((voter) => (
                      <div key={voter.id} className="flex justify-between items-center p-2 bg-white/5 rounded border border-white/10">
                        <div>
                          <p className="font-mono text-sm text-white">{voter.matricNumber}</p>
                          <p className="text-xs text-white/60">{voter.department}</p>
                        </div>
                        <div className="text-right">
                          {voter.level && (
                            <Badge variant="secondary" className="text-xs mb-1">
                              {voter.level}
                            </Badge>
                          )}
                          <p className="text-xs text-white/50">{formatTimestamp(voter.createdAt)}</p>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-white/60">
                        <UserCheck className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No eligible voters uploaded yet</p>
                        <p className="text-xs mt-1">Upload a list to enable voter registration</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced floating elements */}
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-primary/10 rounded-full blur-lg animate-pulse delay-500"></div>
      </div>
    </div>
  );
}