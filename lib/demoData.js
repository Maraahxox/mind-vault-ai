/**
 * Demo Mode hardcoded data for investor pitches
 * Never touches MongoDB - 100% static data
 */

export const DEMO_WALLET = "0xDemoMode1234567890ABCDEF";

export const demoVaultEntries = [
  {
    id: 1,
    vaultData: "I'm passionate about creating AI systems that respect user autonomy and privacy",
    embedding: Array(1536).fill(0.1),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 2,
    vaultData: "Building decentralized applications excites me because it means freedom from centralized control",
    embedding: Array(1536).fill(0.12),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 3,
    vaultData: "The future of identity is on-chain, non-transferable, and tied to our digital selves",
    embedding: Array(1536).fill(0.11),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 4,
    vaultData: "Memories matter. Our past shapes our future. I want to preserve and evolve mine over time.",
    embedding: Array(1536).fill(0.13),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 5,
    vaultData: "I believe in radical transparency and open-source principles",
    embedding: Array(1536).fill(0.1),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 6,
    vaultData: "The intersection of AI and blockchain is where the magic happens - intelligence meets trust",
    embedding: Array(1536).fill(0.14),
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: 7,
    vaultData: "My core motivation: enable humans to own their digital identity permanently",
    embedding: Array(1536).fill(0.12),
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: 8,
    vaultData: "Vector embeddings and semantic search are revolutionizing how we find meaning in data",
    embedding: Array(1536).fill(0.11),
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
];

export const demoAIResponses = {
  "What excites you?": "Building the future where AI respects human autonomy. I'm most excited about creating systems where you own your memories and identity permanently. The blend of decentralized tech and intelligent systems is where I see real innovation happening.",
  "What are your core values?": "Freedom, transparency, and permanence. I believe in open-source principles and radical transparency. Data ownership matters - your memories and identity should be yours alone.",
  "How do you think about the future?": "The future is on-chain. Identity, memories, and reputation will all be non-transferable, owned by individuals. AI will serve humans, not control them. Trust-minimized systems will power the next era of the internet.",
  "What drives you?": "Solving the identity problem for Web3. I want to create systems where you can carry your digital self forever - your thoughts, memories, and evolving identity, all secured by blockchain.",
  "Tell me about your philosophy": "I believe in the democratization of AI. Intelligence shouldn't be gatekept by corporations. Users should own their data, their embeddings, their identity. This is Mind Vault's mission.",
};

export const demoNFTMetadata = {
  tokenId: 1,
  name: "MindVault Soulbound #1",
  description: "Your eternal AI identity stored inside MindVault.",
  image: "ipfs://QmXmRnM5Xb7GWocMyeEsnL8wYziFroMZfV6iVXudGgoGeD",
  external_url: "https://mind-vault-tan.vercel.app",
  attributes: [
    { trait_type: "AI Level", value: 5 },
    { trait_type: "Memory Capacity", value: "512 MB" },
    { trait_type: "Soulbound", value: "True" },
  ],
};

export const demoAnalytics = {
  walletsConnected: 342,
  memoriesStored: 8742,
  aiTwinQueries: 3284,
  soulboundNFTsMinted: 342,
};
