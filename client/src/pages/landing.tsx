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
      description: "99% gas reduction on Monad Testnet compared to Ethereum mainnet for cost-effective voting.",
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

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative inline-block mb-8">
            <h1 className="text-8xl font-bold gradient-text tracking-wider mb-4">
              VOTECHAIN
            </h1>
            <div className="absolute -inset-8 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-3xl"></div>
            <Sparkles className="absolute -top-6 -right-6 h-8 w-8 text-primary animate-pulse" />
            <Sparkles className="absolute -bottom-6 -left-6 h-6 w-6 text-accent animate-pulse delay-500" />
          </div>
          
          <p className="text-2xl text-white/90 font-medium mb-4 max-w-3xl mx-auto leading-relaxed">
            Next-Generation Blockchain Voting Platform for Academic Elections
          </p>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Secure, Private, and Transparent voting powered by Zero-Knowledge Proofs and Monad Testnet
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

        {/* Main Action Cards */}
        <div className={`grid lg:grid-cols-3 gap-8 mb-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Voter Registration Card */}
          <Card className="glass-morph border-primary/30 hover:border-primary/60 transition-all duration-500 group hover:scale-[1.02]">
            <CardContent className="p-8 text-center">
              <div className="relative inline-block mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:rotate-6 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -inset-4 bg-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Voter Registration</h3>
              <p className="text-white/80 mb-6 leading-relaxed">
                Register as an eligible CSC student voter with secure wallet integration and ZKP privacy protection.
              </p>
              <Link href="/registration">
                <Button className="w-full cyber-button bg-primary hover:bg-primary/90 text-white border-0 group-hover:shadow-lg group-hover:shadow-primary/25 transition-all duration-300" data-testid="button-register">
                  Start Registration
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Voting Card */}
          <Card className="glass-morph border-accent/30 hover:border-accent/60 transition-all duration-500 group hover:scale-[1.02]">
            <CardContent className="p-8 text-center">
              <div className="relative inline-block mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-accent to-accent/80 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:rotate-6 transition-transform duration-300">
                  <Vote className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -inset-4 bg-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Cast Your Vote</h3>
              <p className="text-white/80 mb-6 leading-relaxed">
                Vote for 12 leadership positions with complete privacy and blockchain security.
              </p>
              <Link href="/voting">
                <Button className="w-full cyber-button bg-accent hover:bg-accent/90 text-white border-0 group-hover:shadow-lg group-hover:shadow-accent/25 transition-all duration-300" data-testid="button-vote">
                  Enter Voting
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* ZKP Demo Card */}
          <Card className="glass-morph border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-500 group hover:scale-[1.02]">
            <CardContent className="p-8 text-center">
              <div className="relative inline-block mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:rotate-6 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -inset-4 bg-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">ZKP Technology</h3>
              <p className="text-white/80 mb-6 leading-relaxed">
                Learn about Zero-Knowledge Proof technology and see live demonstrations.
              </p>
              <Link href="/zkp-demo">
                <Button className="w-full cyber-button bg-emerald-500 hover:bg-emerald-600 text-white border-0 group-hover:shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300" data-testid="button-zkp-demo">
                  Explore ZKP
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </CardContent>
          </Card>
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

        {/* Call to Action */}
        <div className={`text-center transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Card className="glass-morph border-primary/30 hover:border-primary/50 transition-all duration-500 max-w-2xl mx-auto">
            <CardContent className="p-12">
              <Globe className="h-12 w-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Shape the Future of Voting?
              </h2>
              <p className="text-lg text-white/80 mb-8 leading-relaxed">
                Join the next generation of secure, private, and transparent democratic participation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/registration">
                  <Button className="cyber-button bg-primary hover:bg-primary/90 text-white px-8 py-3" data-testid="button-get-started">
                    Get Started Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/zkp-demo">
                  <Button variant="outline" className="cyber-button border-primary/50 text-primary hover:bg-primary/10 px-8 py-3" data-testid="button-learn-more">
                    Learn More
                    <Shield className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}