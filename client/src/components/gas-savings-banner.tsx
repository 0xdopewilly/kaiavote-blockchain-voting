import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, DollarSign, TrendingDown } from "lucide-react";

export default function GasSavingsBanner() {
  return (
    <div className="glass-morph rounded-2xl border-2 border-accent/30">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="p-3 bg-gradient-to-r from-accent to-primary rounded-full">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -inset-2 bg-accent/20 rounded-full blur-lg animate-pulse"></div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Ultra-Low Gas Fees on Monad</h3>
              <p className="text-lg text-white/90 font-medium">Academic voting made affordable for everyone</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-8">
            <div className="text-center">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-red-400" />
                <span className="text-sm text-red-400 line-through font-medium">Ethereum: $15-50</span>
              </div>
              <p className="text-sm text-red-400/80">per vote</p>
            </div>
            
            <TrendingDown className="h-6 w-6 text-accent" />
            
            <div className="text-center">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-accent" />
                <span className="text-lg font-bold text-accent">Monad: ~$0.0005</span>
              </div>
              <p className="text-sm text-accent/90 font-medium">per vote (MON token)</p>
            </div>
            
            <div className="glass-morph px-4 py-2 rounded-xl border border-accent/50">
              <span className="text-lg font-bold text-accent">99% Savings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}