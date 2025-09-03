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
  Award,
  Hexagon,
  Triangle,
  Circle,
  Square
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

      {/* Enhanced 3D Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-green-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-accent/15 to-primary/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary/10 to-green-300/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        
        {/* 3D Floating Geometric Shapes */}
        <div className="absolute top-20 left-10 transform rotate-12 animate-float" style={{animationDelay: '0s'}}>
          <div className="w-16 h-16 bg-gradient-to-br from-primary/30 to-green-400/20 transform rotate-45 rounded-lg shadow-2xl"></div>
        </div>
        <div className="absolute top-40 right-20 transform -rotate-12 animate-float" style={{animationDelay: '1s'}}>
          <div className="w-12 h-12 bg-gradient-to-tr from-green-400/40 to-primary/20 rounded-full shadow-2xl"></div>
        </div>
        <div className="absolute bottom-40 left-20 transform rotate-45 animate-float" style={{animationDelay: '2s'}}>
          <div className="w-8 h-8 bg-gradient-to-bl from-primary/50 to-green-300/30 transform skew-x-12 shadow-xl"></div>
        </div>
        <div className="absolute bottom-20 right-10 transform -rotate-45 animate-float" style={{animationDelay: '0.5s'}}>
          <div className="w-20 h-20 bg-gradient-to-tl from-green-400/25 to-primary/15 transform rotate-12 rounded-xl shadow-2xl"></div>
        </div>
        
        {/* Enhanced floating particles */}
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-gradient-to-r from-primary/40 to-green-400/30 rounded-full animate-pulse shadow-lg"
            style={{
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              boxShadow: '0 0 10px rgba(163, 255, 0, 0.3)'
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-2 sm:px-4 pt-20 pb-8">
        {/* Header Section */}
        <div className={`text-center mb-8 sm:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative inline-block mb-6 sm:mb-8">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-wider mb-3 sm:mb-4" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #7fff00 20%, #00ff00 40%, #32ff00 60%, #7fff00 80%, #00ff00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 50px rgba(127, 255, 0, 0.8), 0 4px 8px rgba(0, 0, 0, 0.9)'
            }}>
              CryptoVote on KAIA
            </h1>
            <div className="absolute -inset-8 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-3xl"></div>
            <Sparkles className="absolute -top-6 -right-6 h-8 w-8 text-primary animate-pulse" />
            <Sparkles className="absolute -bottom-6 -left-6 h-6 w-6 text-accent animate-pulse delay-500" />
          </div>
          
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-bright font-bold mb-4 sm:mb-6 max-w-4xl mx-auto leading-relaxed px-2">
            Next-Generation Blockchain Voting Platform
          </p>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-bright max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-2">
            Secure, Private, and Transparent academic elections powered by Zero-Knowledge Proofs on KAIA Chain
          </p>
          
          {/* Modern CTA Buttons - Inspired by the attachments */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-12 px-4">
            <Link to="/register">
              <Button size="lg" className="cyber-button kaia-glow kaia-pulse h-16 px-8 text-lg font-bold group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-green-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Vote className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10">START VOTING!</span>
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-16 px-8 text-lg border-2 border-primary/30 hover:border-primary/60 bg-transparent hover:bg-primary/10 group">
              <Shield className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              <span>LEARN MORE</span>
            </Button>
          </div>

        </div>

        {/* Modern Voting Illustration Section - Inspired by attachments */}
        <div className={`mb-20 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative glass-card p-12 mx-4 sm:mx-8 overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="grid grid-cols-8 grid-rows-6 h-full w-full gap-4">
                {[...Array(48)].map((_, i) => (
                  <div key={i} className="bg-primary/20 rounded-full animate-pulse" style={{animationDelay: `${i * 0.1}s`}}></div>
                ))}
              </div>
            </div>
            
            <div className="relative z-10 text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-ultra-bright mb-6">
                VOTE FOR THE FUTURE!
              </h2>
              <p className="text-lg sm:text-xl text-bright mb-8 max-w-2xl mx-auto leading-relaxed font-semibold">
                Experience democracy like never before. Your voice matters, your vote counts, and your privacy is protected.
              </p>
              
              {/* Modern voting illustration with KAIA theme */}
              <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
                {/* Left side - Voter figure */}
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary/30 to-green-400/20 rounded-full flex items-center justify-center relative overflow-hidden">
                    <Users className="h-16 w-16 text-primary animate-pulse" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-pulse"></div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary/40 rounded-full animate-bounce"></div>
                </div>
                
                {/* Center - Voting process */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                    <div className="w-16 h-1 bg-gradient-to-r from-primary to-green-400"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse delay-500"></div>
                    <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-primary"></div>
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse delay-1000"></div>
                  </div>
                  <div className="bg-gradient-to-r from-primary/20 to-green-400/20 p-4 rounded-xl border border-primary/30">
                    <Vote className="h-8 w-8 text-primary mx-auto" />
                  </div>
                </div>
                
                {/* Right side - Ballot box */}
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-tl from-green-400/30 to-primary/20 rounded-xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <CheckCircle className="h-16 w-16 text-green-400 animate-pulse" />
                  </div>
                  <div className="absolute -top-2 -left-2 w-6 h-6 bg-green-400/50 rounded-full animate-ping"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {stats.map((stat, index) => (
            <Card key={index} className="glass-morph border-primary/20 hover:border-primary/40 transition-all duration-500 group transform hover:scale-105">
              <CardContent className="p-8 text-center relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-green-400/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                <div className="relative z-10">
                  <div className="relative inline-block mb-4">
                    <stat.icon className="h-10 w-10 text-primary mx-auto group-hover:scale-125 transition-transform duration-500" />
                    <div className="absolute -inset-3 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="text-4xl font-black text-ultra-bright mb-2 group-hover:text-primary transition-colors duration-300">{stat.value}</div>
                  <div className="text-sm text-bright font-semibold group-hover:text-ultra-bright transition-colors duration-300">{stat.label}</div>
                </div>
                
                {/* Corner accents */}
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary/30 group-hover:border-primary/60 transition-colors duration-300"></div>
              </CardContent>
            </Card>
          ))}
        </div>



        {/* Features Section */}
        <div className={`mb-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-black text-center text-ultra-bright mb-12">
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
                      <h3 className="text-xl font-black text-ultra-bright mb-2">{feature.title}</h3>
                      <p className="text-bright leading-relaxed font-medium">{feature.description}</p>
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
            <h2 className="text-4xl font-black text-ultra-bright mb-6">
              Ready to Experience the Future of Voting?
            </h2>
            <p className="text-xl text-bright mb-12 leading-relaxed max-w-3xl mx-auto font-semibold">
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