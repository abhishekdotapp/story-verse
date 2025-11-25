import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

if (!supabaseUrl || !supabaseAnonKey) {
	console.error('Supabase URL:', supabaseUrl);
	console.error('Supabase Key:', supabaseAnonKey ? '[REDACTED]' : 'undefined');
	throw new Error('Missing Supabase environment variables. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
}

if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
	console.error('Invalid Supabase URL:', supabaseUrl);
	throw new Error('Invalid VITE_SUPABASE_URL: Must start with http:// or https://');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DbStory {
	id: string; // UUID primary key
	ip_id: string; // The real IP ID from Story Protocol
	token_id: string; // NFT token ID
	nft_contract: string; // NFT contract address
	ipfs_hash: string; // IPFS hash of metadata
	token_uri: string; // Full token URI (ipfs://...)
	
	// Story content
	title: string;
	description: string;
	content: string;
	
	// Author info
	author: string; // Wallet address
	creator_name: string | null;
	
	// Media
	image_ipfs_hash: string | null;
	
	// License terms
	minting_fee: string; // As string to avoid precision issues
	commercial_rev_share: number;
	license_terms_id: string;
	
	// Blockchain references
	tx_hash: string | null;
	parent_ip_id: string | null; // For remixes
	remix_of: string | null; // Parent story title
	
	// Metadata
	status: string; // 'fully_registered', 'derivative_registered', etc.
	created_at: string; // ISO timestamp
	updated_at: string; // ISO timestamp
}

// Helper to convert SavedStory to DbStory format
export function storyToDbFormat(story: {
	id: string;
	ipId: string;
	tokenId?: string;
	nftContract?: string;
	ipfsHash: string;
	tokenURI: string;
	imageIPFSHash?: string;
	metadata: {
		title: string;
		description: string;
		content: string;
		author: string;
		creatorName?: string;
	};
	author: string;
	mintingFee: string;
	commercialRevShare: number;
	licenseTermsId?: string;
	txHash?: string;
	parentIpId?: string;
	remixOf?: string;
	status: string;
	timestamp: number;
}): Omit<DbStory, 'created_at' | 'updated_at'> {
	return {
		id: story.id,
		ip_id: story.ipId,
		token_id: story.tokenId || '0',
		nft_contract: story.nftContract || '',
		ipfs_hash: story.ipfsHash,
		token_uri: story.tokenURI,
		title: story.metadata.title,
		description: story.metadata.description,
		content: story.metadata.content,
		author: story.author.toLowerCase(),
		creator_name: story.metadata.creatorName || null,
		image_ipfs_hash: story.imageIPFSHash || null,
		minting_fee: story.mintingFee,
		commercial_rev_share: story.commercialRevShare,
		license_terms_id: story.licenseTermsId || '1',
		tx_hash: story.txHash || null,
		parent_ip_id: story.parentIpId || null,
		remix_of: story.remixOf || null,
		status: story.status,
	};
}

// Helper to convert DbStory to SavedStory format
export function dbStoryToAppFormat(dbStory: DbStory): any {
	return {
		id: dbStory.id,
		ipId: dbStory.ip_id,
		tokenId: dbStory.token_id,
		nftContract: dbStory.nft_contract,
		ipfsHash: dbStory.ipfs_hash,
		tokenURI: dbStory.token_uri,
		imageIPFSHash: dbStory.image_ipfs_hash,
		metadata: {
			title: dbStory.title,
			description: dbStory.description,
			content: dbStory.content,
			author: dbStory.author,
			creatorName: dbStory.creator_name,
			createdAt: new Date(dbStory.created_at).getTime(),
		},
		author: dbStory.author,
		timestamp: new Date(dbStory.created_at).getTime(),
		status: dbStory.status,
		mintingFee: dbStory.minting_fee,
		commercialRevShare: dbStory.commercial_rev_share,
		licenseTermsId: dbStory.license_terms_id,
		txHash: dbStory.tx_hash,
		parentIpId: dbStory.parent_ip_id,
		remixOf: dbStory.remix_of,
	};
}
