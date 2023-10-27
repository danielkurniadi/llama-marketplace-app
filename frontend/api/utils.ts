import { DirectListingV3, EnglishAuction } from "@thirdweb-dev/sdk";

const SECONDS_PER_DAY = 24 * 3600;

type NFTListing = DirectListingV3 | EnglishAuction;

type CurrencyValue = {
  displayValue: string;
  symbol: string;
};

export enum ListingType {
  NotForSale = "Not For Sale",
  DirectListing = "Direct Listing",
  EnglishAuction = "English Auction",
}

const isDirectListing = (listing: NFTListing | undefined): listing is DirectListingV3 => {
  return !!(listing as DirectListingV3)?.currencyValuePerToken;
};

const isAuctionListing = (listing: NFTListing | undefined): listing is EnglishAuction => {
  return !!(listing as EnglishAuction)?.minimumBidCurrencyValue;
};

export function getListingCurrencyValue(
  listing: NFTListing | undefined
): CurrencyValue | undefined {
  if (isDirectListing(listing)) {
    return listing.currencyValuePerToken;
  } else if (isAuctionListing(listing)) {
    return listing.minimumBidCurrencyValue;
  }
  return undefined;
}

export function getListingType(listing: NFTListing | undefined): ListingType {
  if (isDirectListing(listing)) {
    return ListingType.DirectListing;
  } else if (isAuctionListing(listing)) {
    return ListingType.EnglishAuction;
  }
  return ListingType.NotForSale;
}

export function getListingDaysLeft(listing: NFTListing | undefined): number {
  if (!listing) return 0;
  return (listing.endTimeInSeconds - listing.startTimeInSeconds) / SECONDS_PER_DAY;
}
