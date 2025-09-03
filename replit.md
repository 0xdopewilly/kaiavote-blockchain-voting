# CryptoVote - Academic Blockchain Voting Platform

## Overview

CryptoVote is a comprehensive blockchain-based voting platform designed specifically for academic institutions. The platform enables secure, transparent, and private voting for academic elections including Class Presidents, Departmental Presidents, Faculty Presidents, and Financial Secretaries. Built on the KAIA blockchain ecosystem with Zero-Knowledge Proof (ZKP) integration, CryptoVote provides ultra-low gas fees while maintaining the highest security standards for academic voting.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing without the overhead of React Router
- **Styling**: Tailwind CSS with custom design system based on a dark theme with yellow/accent highlights
- **UI Components**: Radix UI primitives for accessible, customizable components with shadcn/ui styling
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Build System**: Vite for fast development builds and hot module replacement

### Backend Architecture
- **Runtime**: Node.js with Express.js for RESTful API endpoints
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple
- **Authentication**: Simple admin authentication with localStorage-based session management
- **API Design**: RESTful endpoints with proper error handling and validation using Zod schemas

### Database Design
- **Core Tables**: voters, positions, candidates, votes, eligible_voters
- **Key Features**: UUID primary keys, timestamped records, vote counting integration
- **Relationships**: Proper foreign key constraints between voters, candidates, and votes
- **Privacy Protection**: Separate eligible voters table for admin-managed voter eligibility

### Blockchain Integration
- **Primary Network**: KAIA Kairos Testnet (Chain ID: 1001) for ultra-low gas fees
- **Fallback Support**: Monad Testnet for additional blockchain compatibility
- **Smart Contracts**: Ethereum-compatible voting contracts with ZKP verification
- **Web3 Integration**: MetaMask and KAIA Wallet support for seamless wallet connections
- **Transaction Management**: Automatic gas price optimization and transaction retry logic

### Zero-Knowledge Proof Implementation
- **Voter Privacy**: ZKP circuits for voter eligibility verification without revealing matric numbers
- **Vote Integrity**: Cryptographic proofs for vote validation while maintaining anonymity
- **Anti-Double-Voting**: ZKP-based verification to prevent duplicate voting without identity disclosure
- **Proof Generation**: Client-side ZKP generation with secure proof verification

### Security Architecture
- **Wallet Authentication**: Web3 wallet-based user authentication with address validation
- **Input Validation**: Comprehensive Zod schema validation for all user inputs
- **Admin Controls**: Secure admin dashboard with voter eligibility management
- **Privacy Protection**: ZKP integration ensures voter privacy while maintaining vote integrity
- **Network Security**: Multi-network support with automatic chain validation

### Performance Optimizations
- **Real-time Updates**: Live vote counting with 3-second refresh intervals
- **Query Caching**: TanStack Query for efficient data fetching and caching
- **Gas Optimization**: KAIA blockchain integration for 99% gas fee reduction compared to Ethereum
- **Build Optimization**: Vite-based build system for optimal bundle sizes and loading speeds

## External Dependencies

### Blockchain Infrastructure
- **KAIA Kairos Testnet**: Primary blockchain network for production voting with ultra-low fees
- **Monad Testnet**: Secondary blockchain network for additional compatibility
- **MetaMask**: Primary Web3 wallet provider for user authentication
- **KAIA Wallet**: Native KAIA ecosystem wallet integration

### Database Services
- **PostgreSQL**: Primary database for voter registration, vote storage, and admin management
- **Neon Database**: Serverless PostgreSQL provider for scalable database hosting
- **Drizzle ORM**: Type-safe database operations with automatic migration support

### Development Tools
- **Hardhat**: Ethereum development environment for smart contract compilation and deployment
- **ethers.js**: Ethereum interaction library for Web3 functionality
- **Vite**: Modern build tool for fast development and optimized production builds

### UI/UX Libraries
- **Radix UI**: Headless UI primitives for accessible component development
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Icon library for consistent iconography
- **React Hook Form**: Form management with validation support

### API and State Management
- **TanStack Query**: Server state management with caching and synchronization
- **Zod**: Runtime type validation for API endpoints and user inputs
- **date-fns**: Date manipulation and formatting utilities

### Deployment and Monitoring
- **Replit**: Development environment and hosting platform
- **KAIA Block Explorer**: Transaction verification and network monitoring
- **Monad Block Explorer**: Secondary network transaction tracking