import { DirectListing, DirectListingV3, NFT, NewDirectListing, Status } from "@thirdweb-dev/sdk";
import { StaticImageData } from "next/image";
import { sampleNFTImages } from "../assets";
import { POLYGON_ETH_CONTRACT_ADDRESS } from "../const/addresses";
import { BigNumber } from "ethers";

const PREFIX_MOCK_TOKEN = "token";
const TOMBSTONE_LISTING_ID = "unlisted";

const MOCK_NFT_CREATOR_ADDRESS = "0x559B56eE5501931fbD779103cD9b5E1104167408";
const MOCK_NFT_OWNER_ADDRESS = "0x559B56eE5501931fbD779103cD9b5E1104167408";
const MOCK_NFT_ASSET_CONTRACT_ADDRESS = "0x16433D082e8b7F8514FAcbB3c066bcD751769b67";

export async function fetchNFT(tokenId: string, collectionAddr: string): Promise<NFT | null> {
  if (!tokenId.startsWith(PREFIX_MOCK_TOKEN)) {
    return null; // fetchWeb3NFT(tokenId, collectionAddr);
  }
  const tokenIdNum = parseInt(tokenId.replace(PREFIX_MOCK_TOKEN, ""));
  return preSeedNFTs[tokenIdNum % preSeedNFTs.length];
}

export async function fetchNFTs(collectionAddress: string): Promise<NFT[]> {
  const allNFTs = preSeedNFTs;
  // const web3NFTs = await fetchWeb3NFTs(collectionAddress);
  // [...allNFTs, ...web3NFTs];
  return [...allNFTs];
}

export function fetchOwnedNFTs(ownerAddress: string | undefined): NFT[] {
  return preSeedNFTs.filter((nft) => nft.owner === ownerAddress);
}

export async function fetchNFTContractMetadata(
  tokenId: string,
  collectionAddress: string
): Promise<any> {
  if (!tokenId.startsWith(PREFIX_MOCK_TOKEN)) {
    return null; // await fetchNFTContractMetadata(tokenId, collectionAddress);
  }
  const tokenIdNum = parseInt(tokenId.replace(PREFIX_MOCK_TOKEN, ""));
  return preSeedNFTs[tokenIdNum % preSeedNFTs.length].metadata;
}

export function fetchDirectListings(
  tokenId: string,
  collectionAddress: string
): DirectListingV3[] {
  console.log("DEBUG fetchDirectListing", tokenId, preSeedDirectListings);
  const filteredListings = preSeedDirectListings.filter((listing) => listing.tokenId === tokenId);
  console.log("DEBUG fetchDirectListing got filtered", filteredListings);
  return filteredListings;
}

export type NewDirectListingV3 = {
  tokenId: (string | number | bigint | BigNumber) &
    (string | number | bigint | BigNumber | undefined);
  pricePerToken: string | number;
  assetContractAddress: string;
  quantity?: string | number | bigint | BigNumber | undefined;
  currencyContractAddress?: string | undefined;
  startTimestamp?: number | Date | undefined;
  endTimestamp?: number | Date | undefined;
  isReservedListing?: boolean | undefined;
};

export function createDirectListing(listing: NewDirectListing | NewDirectListingV3): any {
  const pricePerToken = String(
    (listing as NewDirectListingV3).pricePerToken ||
      (listing as NewDirectListing).buyoutPricePerToken
  );
  const newListing: DirectListingV3 = {
    ...templateDirectListing,
    id: String(preSeedDirectListings.length),
    creatorAddress: MOCK_NFT_CREATOR_ADDRESS,
    assetContractAddress: listing.assetContractAddress,
    currencyContractAddress: listing.currencyContractAddress || POLYGON_ETH_CONTRACT_ADDRESS,
    status: Status.Active,
    currencyValuePerToken: {
      name: "Ether",
      symbol: "ETH",
      displayValue: String(pricePerToken),
      decimals: 18,
      value: BigNumber.from(parseInt(pricePerToken) * 10 ** 18),
    },
    tokenId: String(listing.tokenId),
    quantity: "1",
    pricePerToken: pricePerToken,
    isReservedListing: false,
  };
  preSeedDirectListings.push(newListing);
  return newListing;
}

interface ParsedNFTImageMetadata {
  title: string;
  tokenId: string;
  listingId: string;
  collectionName: string;
  image: string;
}

function parseNFTImageMetadata(imageSrc: string): ParsedNFTImageMetadata | null {
  // Split the input string by "/"
  const tokens = imageSrc.split("/");
  const filename = tokens[tokens.length - 1];

  // Check if the filename matches the expected format
  const filenameParts = filename.match(/^(\w+)-(\w+)-([\w-]+)-([\w-]+)\.([a-zA-Z0-9.]+)$/);
  if (!filenameParts) {
    return null;
  }
  const [, listingId, tokenId, collectionName, title, _] = filenameParts;
  return {
    title,
    tokenId,
    image: imageSrc,
    collectionName,
    listingId,
  };
}

const defaultNFTImageMetadata = {
  image: "",
  listingId: "0",
  title: "Untitled NFT",
  tokenId: "0",
};

const preSeedNFTs: NFT[] = sampleNFTImages.map((image: StaticImageData): NFT => {
  const { tokenId, title } = parseNFTImageMetadata(image.src) || defaultNFTImageMetadata;
  return {
    metadata: {
      id: tokenId,
      uri: image.src,
      image: image.src,
      name: title,
      description: "This is my NFT",
      attributes: [
        { trait_type: "Background", value: "Blue" },
        { trait_type: "Eyes", value: "BigOneEyed" },
        { trait_type: "Mouth", value: "Green" },
        { trait_type: "Category", value: "Animal" },
      ],
    },
    owner: MOCK_NFT_OWNER_ADDRESS,
    type: "ERC721",
    supply: "1000",
    quantityOwned: "1",
  };
});

const templateDirectListing = {
  assetContractAddress: MOCK_NFT_ASSET_CONTRACT_ADDRESS,
  creatorAddress: MOCK_NFT_CREATOR_ADDRESS,
  currencyContractAddress: POLYGON_ETH_CONTRACT_ADDRESS,
  quantity: "1",
  status: Status.Active,
  currencyValuePerToken: {
    name: "Ether",
    symbol: "ETH",
    displayValue: "0.0020",
    decimals: 18,
    value: BigNumber.from("2000000000000000"),
  },
  startTimeInSeconds: new Date().getTime() / 1000,
  endTimeInSeconds: new Date().getTime() / 1000 + 3600 * 24 * 10,
  isReservedListing: false,
  pricePerToken: "0.002ETH",
  asset: {
    id: "",
    name: "Untitled NFT",
    uri: "",
    image: "",
    description: "",
  },
};

const preSeedDirectListings: DirectListingV3[] = (() => {
  return sampleNFTImages
    .map((image: StaticImageData): DirectListingV3 => {
      const { listingId, tokenId, title } =
        parseNFTImageMetadata(image.src) || defaultNFTImageMetadata;
      return {
        ...templateDirectListing,
        id: listingId,
        tokenId: tokenId,
        asset: {
          id: tokenId,
          name: title,
          uri: image.src,
          image: image.src,
          description: "This is my NFT",
        },
      };
    })
    .filter((listing) => listing.id !== TOMBSTONE_LISTING_ID);
})();
