import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, User, CheckCircle } from "lucide-react";

interface Registration {
  id: string;
  fullName: string;
  matricNumber: string;
  walletAddress: string;
  hasVoted: boolean;
}

interface ExistingRegistrationsProps {
  registrations: Registration[];
  onConnect: (walletAddress: string) => void;
}

export default function ExistingRegistrations({ registrations, onConnect }: ExistingRegistrationsProps) {
  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Existing Registrations</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {registrations.map((reg) => (
            <div
              key={reg.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex-1">
                <div className="font-medium">{reg.fullName}</div>
                <div className="text-sm text-muted-foreground">
                  Matric: {reg.matricNumber}
                </div>
                <div className="text-xs text-muted-foreground flex items-center space-x-1">
                  <Wallet className="h-3 w-3" />
                  <span>{reg.walletAddress.slice(0, 6)}...{reg.walletAddress.slice(-4)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {reg.hasVoted && (
                  <Badge variant="outline" className="text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Voted
                  </Badge>
                )}
                <Button
                  size="sm"
                  onClick={() => onConnect(reg.walletAddress)}
                  className="text-xs"
                >
                  Connect
                </Button>
              </div>
            </div>
          ))}
        </div>
        {registrations.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No registrations found. Register a new voter above.
          </p>
        )}
      </CardContent>
    </Card>
  );
}