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
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center text-lg font-medium text-secondary">
            <BarChart3 className="mr-2 h-5 w-5 text-primary" />
            Live Vote Count
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-2 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-2 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full sticky top-6">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-medium text-secondary">
          <BarChart3 className="mr-2 h-5 w-5 text-primary" />
          Live Vote Count
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(candidatesByPosition).map(([positionName, positionCandidates]) => (
          <div key={positionName}>
            <h4 className="font-medium text-gray-700 mb-3" data-testid={`position-${positionName.replace(/\s+/g, '-').toLowerCase()}`}>
              {positionName}
            </h4>
            <div className="space-y-3">
              {positionCandidates.map((candidate) => {
                const percentage = getCandidatePercentage(candidate, positionCandidates);
                return (
                  <div key={candidate.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600" data-testid={`candidate-name-${candidate.id}`}>
                        {candidate.name}
                      </span>
                      <span className="font-medium text-gray-900" data-testid={`candidate-votes-${candidate.id}`}>
                        {candidate.voteCount}
                      </span>
                    </div>
                    <Progress 
                      value={percentage} 
                      className="h-2"
                      data-testid={`candidate-progress-${candidate.id}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {stats && (
          <>
            <div className="pt-4 border-t border-gray-200">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Votes Cast</span>
                  <span className="font-medium text-gray-900" data-testid="total-votes">
                    {stats.totalVotes}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Eligible Voters</span>
                  <span className="font-medium text-gray-900" data-testid="eligible-voters">
                    {stats.eligibleVoters}
                  </span>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Turnout</span>
                  <span data-testid="turnout-percentage">{stats.turnoutPercentage.toFixed(1)}%</span>
                </div>
                <Progress 
                  value={stats.turnoutPercentage} 
                  className="h-2"
                  data-testid="turnout-progress"
                />
              </div>
            </div>

            <div className="text-xs text-gray-500 text-center flex items-center justify-center">
              <RefreshCw className="mr-1 h-3 w-3" />
              Updates every 3 seconds
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
