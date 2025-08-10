import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, DollarSign, TrendingDown } from "lucide-react";

export default function GasSavingsBanner() {
  return (
    <div className="futuristic-card p-4 h-full">
      <div className="flex items-center gap-2 mb-3">
        <div className="relative">
          <Zap className="h-5 w-5 text-accent" />
          <div className="absolute -inset-1 bg-accent/20 rounded-full blur animate-pulse"></div>
        </div>
        <h3 className="text-lg font-bold text-white">Ultra-Low Gas Fees</h3>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-red-400 line-through">Ethereum: $15-50</span>
          <TrendingDown className="h-4 w-4 text-accent" />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-accent font-bold">Monad: ~$0.0005</span>
          <div className="glass-morph px-2 py-1 rounded border border-accent/50">
            <span className="text-xs font-bold text-accent">99% Savings</span>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-white/70">Academic voting made affordable for everyone</p>
    </div>
  );
}