"use client";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { SiLinkedin, SiMessenger } from "react-icons/si";
import {
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Flex,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  VStack,
  Link,
  Spinner,
} from "@chakra-ui/react";
import {
  MediaRenderer,
  ThirdwebNftMedia,
  Web3Button,
  useAddress,
  useContract,
  useValidDirectListings,
} from "@thirdweb-dev/react";
import { DirectListingV3, EnglishAuction, NFT } from "@thirdweb-dev/sdk";
import React, { useState } from "react";
import { MARKETPLACE_ADDRESS, NFT_COLLECTION_ADDRESS } from "../../../const/addresses";
import { GetStaticPaths, GetStaticProps } from "next";
import { fetchNFT, fetchNFTContractMetadata, fetchNFTs } from "../../../api/web3";
import {
  ListingType,
  getListingCurrencyValue,
  getListingDaysLeft,
  getListingType,
} from "../../../api/utils";
import { useRouter } from "next/router";
import { marketLogo } from "../../../assets";
import { BLUE_BASE } from "../../../const/color";

type Props = {
  nft: NFT;
  contractMetadata: any;
};

export default function TokenPage({ nft, contractMetadata }: Props) {
  const walletAddress = useAddress();
  const router = useRouter();

  const { contract: marketplace, isLoading: loadingMarketplace } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3"
  );
  const { data: directListings, isLoading: loadingDirectListing } = useValidDirectListings(
    marketplace,
    {
      tokenContract: NFT_COLLECTION_ADDRESS,
      tokenId: nft.metadata.id,
    }
  );
  const isLoading = loadingMarketplace || loadingDirectListing;
  const hasListing = directListings && directListings[0];

  async function buyListing() {
    // Add for auction section
    let txResult;
    if (directListings?.[0]) {
      txResult = await marketplace?.directListings.buyFromListing(directListings[0].id, 1);
    } else {
      throw new Error("No listing found");
    }
    return txResult;
  }

  async function createBidOffer() {
    let txResult;
    let x = nft.supply;
    let y = nft.quantityOwned;
    if (directListings?.[0]) {
      txResult = await marketplace?.offers.makeOffer({
        assetContractAddress: NFT_COLLECTION_ADDRESS,
        tokenId: nft.metadata.id,
        totalPrice: directListings[0].pricePerToken,
      });
    } else {
      throw new Error("No listing found");
    }
    return txResult;
  }

  return (
    <Container maxW={"960px"} p={5} my={5}>
      <SimpleGrid columns={2}>
        <Stack spacing={"5px"} gridAutoColumns={"min-content"} width={"80%"}>
          <Box borderRadius={"6px"} overflow={"hidden"}>
            <Skeleton isLoaded={!loadingMarketplace && !loadingDirectListing}>
              <ThirdwebNftMedia metadata={nft.metadata} width="100%" height="100%" />
            </Skeleton>
          </Box>
          <Box>
            <Text fontWeight={"bold"}>Description:</Text>
            <Text>{nft.metadata.description}</Text>
          </Box>
          <Box>
            <Text fontWeight={"bold"}>Traits:</Text>
            <SimpleGrid columns={2} spacing={4}>
              {Object.entries(nft?.metadata?.attributes || {}).map(([key, value]) => (
                <Flex
                  key={key}
                  direction={"column"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  borderWidth={1}
                  p={"8px"}
                  borderRadius={"4px"}
                >
                  <Text fontSize={"small"}>{(value as { trait_type: string }).trait_type}</Text>
                  <Text fontSize={"small"} fontWeight={"bold"}>
                    {(value as { trait_type: string }).trait_type}
                  </Text>
                </Flex>
              ))}
            </SimpleGrid>
          </Box>
        </Stack>
        <Stack spacing={"20px"}>
          {contractMetadata && (
            <Flex alignItems={"center"}>
              <Box borderRadius={"4px"} overflow={"hidden"} mr={"10px"}>
                <MediaRenderer src={marketLogo.src} height="32px" width="32px" />
              </Box>
              <Text fontWeight={"bold"}>{contractMetadata.name}</Text>
            </Flex>
          )}
          <Box mx={2.5}>
            <Text fontSize={"4xl"} fontWeight={"bold"}>
              {nft.metadata.name}
            </Text>
            <Link href={`/profile/${nft.owner}`}>
              <Flex direction={"row"} alignItems={"center"}>
                <Avatar
                  src="https://bit.ly/broken-link"
                  h={"24px"}
                  w={"24px"}
                  mr={"10px"}
                  my={"10px"}
                />
                <Text fontSize={"small"}>
                  {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
                </Text>
              </Flex>
            </Link>
          </Box>
          <TokenListingDetailBox listing={directListings?.[0]} isLoading={isLoading} />
          {nft.owner !== walletAddress ? (
            <TokenPurchaseBox
              listing={directListings?.[0]}
              isLoading={isLoading}
              walletAddress={walletAddress}
              onSubmitBuy={async () => await buyListing()}
            />
          ) : hasListing ? (
            <VStack>
              <Text fontSize={"md"} alignItems={"center"}>
                You are the owner of this NFT!
              </Text>
              <Web3Button
                contractAddress={MARKETPLACE_ADDRESS}
                action={async () => {
                  console.log("Web3Button in [tokenId].tsx submitted but not doing anything...");
                  // TODO: add action.
                }}
                onSuccess={(txResult) => {
                  router.push(`/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`);
                }}
                onError={(error) => {
                  console.log("Web3Button in [tokenId].tsx error", error);
                  router.push(`/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`);
                }}
                theme="dark"
                style={{ width: "100%", height: "50px" }}
              >
                Cancel Listing
              </Web3Button>
            </VStack>
          ) : (
            <VStack>
              <Text fontSize={"md"} alignItems={"center"}>
                You are the owner of this NFT!
              </Text>
              <Button
                border={"1px"}
                borderColor={"black"}
                backgroundColor="transparent"
                _hover={{ backgroundColor: BLUE_BASE, color: "white" }}
                onClick={() => {
                  router.push("/sell");
                }}
              >
                Sell your NFT and earn!
              </Button>
            </VStack>
          )}
          <TokenSocialMediaButtonsGroup />
        </Stack>
      </SimpleGrid>
    </Container>
  );
}

type TokenListingDetailProps = {
  listing?: DirectListingV3 | EnglishAuction | undefined;
  isLoading?: boolean;
};

const TokenListingDetailBox = ({ listing, isLoading }: TokenListingDetailProps) => {
  const priceValue = getListingCurrencyValue(listing);
  const daysLeftText = listing ? `${getListingDaysLeft(listing)} days` : "Not for sale";
  return (
    <Stack direction={"column"}>
      <Flex>
        <Text flex={2} as={"b"}>
          Price
        </Text>
        {isLoading ? (
          <Skeleton flex={5} backgroundColor="gray" />
        ) : (
          <Text>
            {listing ? priceValue?.displayValue + " " + priceValue?.symbol : "Not for sale"}
          </Text>
        )}
      </Flex>
      <Flex>
        <Text flex={2} as={"b"}>
          Listing ends
        </Text>
        {isLoading ? <Skeleton flex={5} backgroundColor="gray" /> : <Text>{daysLeftText}</Text>}
      </Flex>
    </Stack>
  );
};

type TokenPurchaseProps = TokenListingDetailProps & {
  walletAddress?: string;
  onSubmitBuy: () => Promise<any>;
};

const TokenPurchaseBox = ({
  listing,
  isLoading,
  walletAddress,
  onSubmitBuy,
}: TokenPurchaseProps) => {
  const priceValue = getListingCurrencyValue(listing);
  const displayPriceValue = priceValue?.displayValue || 0 + " " + priceValue?.symbol;
  const listingType = getListingType(listing);
  // When user clicks on buy now or place bid, we want to show a loading state.
  const [isActionPending, setActionPending] = useState(false);
  return (
    <Skeleton isLoaded={!isLoading}>
      <Stack spacing={5}>
        <Stack direction={"column"}>
          {listingType === ListingType.DirectListing ? (
            <Text>{displayPriceValue}</Text>
          ) : (
            <Text>Listing was just removed ...</Text>
          )}
          <Center border={"1px"} borderRadius={"md"}>
            <Web3Button
              contractAddress={MARKETPLACE_ADDRESS}
              action={async () => {
                setActionPending(true);
                if (listingType === ListingType.DirectListing) {
                  await onSubmitBuy();
                } else {
                  throw new Error("Invalid listing type found " + listingType);
                }
                setActionPending(false);
              }}
              isDisabled={!listing || walletAddress === listing?.creatorAddress}
            >
              {isActionPending ? (
                <Spinner />
              ) : listingType === ListingType.DirectListing ? (
                "Buy Now"
              ) : (
                "Place Bid"
              )}
            </Web3Button>
          </Center>
        </Stack>
      </Stack>
    </Skeleton>
  );
};

const TokenSocialMediaButtonsGroup = () => {
  return (
    <Stack spacing={1} align={"center"} maxW={"md"} w={"full"} direction={"row"}>
      <Button
        w={"full"}
        colorScheme={"facebook"}
        leftIcon={<FaFacebook />}
        as={"a"}
        href="https://facebook.com"
        rel="noopener noreferrer"
        target="_blank"
      >
        <Text fontSize={"sm"}>Facebook Post</Text>
      </Button>
      <Button
        w={"full"}
        colorScheme={"messenger"}
        leftIcon={<SiLinkedin />}
        as="a"
        href="https://linkedin.com"
        rel="noopener noreferrer"
        target="_blank"
      >
        <Text fontSize={"sm"}>LinkedIn Post</Text>
      </Button>
      <Button
        w={"full"}
        colorScheme={"messenger"}
        leftIcon={<SiMessenger size={"20px"} />}
        as={"a"}
        href="https://messenger.com"
        rel="noopener noreferrer"
        target="_blank"
      >
        <Text fontSize={"sm"}>Share via M</Text>
      </Button>
    </Stack>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const tokenId = context.params?.tokenId as string;
  const nft = await fetchNFT(tokenId, NFT_COLLECTION_ADDRESS);
  const contractMetadata = await fetchNFTContractMetadata(tokenId, NFT_COLLECTION_ADDRESS);
  return {
    props: {
      nft,
      contractMetadata: contractMetadata || null,
    },
    revalidate: 1, // https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const nfts = await fetchNFTs(NFT_COLLECTION_ADDRESS);
  const paths = nfts.map((nft) => {
    return {
      params: {
        contractAddress: NFT_COLLECTION_ADDRESS,
        tokenId: nft.metadata.id,
      },
    };
  });
  // Add for sample nft
  return {
    paths,
    fallback: "blocking", // can also be true or 'blocking'
  };
};
