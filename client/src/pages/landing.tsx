import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Vote, 
  Shield, 
  Users, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Lock,
  Globe,
  Award
} from "lucide-react";
import PageHeader from "@/components/page-header";

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Zero-Knowledge Privacy",
      description: "Vote privately with cryptographic proofs that protect your identity while ensuring vote integrity.",
      color: "text-emerald-400"
    },
    {
      icon: Zap,
      title: "Ultra-Low Gas Fees",
      description: "KAIA's optimized consensus delivers minimal transaction costs perfect for student budgets.",
      color: "text-yellow-400"
    },
    {
      icon: CheckCircle,
      title: "Immutable Records",
      description: "Every vote is permanently recorded on the blockchain, ensuring transparency and preventing manipulation.",
      color: "text-blue-400"
    },
    {
      icon: Users,
      title: "Academic Focus",
      description: "Designed specifically for CSC department elections with 12 leadership positions.",
      color: "text-purple-400"
    }
  ];

  const stats = [
    { label: "Security Level", value: "100%", icon: Lock },
    { label: "Gas Savings", value: "99%", icon: Zap },
    { label: "Privacy Protected", value: "Full", icon: Shield },
    { label: "Positions Available", value: "12", icon: Award }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-background/95 to-background/90">
      {/* Page Header */}
      <PageHeader />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-2 sm:px-4 pt-20 pb-8">
        {/* Header Section */}
        <div className={`text-center mb-8 sm:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative inline-block mb-6 sm:mb-8">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-wider mb-3 sm:mb-4" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #a3ff00 25%, #7fff00 50%, #32ff00 75%, #00ff32 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 30px rgba(163, 255, 0, 0.5)'
            }}>
              CryptoVote on KAIA
            </h1>
            <div className="absolute -inset-8 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-3xl"></div>
            <Sparkles className="absolute -top-6 -right-6 h-8 w-8 text-primary animate-pulse" />
            <Sparkles className="absolute -bottom-6 -left-6 h-6 w-6 text-accent animate-pulse delay-500" />
          </div>
          
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white font-medium mb-4 sm:mb-6 max-w-4xl mx-auto leading-relaxed px-2">
            Next-Generation Blockchain Voting Platform
          </p>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-2">
            Secure, Private, and Transparent academic elections powered by Zero-Knowledge Proofs on KAIA Chain
          </p>
          

        </div>

        {/* Stats Cards */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {stats.map((stat, index) => (
            <Card key={index} className="glass-morph border-primary/20 hover:border-primary/40 transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-3">
                  <stat.icon className="h-8 w-8 text-primary mx-auto group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute -inset-2 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>



        {/* Features Section */}
        <div className={`mb-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Revolutionary Features
          </h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass-morph border-primary/20 hover:border-primary/40 transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <feature.icon className={`h-8 w-8 ${feature.color} group-hover:scale-110 transition-transform duration-300`} />
                      <div className={`absolute -inset-2 ${feature.color.replace('text-', 'bg-')}/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-white/80 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className={`text-center transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Experience the Future of Voting?
            </h2>
            <p className="text-xl text-white/80 mb-12 leading-relaxed max-w-3xl mx-auto">
              Join thousands of students already using CryptoVote for secure, private, and transparent democratic participation in academic elections.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/registration">
                <Button className="cyber-button bg-gradient-to-r from-primary via-accent to-primary hover:from-primary/90 hover:via-accent/90 hover:to-primary/90 text-white px-16 py-6 text-xl font-bold border-0 shadow-2xl hover:shadow-primary/50 transition-all duration-500" data-testid="button-final-cta">
                  Start Voting Now
                  <ArrowRight className="ml-4 h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}