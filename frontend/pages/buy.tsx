import React from "react";
import { Container, Heading, Text } from "@chakra-ui/react";
import NFTGrid from "../components/NFTGrid";
import { NFT_COLLECTION_ADDRESS } from "../const/addresses";
import { useContract } from "@thirdweb-dev/react";
import { useNFTs } from "../hooks/nfts";

export default function Buy() {
    const { contract } = useContract(NFT_COLLECTION_ADDRESS);
    const { data, isLoading } = useNFTs(contract);
    return (
        <Container maxW={"1200px"} p={5}>
            <Heading>Buy NFTs</Heading>
            <Text mt={2}>Browse and buy NFTs from this collection.</Text>
            <NFTGrid
                isLoading={isLoading}
                data={data.slice(0, 20)}
                emptyText={"No NFTs found"}
            />
        </Container>
    )
};
