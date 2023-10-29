import { useEffect, useState } from "react";

import type { NFT } from "@thirdweb-dev/sdk";
import { SmartContract, useOwnedNFTs as useOwnedWeb3NFTs } from "@thirdweb-dev/react";
import { fetchNFT, fetchNFTs, fetchOwnedNFTs } from "../api/mock";
import { NFT_COLLECTION_ADDRESS } from "../const/addresses";

export function useNFTs(contract: SmartContract | undefined | null) {
  const [data, setData] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const nfts = await fetchNFTs(NFT_COLLECTION_ADDRESS);
        setData([...data, ...nfts]);
        setIsLoading(false);
        console.log("running useNFTS");
      } catch (error) {
        console.log("error in fetchNFTS:", error);
      }
    })();
  }, []);

  return { data: data, isLoading: isLoading, error: null };
}

export function useNFT(contract: SmartContract | undefined | null, tokenId: string) {
  const [data, setData] = useState<NFT | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  console.log("useNFT called");
  useEffect(() => {
    async () => {
      try {
        const nft = await fetchNFT(tokenId, NFT_COLLECTION_ADDRESS);
        if (nft) {
          setData(nft);
        }
      } catch (error) {
        console.log("error in fetchNFTS:", error);
      }
      setIsLoading(false);
    };
  }, []);
  return { data: data, isLoading: isLoading };
}

export function useOwnedNFTs(
  contract: SmartContract | undefined | null,
  address: string | undefined
) {
  const [ownedNFTs, _setOwnedNFTs] = useState<NFT[]>();
  const [isLoading, _setIsLoading] = useState(false);

  useEffect(() => {
    const _ownedNFTs = fetchOwnedNFTs(address).reverse();
    _setOwnedNFTs(_ownedNFTs);
  }, [address]);

  console.log("ownedNFTs called", ownedNFTs);
  return { data: ownedNFTs, isLoading: isLoading };
}
