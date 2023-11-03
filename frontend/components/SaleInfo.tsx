import React from "react";
import { NFT } from "@thirdweb-dev/sdk";
import { FaEthereum } from "react-icons/fa";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import {
  Web3Button,
  useContract,
  useCreateDirectListing,
  useValidDirectListings,
} from "@thirdweb-dev/react";
import { MARKETPLACE_ADDRESS, NFT_COLLECTION_ADDRESS } from "../const/addresses";
import {
  Box,
  Flex,
  Icon,
  Input,
  Skeleton,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";

type Props = {
  nft: NFT;
};

type DirectFormData = {
  nftContractAddress: string;
  tokenId: string;
  price: string;
  startDate: Date;
  endDate: Date;
};

export default function SaleInfo({ nft }: Props) {
  const router = useRouter();
  const { contract: marketplace } = useContract(MARKETPLACE_ADDRESS, "marketplace-v3");
  const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS);
  const { mutateAsync: createDirectListing } = useCreateDirectListing(marketplace);
  const { data: directListings, isLoading } = useValidDirectListings(marketplace, {
    tokenContract: NFT_COLLECTION_ADDRESS,
    tokenId: nft.metadata.id,
  });

  const isListed = false; // TODO: check if this NFT is listed

  async function checkAndProvideApproval() {
    const hasApproval = await nftCollection?.call("isApprovedForAll", [
      nft.owner,
      MARKETPLACE_ADDRESS,
    ]);

    if (!hasApproval) {
      const txResult = await nftCollection?.call("setApprovalForAll", [MARKETPLACE_ADDRESS, true]);
      if (txResult) {
        console.log("Approval provided");
      }
    }
    return true;
  }

  async function handleSubmitDirectListing(data: DirectFormData) {
    await checkAndProvideApproval();
    const txResult = await createDirectListing({
      assetContractAddress: data.nftContractAddress,
      tokenId: data.tokenId,
      pricePerToken: data.price,
      startTimestamp: new Date(data.startDate),
      endTimestamp: new Date(data.endDate),
    });

    return txResult;
  }

  return (
    <Tabs>
      <TabList>
        <Tab>Direct</Tab>
        <Tab>Auction</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          {isLoading ? (
            <Skeleton height={"300px"} width={"100%"} />
          ) : !isListed ? (
            <SaleCreateListingCard
              nft={nft}
              onSubmitAsync={handleSubmitDirectListing}
              onSuccess={(txResult) => {
                router.push(`/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`);
              }}
            />
          ) : (
            <VStack>
              <Text fontSize={"md"}>You have listed this NFT!</Text>
              <Web3Button
                contractAddress={MARKETPLACE_ADDRESS}
                action={async () => {
                  console.log("Web3Button in [tokenId].tsx submitted but not doing anything...");
                  // TODO: cancel listing
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
          )}
        </TabPanel>
        <TabPanel>
          <Text fontSize={"md"}>Work in Progress. Auction feature coming soon.</Text>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

type SaleCreateListingProp = {
  nft: NFT;
  onSubmitAsync: (data: DirectFormData) => Promise<any>;
  onSuccess: (txResult: any) => void;
};

const SaleCreateListingCard = ({ nft, onSubmitAsync, onSuccess }: SaleCreateListingProp) => {
  const { register: registerForm, handleSubmit: onSubmitForm } = useForm<DirectFormData>({
    defaultValues: {
      nftContractAddress: NFT_COLLECTION_ADDRESS,
      tokenId: nft.metadata.id,
      price: "0",
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  return (
    <Stack spacing={8}>
      <Box>
        <Text>Listing starts on:</Text>
        <Input
          placeholder="Select Date and Time"
          size="md"
          type="datetime-local"
          {...registerForm("startDate")}
        />
        <Text mt={2}>Listing ends on:</Text>
        <Input
          placeholder="Select Date and Time"
          size="md"
          type="datetime-local"
          {...registerForm("endDate")}
        />
      </Box>
      <Box>
        <Text fontWeight={"bold"}>Price:</Text>
        <Flex direction={"row"}>
          <Input placeholder="0" size="md" type="number" {...registerForm("price")} />
          <Icon as={FaEthereum} ml={2} mt={2} w={6} h={6} />
          <Text ml={2} mt={2} fontSize={"md"}>
            ETH
          </Text>
        </Flex>
      </Box>
      <Web3Button
        contractAddress={MARKETPLACE_ADDRESS}
        action={async () => {
          await onSubmitForm(onSubmitAsync)();
        }}
        onSuccess={(txResult) => {
          onSuccess(txResult);
        }}
      >
        Create Direct Listing
      </Web3Button>
    </Stack>
  );
};
