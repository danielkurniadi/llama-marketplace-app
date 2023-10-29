import React from "react";
import { useRouter } from "next/router";
import { Container, Heading, Text } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import {
  MARKETPLACE_ADDRESS,
  NFT_COLLECTION_ADDRESS,
} from "../../const/addresses";
import NFTGrid from "../../components/NFTGrid";
import { useOwnedNFTs } from "../../hooks/nfts";

export default function ProfilePage() {
  const router = useRouter();
  const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS);
  const { contract: marketplace } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3"
  );
  const { data: ownedNfts, isLoading: loadingOwnedNfts } = useOwnedNFTs(
    nftCollection,
    router.query.address as string
  );
  return (
    <Container maxW={"1200px"} p={5}>
      <Heading>{"Owned NFT(s)"}</Heading>
      <Text mt={2}>Browse and manage your NFTs from this collection.</Text>
      <NFTGrid
        data={ownedNfts}
        isLoading={loadingOwnedNfts}
        emptyText={"You don't own any NFTs yet from this collection."}
      />
    </Container>
  );
}
