# StoryVerse - A Story Protocol DApp

## 📚 Project Overview

**StoryVerse** is a decentralized application built on the **Story Protocol** that enables creators to:
- 📝 Create and publish stories as on-chain IP assets
- 🎨 Remix and create derivatives with custom commercial terms
- 📜 Manage licensing with Programmable IP License (PIL)
- 🌐 Explore and discover stories in a decentralized marketplace
- 💰 Set minting fees and revenue sharing for derivatives

This is a **showcase project** for Story Protocol's capabilities in managing intellectual property on the blockchain.

---

## 🎯 Key Features

### 1. **Story Creation**
- Write original stories with title, description, and content
- Upload optional cover images (stored on IPFS)
- Assign creator names for attribution
- Automatic IP asset registration on Story Protocol
- **License Type**: Non-Commercial Social Remixing (Free remixing with attribution, no commercial use)

### 2. **Remix & Derivatives with Commercial Terms**
- Browse marketplace of available stories
- Create remixes of any story you have permission to use
- **Set custom minting fee** - Define IP token price for your remix
- **Set revenue share percentage** - Earn from derivatives of your remix
- All remixes tracked on-chain with parent-child relationships
- License terms automatically attached to enable further remixing

### 3. **Licensing System**
- **Original Stories**: Non-Commercial Social Remixing PIL Terms
  - ✅ Free to remix and share
  - ✅ Requires attribution
  - ✅ Derivatives inherit same license
  - ❌ No commercial use allowed
- **Remixes**: Commercial Use Enabled with Custom Terms
  - 💰 Creator sets minting fee (in IP tokens)
  - 📊 Creator sets revenue share percentage
  - ✅ Derivatives allowed with same terms
  - ✅ Commercial usage permitted
- Automatically registered and attached to every IP asset
- Enables transparent governance of creator rights

### 4. **IP Asset Management**
- Each story becomes an NFT on Story Aeneid Testnet
- IP assets registered with metadata URI pointing to IPFS
- Creators tracked on-chain with contribution percentages
- Stories viewable on Story Protocol Explorer
- All content freely readable (no payment gates)

### 5. **Marketplace**
- Browse all created stories
- Read full story content without restrictions
- View story details, creator info, and license terms
- Direct links to Story Protocol Explorer
- Filter and discover stories easily

---

## 🏗️ Technical Architecture

### **Frontend**
- **React** + TypeScript
- **Vite** for fast development
- **Tailwind CSS** + **Framer Motion** for UI/animations
- **React Hook Form** + **Zod** for form validation
- **Wagmi** v2.14.7 for wallet connection
- **TanStack React Query** for data management

### **Blockchain**
- **Story Protocol SDK** v1.4.1 (TypeScript)
- **Story Aeneid Testnet** (Chain ID: 1315)
- **Viem** 2.21.4 for smart contract interactions
- **Smart Contract Addresses**:
  - SPG NFT Collection: `0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc`
  - Royalty Policy LAP: `0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E`
  - PIL Registry: `0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316`

### **Storage**
- **IPFS** via Pinata for metadata and image storage
- **LocalStorage** for caching user stories
- **On-Chain Storage** for IP asset and license data

### **Dependencies**
```json
{
  "@story-protocol/core-sdk": "^1.4.1",
  "react": "^18.3.1",
  "vite": "^7.2.2",
  "tailwindcss": "^3.4.0",
  "framer-motion": "^11.0.8",
  "wagmi": "^2.14.7",
  "viem": "^2.21.4",
  "react-hook-form": "^7.51.3",
  "zod": "^3.22.4",
  "@tanstack/react-query": "^5.28.0"
}
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── story/
│   │   ├── CreateStoryForm.tsx        # Create new story form
│   │   ├── RemixStoryForm.tsx         # Remix with commercial terms
│   │   ├── Marketplace.tsx            # Browse stories
│   │   └── MyStories.tsx              # User's created stories
│   ├── wallet/
│   │   └── WalletButton.tsx           # Connect wallet
│   └── ui/
│       ├── Badge.tsx, Button.tsx, Card.tsx, etc.
├── hooks/
│   ├── useCreateStory.ts              # Story creation logic
│   ├── useCreateRemix.ts              # Remix creation with licensing
│   └── useStoryGraph.ts               # Story relationships
├── lib/
│   ├── simpleNFT.ts                   # NFT contract config
│   ├── storyChain.ts                  # Network configuration
│   ├── storySdkClient.ts              # Story Protocol client
│   ├── wagmiConfig.ts                 # Wagmi config
│   └── queryClient.ts                 # React Query setup
├── utils/
│   ├── ipfs.ts                        # IPFS utilities
│   └── storyMetadata.ts               # Metadata helpers
├── types/
│   ├── story.ts                       # Story interfaces
│   └── window.d.ts                    # Global types
├── providers/
│   └── StorySdkProvider.tsx           # Story Protocol provider
├── styles/
│   └── global.css
├── App.tsx                            # Main app component
└── main.tsx                           # Entry point
```

