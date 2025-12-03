# 📚 Story Verse

> A decentralized storytelling platform powered by Story Protocol, where creators can write, mint, and remix stories as NFTs with automatic revenue sharing.

<div align="center">

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript)
![Story Protocol](https://img.shields.io/badge/Story_Protocol-v1.4.1-purple)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

## ✨ Features

### 🤖 AI-Powered Story Generation
- **Groq AI Integration**: Generate complete stories using Llama 3.3 70B model
- **One-Click Creation**: Just provide a prompt and get a full story with title, description, and content
- **Smart Prompts**: AI generates optimized image prompts for your NFT covers

### 🎨 NFT Minting & IP Registration
- **Automated NFT Creation**: Stories are minted as NFTs on Story Protocol testnet
- **IPFS Storage**: Permanent, decentralized storage for metadata and images
- **IP Asset Registration**: Automatic registration on Story Protocol blockchain

### 💰 Commercial Licensing & Revenue Sharing
- **PIL Commercial License**: Stories use Programmable IP License with commercial rights
- **Automatic Revenue Share**: Original creators earn 10% (customizable) from all remixes
- **WIP Token Payments**: Uses whitelisted WIP tokens for minting fees (1 WIP default)
- **On-Chain Enforcement**: Revenue sharing enforced automatically by smart contracts
- **Royalty Claiming**: View and claim accumulated royalties from your IP vault
- **Past Revenue Access**: Claim all past unclaimed royalties in one transaction

### 🔄 Story Remixing
- **Derivative Creation**: Remix existing stories with proper attribution
- **License Inheritance**: Derivative works inherit terms from parent stories
- **Revenue Flow**: Payments automatically route to original creators
- **Remix Tree**: Track the full genealogy of story derivatives

### 📊 Real-Time Progress Tracking
- **Transaction Modal**: Beautiful modal showing step-by-step progress
- **Visual Feedback**: Check marks for completed steps, spinners for active operations
- **Error Handling**: Clear error messages with transaction links
- **6-Step Process**: Track uploads, license registration, minting, and database saves

## 🚀 Quick Start

### Prerequisites

```bash
Node.js 18+ and npm/yarn
MetaMask or compatible Web3 wallet
Story Protocol Aeneid Testnet access
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/abhishekdotapp/story-verse.git
cd story-verse
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
# Groq AI (Free tier - get from https://console.groq.com/)
VITE_GROQ_API_KEY=gsk_your_groq_api_key

# Pinata (IPFS storage - get from https://pinata.cloud/)
VITE_PINATA_JWT=your_pinata_jwt_token

# Supabase (Database - get from https://supabase.com/)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# WalletConnect (Optional - get from https://cloud.walletconnect.com/)
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:5173
```

## 🎯 Usage

### Creating an Original Story

1. **Connect Wallet**: Click "Connect Wallet" and switch to Story Aeneid Testnet
2. **Choose Creation Method**:
   - **AI Generator**: Enter a prompt → Generate → Accept
   - **Manual Entry**: Fill in title, description, and content manually
3. **Upload Cover Image**: Optional NFT cover image (PNG, JPG, GIF up to 5MB)
4. **Set Revenue Share**: Configure your percentage (default 10%)
5. **Submit**: Watch the progress modal track all 6 steps
6. **Done**: Your story is now an IP Asset with commercial license!

### Claiming Royalties

1. **View Your Stories**: Navigate to "My Stories" tab
2. **Check Claimable Amount**: Each story shows available WIP tokens to claim
3. **Claim Royalties**: Click "Claim Royalties" button on any story
4. **Receive Tokens**: WIP tokens are transferred directly to your wallet
5. **Accumulated Earnings**: Claims all past unclaimed revenue in one transaction

### Remixing a Story

1. **Browse Marketplace**: Find stories to remix
2. **Click "Remix Story"**: Opens remix form with parent story metadata
3. **Write Your Version**: Add your creative spin
4. **Register Derivative**: Pay minting fee (1 WIP token)
5. **Automatic Revenue**: Original creator earns their share on all future earnings

## 🏗️ Tech Stack

### Frontend
- **React 18.3.1** - UI framework
- **TypeScript 5.9.3** - Type safety
- **Vite 7.2.2** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations

### Blockchain
- **Story Protocol Core SDK v1.4.1** - IP management
- **Wagmi v2.14.7** - Wallet connection
- **Viem v2.39.0** - Ethereum interactions

### Storage & Database
- **IPFS (Pinata)** - Decentralized file storage
- **Supabase** - PostgreSQL database for metadata

### AI
- **Groq SDK** - Llama 3.3 70B for story generation
- **30 requests/minute** - Free tier

## 📜 Smart Contracts

### Story Protocol Testnet Addresses

```typescript
Network: Story Aeneid Testnet (Chain ID: 1315)
SPG NFT Contract: 0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc
Royalty Policy (LAP): 0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E
WIP Token: 0x1514000000000000000000000000000000000000
```

### License Configuration

- **License Type**: PIL (Programmable IP License) - Commercial Use
- **Commercial Use**: Enabled
- **Revenue Share**: 10% default (customizable 0-100%)
- **Derivatives**: Allowed with reciprocal terms
- **Minting Fee**: 1 WIP token
- **Currency**: WIP (Wrapped IP token - whitelisted)

## 🔧 Development

### Build for Production

```bash
npm run build
```

### Run Linting

```bash
npm run lint
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
story-dapp/
├── src/
│   ├── components/
│   │   ├── story/
│   │   │   ├── CreateStoryForm.tsx          # Story creation with AI
│   │   │   ├── RemixStoryForm.tsx           # Derivative creation
│   │   │   ├── Marketplace.tsx              # Browse all stories
│   │   │   ├── MyStories.tsx                # User's stories
│   │   │   ├── ClaimRoyalties.tsx           # Royalty claiming UI
│   │   │   ├── AIStoryGenerator.tsx         # AI generation UI
│   │   │   └── TransactionProgressModal.tsx # Progress tracker
│   │   ├── ui/                              # Reusable components
│   │   └── wallet/
│   │       └── WalletButton.tsx             # Web3 connection
│   ├── hooks/
│   │   ├── useCreateStory.ts                # Story creation logic
│   │   ├── useCreateRemix.ts                # Remix creation logic
│   │   ├── useGenerateStory.ts              # AI generation hook
│   │   ├── useClaimRoyalties.ts             # Royalty claiming logic
│   │   └── useStoryGraph.ts                 # Fetch stories
│   ├── lib/
│   │   ├── storySdkClient.ts                # Story Protocol setup
│   │   ├── wagmiConfig.ts                   # Wallet config
│   │   ├── storyChain.ts                    # Network config
│   │   └── gemini.ts                        # Groq AI integration
│   ├── utils/
│   │   ├── ipfs.ts                          # IPFS upload helpers
│   │   └── storyMetadata.ts                 # Metadata formatting
│   └── App.tsx                              # Main app component
├── .env                                     # Environment variables
├── package.json
└── README.md
```

## 🐛 Troubleshooting

### Wallet Connection Issues
- Ensure you're on Story Aeneid Testnet (Chain ID: 1315)
- Add the network manually in MetaMask if needed
- RPC URL: `https://testnet.storyrpc.io`

### Transaction Failures
- Check you have sufficient IP tokens for gas
- Verify WIP token balance for minting fees
- Ensure wallet is connected before submitting

### IPFS Upload Errors
- Verify Pinata JWT token is correct
- Check file size (max 5MB for images)
- Ensure stable internet connection

### AI Generation Issues
- Verify Groq API key is set in `.env`
- Check rate limits (30 requests/minute on free tier)
- Try regenerating if output is unsatisfactory

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Resources

- [Story Protocol Documentation](https://docs.story.foundation/)
- [Story Protocol SDK](https://github.com/storyprotocol/typescript-sdk)
- [Story Testnet Explorer](https://testnet.storyscan.xyz/)
- [Groq AI Documentation](https://console.groq.com/docs)
- [IPFS Documentation](https://docs.ipfs.tech/)

## 👨‍💻 Author

**Abhishek**
- GitHub: [@abhishekdotapp](https://github.com/abhishekdotapp)

## 🙏 Acknowledgments

- Story Protocol team for the amazing IP infrastructure
- Groq for providing free AI inference
- The Web3 community for continuous innovation

---

<div align="center">
  <strong>Built with ❤️ for the decentralized future of storytelling</strong>
</div>
