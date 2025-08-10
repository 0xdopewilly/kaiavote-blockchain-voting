# Academic Blockchain Voting Platform

## Overview

This is a web-based blockchain voting platform designed for academic settings, enabling students to vote for positions like Class Presidents, Departmental Presidents, Faculty Presidents, and Financial Secretaries. The platform leverages blockchain technology for secure, transparent, and immutable voting while providing a user-friendly interface for voter registration, wallet connection, and real-time vote tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: React hooks with TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **API Pattern**: RESTful API with structured route handling
- **Development Server**: Custom Vite integration for hot module replacement
- **Error Handling**: Centralized error middleware with structured error responses
- **Request Logging**: Custom middleware for API request tracking and performance monitoring

### Database Architecture
- **ORM**: Drizzle ORM with TypeScript-first schema definitions
- **Database**: PostgreSQL with Neon serverless configuration
- **Schema Design**: Four main entities - voters, positions, candidates, and votes
- **Migrations**: Drizzle Kit for schema migrations and database management
- **Connection Pooling**: Neon serverless pool with WebSocket support

### Blockchain Integration
- **Network**: Base Sepolia testnet (Ethereum-compatible) - Chain ID 84532
- **Smart Contracts**: VotingContract.sol and Verifier.sol deployed on Base Sepolia
- **Contract Address**: 0x742d35Cc6634C0532925a3b8D93B14A0A4B9e89f (configurable via VITE_CONTRACT_ADDRESS)
- **Wallet Integration**: MetaMask with automatic Base Sepolia network switching
- **Transaction Handling**: Web3 transaction signing with blockchain verification
- **Vote Storage**: Triple storage - database for quick access, blockchain for immutability, ZKP for privacy

### Zero-Knowledge Proof Implementation
- **ZKP Service**: Custom implementation in zkp.ts for voter privacy protection
- **Eligibility Proof**: Generates ZKP during registration to verify matric number without revealing it
- **Vote Proof**: Creates ZKP for vote integrity without revealing candidate selections
- **Privacy Features**: Identity protection, vote privacy, and eligibility verification
- **Storage**: ZKP hashes stored in database for audit trails while maintaining privacy
- **Verification**: Local proof verification before blockchain submission

### Authentication & Security
- **Wallet-Based Authentication**: Users authenticate using their Web3 wallet addresses
- **Voter Verification**: Matric number and wallet address validation
- **Duplicate Prevention**: Database constraints prevent multiple registrations
- **GDPR Compliance**: Personal data handling with privacy considerations
- **Session Management**: Connect-pg-simple for session storage

### Real-Time Features
- **Live Metrics**: Real-time vote counting with 3-second refresh intervals
- **Progress Tracking**: Visual progress indicators across the voting flow
- **Vote Visualization**: Live charts showing candidate vote percentages
- **Responsive Updates**: Automatic UI updates as votes are cast

### User Flow Architecture
1. **Registration Phase**: Voter registration with personal details and wallet connection
2. **Voting Phase**: Position-based candidate selection with blockchain transaction signing
3. **Confirmation Phase**: Transaction receipt and vote verification

## External Dependencies

### Blockchain Services
- **Neon Database**: Serverless PostgreSQL hosting with WebSocket support
- **Base Sepolia Network**: Ethereum-compatible testnet for smart contract deployment
- **MetaMask/Web3 Wallets**: Browser extension wallets for transaction signing

### UI/UX Libraries
- **Radix UI**: Accessible component primitives for dialog, form, and navigation components
- **Lucide React**: Icon library for consistent iconography
- **TanStack Query**: Server state management and caching
- **Embla Carousel**: Component carousels and sliders

### Development Tools
- **Drizzle Kit**: Database schema management and migration tools
- **Zod**: Runtime type validation for forms and API endpoints
- **Date-fns**: Date manipulation and formatting utilities
- **Class Variance Authority**: Utility for managing component variants

### Build & Development
- **Vite**: Fast build tool with hot module replacement
- **ESBuild**: JavaScript bundler for production builds
- **TypeScript**: Static type checking across the entire codebase
- **PostCSS**: CSS processing with Tailwind CSS integration