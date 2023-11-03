import { NFT, ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ACTIVE_NETWORK, THIRDWEB_SECRET_KEY } from "../const/addresses";

export async function fetchNFT(tokenId: string, collectionAddr: string): Promise<NFT> {
  const sdk = new ThirdwebSDK(ACTIVE_NETWORK, { secretKey: THIRDWEB_SECRET_KEY });
  const contract = await sdk.getContract(collectionAddr);
  const nft = await contract.erc721.get(tokenId);
  return nft;
}

export async function fetchNFTs(collectionAddr: string): Promise<NFT[]> {
  const sdk = new ThirdwebSDK(ACTIVE_NETWORK, { secretKey: THIRDWEB_SECRET_KEY });
  const contract = await sdk.getContract(collectionAddr);
  const nfts = await contract.erc721.getAll();
  return nfts;
}

export async function fetchNFTContractMetadata(
  tokenId: string,
  collectionAddr: string
): Promise<any> {
  const sdk = new ThirdwebSDK(ACTIVE_NETWORK, { secretKey: THIRDWEB_SECRET_KEY });
  const contract = await sdk.getContract(collectionAddr);
  let contractMetadata;
  try {
    contractMetadata = await contract.metadata.get();
  } catch (e) {
    console.log("error fetching web3 contract metadata", e);
  }
  return contractMetadata;
}
