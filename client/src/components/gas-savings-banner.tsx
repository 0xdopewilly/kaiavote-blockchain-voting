import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, DollarSign, TrendingDown } from "lucide-react";

export default function GasSavingsBanner() {
  return (
    <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-full">
              <Zap className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-green-800">Ultra-Low Gas Fees on Monad</h3>
              <p className="text-sm text-green-700">Academic voting made affordable for everyone</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="flex items-center space-x-1">
                <DollarSign className="h-4 w-4 text-red-500" />
                <span className="text-xs text-gray-500 line-through">Ethereum: $15-50</span>
              </div>
              <p className="text-xs text-gray-500">per vote</p>
            </div>
            
            <TrendingDown className="h-4 w-4 text-green-600" />
            
            <div className="text-center">
              <div className="flex items-center space-x-1">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Monad: ~$0.0005</span>
              </div>
              <p className="text-xs text-green-600">per vote (MON token)</p>
            </div>
            
            <Badge variant="secondary" className="bg-green-100 text-green-800 font-bold">
              99% Savings
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}