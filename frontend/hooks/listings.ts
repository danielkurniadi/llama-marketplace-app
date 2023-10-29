import { useEffect, useState } from "react";
import {
  DirectListingV3,
  EnglishAuction,
  NewDirectListing,
} from "@thirdweb-dev/sdk";
import {
  MarketplaceV3,
} from "@thirdweb-dev/react";

import { useNFTs } from "./nfts";
import { NewDirectListingV3, createDirectListing, fetchDirectListings } from "../api/mock";
import { useCreateDirectListing as useWeb3CreateDirectListing } from "@thirdweb-dev/react";
import { BigNumber } from "ethers";
import { NFT_COLLECTION_ADDRESS } from "../const/addresses";

type Filter = {
  tokenContract: string;
  tokenId: string;
};

export function useValidDirectListings(contract: MarketplaceV3 | undefined, filter: Filter) {
  // const mockDirectListing = fetchDirectListing(filter.tokenId, NFT_COLLECTION_ADDRESS);
  const [validDirectListings] = useState<DirectListingV3[]>(() => {
    return fetchDirectListings(filter.tokenId, NFT_COLLECTION_ADDRESS);
  });
  const [isLoading] = useState(false);
  return {
    data: validDirectListings,
    isLoading: isLoading,
  };
}

export function useValidEnglishAuctions(contract: MarketplaceV3 | undefined, filter: Filter) {
  const { data: nfts } = useNFTs(undefined);
  const filteredNFTs = nfts.filter((nft) => {
    return nft.metadata.id === filter.tokenId;
  });
  const [validEnglishAuctions, _] = useState<EnglishAuction[]>(() => {
    if (filteredNFTs.length === 0) return [];
    return getEnglishAuctions();
  });
  return {
    data: validEnglishAuctions,
    isLoading: false,
  };
}

export function useCreateDirectListing(contract: MarketplaceV3 | undefined) {
  const { mutateAsync: web3CreateDirectListing } = useWeb3CreateDirectListing(contract);
  const combinedMutateAsync = async (listing: NewDirectListing | NewDirectListingV3) => {
    const newListing = await createDirectListing(listing);
    console.log("Calling web3CreateDirectListing");
    return await web3CreateDirectListing(newListing);
  }
  return {
    mutateAsync: combinedMutateAsync,
  };
}

function getEnglishAuctions(): EnglishAuction[] {
  return [];
}
