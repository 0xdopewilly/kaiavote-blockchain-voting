import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Wallet
} from "lucide-react";
import GlobalNav from "@/components/GlobalNav";

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

export default function AdminDashboardPage() {
  const [, setLocation] = useLocation();
  const [refreshKey, setRefreshKey] = useState(0);

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
    queryKey: ["/api/admin/voters", refreshKey],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Fetch votes
  const { data: votes, refetch: refetchVotes } = useQuery<VoteRecord[]>({
    queryKey: ["/api/admin/votes", refreshKey],
    refetchInterval: 5000,
  });

  // Fetch stats
  const { data: stats, refetch: refetchStats } = useQuery<Stats>({
    queryKey: ["/api/stats", refreshKey],
    refetchInterval: 3000,
  });

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminLoginTime");
    setLocation("/admin-login");
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetchVoters();
    refetchVotes();
    refetchStats();
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
      <div className="container mx-auto max-w-full px-2 sm:px-4">
        {/* Navigation Bar */}
        <div className="flex justify-between items-center mb-6">
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

        {/* Enhanced floating elements */}
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-primary/10 rounded-full blur-lg animate-pulse delay-500"></div>
      </div>
    </div>
  );
}