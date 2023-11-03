import React from "react";
import { NFT, DirectListingV3, EnglishAuction } from "@thirdweb-dev/sdk";
import {
  ThirdwebNftMedia,
  Web3Button,
  useAddress,
  useContract,
  useValidDirectListings,
} from "@thirdweb-dev/react";
import { Avatar, Box, Button, Flex, Image, Skeleton, Text } from "@chakra-ui/react";

import { MARKETPLACE_ADDRESS, NFT_COLLECTION_ADDRESS } from "../const/addresses";
import {
  getListingCurrencyValue,
  getListingDaysLeft,
  getListingType,
  ListingType,
} from "../api/utils";

type Props = {
  nft: NFT;
};

export default function NFTCard({ nft }: Props) {
  const walletAddress = useAddress();
  const { contract: marketplace, isLoading: loadingMarketplace } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3"
  );
  const { data: directListing, isLoading: loadingDirectListing } = useValidDirectListings(
    marketplace,
    {
      tokenContract: NFT_COLLECTION_ADDRESS,
      tokenId: nft.metadata.id,
    }
  );
  // Loading
  const isLoading = loadingMarketplace || loadingDirectListing;
  const hasListing = directListing && directListing[0];
  return (
    <Flex
      direction={"column"}
      backgroundColor={"#EEE"}
      justifyContent={"center"}
      padding={"3"}
      borderRadius={"6px"}
      borderColor={"lightgray"}
      borderWidth={1}
      _hover={{ borderColor: "black" }}
      position={"relative"}
      display={"inline-block"}
    >
      {!isLoading && (
        <Button
          position={"absolute"}
          top={"5px"}
          right={"5px"}
          zIndex={"1"}
          fontSize={"sm"}
          borderColor={"white"}
          borderRadius={"full"}
          backgroundColor={"black"}
          color={"white"}
        >
          {walletAddress !== nft.owner ? (hasListing? "Buy Now!": "Not for sale :(") : (hasListing ? "Your Listing!" : "You own this!")}
        </Button>
      )}
      <Box borderRadius={"4px"} overflow={"hidden"}>
        <ThirdwebNftMedia metadata={nft.metadata} height="100%" width="100%" />
      </Box>
      <Text fontSize={"small"} color={"darkgray"} mt="10px">
        Token ID #{nft.metadata.id}
      </Text>
      <Text fontWeight={"bold"}>{nft.metadata.name}</Text>
      <Box mt={2}>
        {isLoading ? (
          <Skeleton lineHeight={"10px"}>
            <NFTCardDetailSection />
          </Skeleton>
        ) : directListing && directListing[0] ? (
          <NFTCardDetailSection listing={directListing[0]} />
        ) : (
          <NFTCardDetailSection />
        )}
      </Box>
      <Box mt={2}>
        {nft.owner === walletAddress ? (
          <Flex>
            <Avatar size="md" />
            <Flex direction={"column"} ml={4}>
              <Text fontSize={"small"} as="b">
                Owner
              </Text>
              <Text fontSize={"small"}>You owned this NFT!</Text>
              <Text fontSize={"xx-small"}>
                {nft.owner.slice(0, 10)}...{nft.owner?.slice(-4)}{" "}
              </Text>
            </Flex>
          </Flex>
        ) : (
          <Flex>
            <Avatar size={"md"} />
            <Flex direction={"column"} ml={4}>
              <Text fontSize={"small"} as="b">
                Owner
              </Text>
              <Text fontSize={"xx-small"}>
                {nft.owner.slice(0, 10)}...{nft.owner?.slice(-4)}{" "}
              </Text>
            </Flex>
          </Flex>
        )}
      </Box>
    </Flex>
  );
}

type NFTCardDetailSectionProps = {
  listing?: DirectListingV3 | EnglishAuction | undefined;
};

const NFTCardDetailSection = ({ listing }: NFTCardDetailSectionProps) => {
  const priceValue = getListingCurrencyValue(listing);
  const listingType = getListingType(listing);
  const daysLeft = getListingDaysLeft(listing);
  return (
    <Flex direction={"row"} gap={2}>
      <Flex flex={1} direction={"column"}>
        <Text fontSize={"small"} as="b">
          Listing
        </Text>
        <Text fontSize={"small"}>{listingType}</Text>
      </Flex>
      <Flex flex={1} direction={"column"}>
        <Text fontSize={"small"} as="b">
          {listing && listingType === ListingType.EnglishAuction ? "Minimum Bid" : "Price"}
        </Text>
        <Text fontSize={"small"}>
          {listing ? priceValue?.displayValue + " " + priceValue?.symbol : "-"}
        </Text>
      </Flex>
      <Flex flex={1} direction={"column"}>
        <Text fontSize={"small"} as="b">
          Days Left
        </Text>
        <Text fontSize={"small"}>{listing ? daysLeft + " " + "days" : "-"}</Text>
      </Flex>
    </Flex>
  );
};