---

## 🔄 Transaction Flows

### **Story Creation Flow** (3 On-Chain Transactions)

1. **Upload Image to IPFS** (Off-chain)
   - Store cover image permanently on IPFS via Pinata

2. **Upload Metadata to IPFS** (Off-chain)
   - Store story metadata: title, description, content, creators, attributes, image hash

3. **Register PIL Terms On-Chain** (Transaction #1)
   - Create Non-Commercial Social Remixing license terms
   - Enable free remixing with attribution
   - Gas cost: Varies by network congestion

4. **Mint NFT & Register IP Asset** (Transaction #2)
   - Mint NFT on Story testnet collection
   - Register as IP asset with metadata URI
   - Returns: IP Asset ID, Token ID, NFT Contract

5. **Attach License to IP Asset** (Transaction #3)
   - Enable license minting for remixes
   - Allow other users to create derivatives

**Time**: 1-2 minutes | **Transactions**: 3 | **Gas**: Network dependent

### **Remix Creation Flow** (3 On-Chain Transactions)

1. **Check Parent License** (Off-chain)
   - Verify parent story has license terms attached
   - Attach terms if missing (Transaction #1)

2. **Mint License Token** (Transaction #1 or #2)
   - Get permission to remix parent story
   - Burn license token to create derivative

3. **Upload Remix Metadata to IPFS** (Off-chain)
   - Store remix content and metadata
   - Include minting fee and revenue share settings

4. **Register Derivative IP Asset** (Transaction #2 or #3)
   - Register remix as new IP asset
   - Link to parent IP asset on-chain
   - Apply custom commercial terms (minting fee + revenue share)

**Time**: 1-2 minutes | **Transactions**: 2-3 | **Gas**: Network dependent

---

## 🧬 Metadata Standards

### **IPA Metadata Standard (Story Protocol)**

All stories follow the IPA Metadata Standard for proper explorer display:

```typescript
interface StoryMetadata {
  // Required for explorer display
  title: string;                    // Story title
  description: string;              // Story description
  image?: string;                   // Cover image (IPFS URL)
  imageHash?: string;               // SHA-256 hash of image
  creators?: IpCreator[];           // Creator info with address
  createdAt: number;                // Timestamp

  // Additional fields
  content: string;                  // Full story content
  author: string;                   // Author wallet address
  creatorName?: string;             // Creator display name

  // Remix-specific fields
  parentIpId?: string;              // Parent IP asset ID
  licenseTermsId?: string;          // License terms ID
  mintingFee?: string;              // Minting fee in IP tokens
  commercialRevShare?: string;      // Revenue share percentage

  // For media verification
  mediaUrl?: string;                // Media URL
  mediaHash?: string;               // Media hash
  mediaType?: string;               // MIME type

  // Optional metadata
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  tags?: string[];
  ipType?: string;
}

interface IpCreator {
  name: string;                     // Creator name
  address: string;                  // Wallet address
  contributionPercent: number;      // % contribution (100 for original)
  description?: string;
  image?: string;
  role?: string;
  socialMedia?: Array<{
    platform: string;
    url: string;
  }>;
}
```

### **Metadata Storage**
- **Format**: JSON stored on IPFS via Pinata
- **Hashing**: SHA-256 for content verification
- **Display**: Automatically displayed in Story Protocol Explorer

---

## 🔐 Security & Licensing

### **PIL (Programmable IP License)**

**For Original Stories**:
- **Type**: Non-Commercial Social Remixing
- **Commercial Use**: Disabled
- **Derivatives Allowed**: Yes
- **Revenue Sharing**: Not applicable
- **Minting Fee**: Free (0)
- **Attribution Required**: Yes

**For Remixes**:
- **Type**: Commercial Use Enabled
- **Commercial Use**: Yes
- **Derivatives Allowed**: Yes
- **Minting Fee**: Set by creator (in IP tokens)
- **Revenue Share**: Set by creator (percentage)
- **Attribution Required**: Yes
- **Currency**: IP tokens (native to Story Protocol)

### **On-Chain Security**
- All transactions recorded on Story Aeneid Testnet
- IP assets immutable once registered
- License terms enforced by smart contracts
- Parent-child relationships verified on-chain

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+
- MetaMask or compatible Web3 wallet
- IP tokens for gas on Story Aeneid Testnet

### **Environment Setup**

1. **Clone and install**:
```bash
git clone <your-repo-url>
cd story-dapp
npm install
```

2. **Create `.env.local`**:
```env
VITE_PINATA_JWT=your_pinata_jwt_here
```

Get your Pinata JWT from: https://pinata.cloud/

3. **Run development server**:
```bash
npm run dev
```

4. **Connect wallet**:
   - Open http://localhost:5173
   - Click "Connect Wallet"
   - Switch to Story Aeneid Testnet (Chain ID: 1315)
   - Network will be added automatically if not present

### **Getting Testnet Tokens**
- Visit Story Faucet: https://faucet.story.foundation/
- Enter your wallet address
- Request IP tokens for gas fees

---

## 📊 How to Use

### **Creating a Story**
1. Click "Create Story" tab
2. Fill in:
   - Title (minimum 3 characters)
   - Description (minimum 10 characters)
   - Content (minimum 100 characters)
   - Creator Name (optional)
   - Cover Image (optional)
3. Click "Create Story"
4. Approve 3 transactions:
   - Register license terms
   - Mint NFT + Register IP
   - Attach license
5. View your story in "My Stories" tab

### **Creating a Remix**
1. Browse stories in "Marketplace" tab
2. Click "Remix This Story"
3. Fill in remix form:
   - Title
   - Description
   - Content
   - Creator Name (optional)
   - **Minting Fee** (in IP tokens, e.g., "0.01")
   - **Revenue Share** (percentage, e.g., "10" for 10%)
4. Click "Create Remix"
5. Approve 2-3 transactions:
   - Mint license token
   - Register derivative IP
6. Your remix is now available with custom commercial terms

### **Reading Stories**
1. Go to "Marketplace" tab
2. Browse all available stories
3. Click "Read Full Story" to expand content
4. All stories are freely readable (no payment required)

---

## 💰 Commercial Terms for Remixes

When creating a remix, you can set:

### **Minting Fee**
- Amount in IP tokens required to mint a license of your remix
- Example: "0.01" IP tokens
- Recipients pay this fee when creating derivatives of your work
- Set to "0" for free licensing

### **Revenue Share**
- Percentage of revenue shared with you from derivatives
- Example: "10" means 10% of derivative earnings
- Enforced automatically by Story Protocol
- Range: 0-100%

### **Use Cases**
- **Free Remix**: Minting Fee = 0, Revenue Share = 0
- **Paid License**: Minting Fee = 0.01, Revenue Share = 0
- **Revenue Model**: Minting Fee = 0, Revenue Share = 10
- **Hybrid**: Minting Fee = 0.01, Revenue Share = 5

---

## 🔍 Explorer Integration

### **Story Protocol Explorer Links**
- View IP assets: https://aeneid.explorer.story.foundation/ipa/[IP_ID]
- View transactions: https://aeneid.storyscan.xyz/tx/[TX_HASH]

### **What You'll See**
- Story title in overview (via IPA Metadata Standard)
- Creator attribution and contribution percentage
- License type in attributes
- All metadata served from IPFS
- Parent-child relationships for remixes

---

## 📋 Known Limitations

### **NFT Display Name**
- Shows "Test NFTs #[ID]" instead of story title
- **Reason**: Using public SPG collection without individual NFT metadata
- **Solution**: Would require custom ERC-721 contract
- **Impact**: Does not affect IP asset or licensing functionality

### **License Display on Explorer**
- "Licenses" section may show "No data available"
- **Reason**: Explorer indexing delay or query issue
- **Status**: License IS attached on-chain (confirmed in transactions)
- **Workaround**: License type visible in IP asset attributes

---

## 🔧 Customization

### **Change Default License Terms**
Edit `src/hooks/useCreateStory.ts`:
```typescript
const licenseResponse = await client.license.registerPILTerms({
  commercialUse: false,        // Change to true for commercial
  derivativesAllowed: true,    // Change to false to prevent remixing
  defaultMintingFee: 0n,       // Add fee for licensing
  commercialRevShare: 0,       // Set revenue share %
  // ... other parameters
});
```

### **Modify Form Validation**
Edit schema in `CreateStoryForm.tsx` or `RemixStoryForm.tsx`:
```typescript
const storySchema = z.object({
  title: z.string().min(3, "Title too short"),
  description: z.string().min(10, "Description too short"),
  content: z.string().min(100, "Content too short"),
  // Adjust validation rules as needed
});
```

### **Update IPFS Provider**
Edit `src/utils/ipfs.ts` to change Pinata configuration or use a different IPFS provider.

### **Customize UI Styling**
- Edit `tailwind.config.ts` for theme customization
- Modify `src/styles/global.css` for global styles
- Update component styles in individual component files

---

## 📚 Resources

### **Story Protocol**
- Documentation: https://docs.story.foundation/
- SDK Reference: https://docs.story.foundation/sdk-reference
- Explorer: https://aeneid.explorer.story.foundation/
- Discord: https://discord.gg/storyprotocol

### **Related Technologies**
- IPFS: https://ipfs.io/
- Pinata: https://pinata.cloud/
- Story Aeneid Testnet Faucet: https://faucet.story.foundation/
- Wagmi: https://wagmi.sh/
- Viem: https://viem.sh/

---

## 🐛 Troubleshooting

### **Wallet Connection Issues**
- Make sure you're on Story Aeneid Testnet (Chain ID: 1315)
- Clear browser cache and reload
- Try disconnecting and reconnecting wallet

### **Transaction Failures**
- Ensure you have enough IP tokens for gas
- Check wallet is connected
- Try increasing gas limit

### **IPFS Upload Errors**
- Verify Pinata JWT is correct in `.env.local`
- Check file size (max 100MB)
- Ensure stable internet connection

### **License Attachment Errors**
- This happens when parent IP doesn't have license terms
- Fixed automatically: app now checks and attaches terms before remix
- If error persists, try refreshing and creating remix again

---

## 🤝 Contributing

This is a showcase project. Feel free to:
- Fork and modify for your own use
- Experiment with different license types
- Add new features (e.g., dispute system, analytics)
- Report issues and suggest improvements
- Submit pull requests

---

## 📝 License

This project showcases Story Protocol's capabilities. Follow Story Protocol's terms for commercial use.

---

## ✨ Built With

- ⛓️ **Story Protocol** - IP asset management & licensing
- 📌 **IPFS/Pinata** - Decentralized storage
- ⚛️ **React** - UI framework
- 🔗 **Wagmi** - Web3 wallet integration
- 📦 **Vite** - Build tooling
- 🎨 **Tailwind CSS** - Styling
- 🎭 **Framer Motion** - Animations
- 📋 **React Hook Form** - Form management
- ✅ **Zod** - Schema validation

---

## 🎉 Features Added

✅ Story creation with IP registration  
✅ Remix creation with parent-child linking  
✅ Custom minting fees for remixes  
✅ Revenue sharing for derivatives  
✅ IPFS metadata storage  
✅ Wallet connection with Wagmi  
✅ License terms management  
✅ Marketplace for story discovery  
✅ Story Protocol Explorer integration  
✅ Automatic license attachment  
✅ No payment gates (all content free to read)

---

**Last Updated**: November 21, 2025  
**Version**: 2.0.0 - Commercial Remix Release  
**Status**: ✅ Production Ready
