import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Lock, Eye, Key, Database, CheckCircle } from "lucide-react";
import ZKPDemo from "@/components/zkp-demo";

export default function ZKPDemoPage() {
  return (
    <div className="min-h-screen p-2 sm:p-4 relative">
      <div className="container mx-auto max-w-full px-2 sm:px-4">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8 relative">
          <div className="inline-block relative">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 sm:mb-4 tracking-wider" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 25%, #c7d2fe 50%, #a78bfa 75%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 30px rgba(255, 255, 255, 0.5)'
            }}>
              CRYPTOVOTE
            </h1>
            <div className="absolute -inset-6 bg-gradient-to-r from-transparent via-primary/30 to-transparent blur-2xl"></div>
          </div>
          <div className="space-y-2 px-2">
            <p className="text-lg sm:text-xl md:text-2xl font-semibold neon-text tracking-wide flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              Zero-Knowledge Proof Demo
            </p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <Link href="/">
                <Button variant="outline" className="cyber-button text-xs sm:text-sm">
                  <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Enhanced floating elements */}
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-accent/20 rounded-full blur-2xl animate-pulse delay-700"></div>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Explanation Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="glass-morph rounded-2xl border-2 border-primary/30 p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Lock className="h-6 w-6 text-primary mr-3" />
                What is Zero-Knowledge Proof?
              </h2>
              <div className="space-y-4 text-white/90">
                <p className="text-lg">
                  Zero-Knowledge Proof (ZKP) allows our voting system to verify student eligibility 
                  and vote integrity <strong>without revealing any sensitive information</strong>.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-white">Privacy Protected:</strong> Your matric number, 
                      vote selections, and personal details never appear on the blockchain
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-white">Cryptographically Secure:</strong> Mathematical 
                      proofs guarantee vote validity without revealing content
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-white">Publicly Verifiable:</strong> Anyone can verify 
                      election integrity without accessing private data
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-morph rounded-2xl border-2 border-accent/30 p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Key className="h-6 w-6 text-accent mr-3" />
                How ZKP Works Here
              </h2>
              <div className="space-y-4">
                <div className="glass-morph rounded-xl p-4 border border-primary/20">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center">
                    <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-sm mr-3">1</span>
                    Registration ZKP
                  </h3>
                  <p className="text-white/80 text-sm">
                    Proves you're an eligible student without revealing your matric number to the blockchain
                  </p>
                </div>
                
                <div className="glass-morph rounded-xl p-4 border border-accent/20">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center">
                    <span className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-sm mr-3">2</span>
                    Voting ZKP
                  </h3>
                  <p className="text-white/80 text-sm">
                    Proves your vote is valid and you haven't voted before, without revealing your selections
                  </p>
                </div>
                
                <div className="glass-morph rounded-xl p-4 border border-primary/20">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center">
                    <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-sm mr-3">3</span>
                    Verification
                  </h3>
                  <p className="text-white/80 text-sm">
                    Smart contracts verify all proofs mathematically, ensuring election integrity
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Live Demo Section */}
          <ZKPDemo />

          {/* Technical Implementation */}
          <div className="glass-morph rounded-2xl border-2 border-primary/30 p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Database className="h-6 w-6 text-primary mr-3" />
              Technical Implementation
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-morph rounded-xl p-4 border border-primary/20">
                <h3 className="text-lg font-bold text-white mb-3">Client-Side ZKP</h3>
                <ul className="space-y-2 text-sm text-white/80">
                  <li>• ZKP generation in <code className="text-primary">zkp.ts</code></li>
                  <li>• Hash-based commitment schemes</li>
                  <li>• Local proof verification</li>
                  <li>• Privacy-preserving cryptography</li>
                </ul>
              </div>
              
              <div className="glass-morph rounded-xl p-4 border border-accent/20">
                <h3 className="text-lg font-bold text-white mb-3">Smart Contract</h3>
                <ul className="space-y-2 text-sm text-white/80">
                  <li>• ZK Verifier integration</li>
                  <li>• On-chain proof verification</li>
                  <li>• Eligibility validation</li>
                  <li>• Vote integrity checks</li>
                </ul>
              </div>
              
              <div className="glass-morph rounded-xl p-4 border border-primary/20">
                <h3 className="text-lg font-bold text-white mb-3">Security Features</h3>
                <ul className="space-y-2 text-sm text-white/80">
                  <li>• Anti-double-voting protection</li>
                  <li>• Identity privacy preservation</li>
                  <li>• Tamper-proof vote recording</li>
                  <li>• Public result verifiability</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 glass-morph rounded-xl p-4 border border-accent/30">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                <Eye className="h-5 w-5 text-accent mr-2" />
                For Academic Defense
              </h3>
              <p className="text-white/90 text-sm mb-3">
                <strong>Key Points to Highlight:</strong>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/80">
                <div>
                  <strong className="text-white">Privacy Guarantees:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Matric numbers never exposed</li>
                    <li>• Vote selections remain secret</li>
                    <li>• Voter anonymity preserved</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-white">Security Properties:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Cryptographic integrity proofs</li>
                    <li>• Prevents vote manipulation</li>
                    <li>• Publicly auditable results</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}