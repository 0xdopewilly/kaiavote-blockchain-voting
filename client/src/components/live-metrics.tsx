import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, RefreshCw } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useEffect } from "react";

interface Candidate {
  id: string;
  name: string;
  department: string;
  voteCount: number;
  position: {
    id: string;
    name: string;
  };
}

interface VotingStats {
  totalVotes: number;
  eligibleVoters: number;
  turnoutPercentage: number;
}

export default function LiveMetrics() {
  const { data: candidates = [], isLoading: candidatesLoading } = useQuery<Candidate[]>({
    queryKey: ["/api/candidates"],
    refetchInterval: 3000, // Refresh every 3 seconds
  });

  const { data: stats, isLoading: statsLoading } = useQuery<VotingStats>({
    queryKey: ["/api/stats"],
    refetchInterval: 3000,
  });

  // Group candidates by position
  const candidatesByPosition = candidates.reduce((acc, candidate) => {
    const positionName = candidate.position.name;
    if (!acc[positionName]) {
      acc[positionName] = [];
    }
    acc[positionName].push(candidate);
    return acc;
  }, {} as Record<string, Candidate[]>);

  // Calculate percentages for each position
  const getPositionTotalVotes = (positionCandidates: Candidate[]) => {
    return positionCandidates.reduce((total, candidate) => total + candidate.voteCount, 0);
  };

  const getCandidatePercentage = (candidate: Candidate, positionCandidates: Candidate[]) => {
    const totalVotes = getPositionTotalVotes(positionCandidates);
    return totalVotes > 0 ? (candidate.voteCount / totalVotes) * 100 : 0;
  };

  if (candidatesLoading || statsLoading) {
    return (
      <div className="glass-morph rounded-2xl border-2 border-primary/30 w-full sticky top-6">
        <div className="p-6">
          <h3 className="flex items-center text-xl font-bold text-white mb-6">
            <div className="relative mr-3">
              <BarChart3 className="h-6 w-6 text-primary" />
              <div className="absolute -inset-2 bg-primary/20 rounded-full blur-md animate-pulse"></div>
            </div>
            Live Vote Count
          </h3>
          <div className="space-y-4">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-primary/20 rounded-xl w-3/4"></div>
              <div className="h-3 bg-primary/10 rounded-lg"></div>
              <div className="h-6 bg-primary/20 rounded-xl w-2/3"></div>
              <div className="h-3 bg-primary/10 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-morph rounded-2xl border-2 border-primary/30 w-full sticky top-6">
      <div className="p-6">
        <h3 className="flex items-center text-xl font-bold text-white mb-6">
          <div className="relative mr-3">
            <BarChart3 className="h-6 w-6 text-primary" />
            <div className="absolute -inset-2 bg-primary/20 rounded-full blur-md animate-pulse"></div>
          </div>
          Live Vote Count
        </h3>
        
        <div className="space-y-8">
          {Object.entries(candidatesByPosition).map(([positionName, positionCandidates]) => (
            <div key={positionName}>
              <h4 className="text-lg font-bold text-white mb-4" data-testid={`position-${positionName.replace(/\s+/g, '-').toLowerCase()}`}>
                {positionName}
              </h4>
              <div className="space-y-4">
                {positionCandidates.map((candidate) => {
                  const percentage = getCandidatePercentage(candidate, positionCandidates);
                  return (
                    <div key={candidate.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium" data-testid={`candidate-name-${candidate.id}`}>
                          {candidate.name}
                        </span>
                        <span className="text-primary font-bold text-lg" data-testid={`candidate-votes-${candidate.id}`}>
                          {candidate.voteCount}
                        </span>
                      </div>
                      <div className="relative">
                        <Progress 
                          value={percentage} 
                          className="h-3 bg-muted/20"
                          data-testid={`candidate-progress-${candidate.id}`}
                        />
                        {percentage > 0 && (
                          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-20 rounded-full blur-sm"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {stats && (
            <>
              <div className="pt-6 border-t border-primary/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium text-lg">Total Votes Cast</span>
                    <span className="text-primary font-bold text-xl" data-testid="total-votes">
                      {stats.totalVotes}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium text-lg">Eligible Voters</span>
                    <span className="text-primary font-bold text-xl" data-testid="eligible-voters">
                      {stats.eligibleVoters}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex items-center justify-between text-white font-medium mb-3">
                    <span className="text-lg">Turnout</span>
                    <span className="text-accent font-bold text-xl" data-testid="turnout-percentage">
                      {stats.turnoutPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={stats.turnoutPercentage} 
                      className="h-4 bg-muted/20"
                      data-testid="turnout-progress"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-20 rounded-full blur-sm"></div>
                  </div>
                </div>
              </div>

              <div className="glass-morph rounded-xl p-4 border border-primary/20 text-center">
                <div className="flex items-center justify-center text-white/90 font-medium">
                  <div className="relative mr-2">
                    <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                    <div className="absolute -inset-1 bg-primary/20 rounded-full blur animate-pulse"></div>
                  </div>
                  Updates every 3 seconds
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
