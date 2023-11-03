import type { AppProps } from "next/app";
import { ThirdwebProvider, coinbaseWallet, metamaskWallet } from "@thirdweb-dev/react";
import { ChakraProvider } from "@chakra-ui/react";
import "../styles/globals.css";
import { Navbar } from "../components/Navbar";
import { ACTIVE_NETWORK, THIRDWEB_CLIENT_ID } from "../const/addresses";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = ACTIVE_NETWORK;

function DApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId={THIRDWEB_CLIENT_ID}
      activeChain={activeChain}
      supportedWallets={[
        metamaskWallet({ recommended: true }),
        coinbaseWallet({ recommended: true }),
      ]}
    >
      <ChakraProvider>
        <Navbar />
        <Component {...pageProps} />
      </ChakraProvider>
    </ThirdwebProvider>
  );
}

export default DApp;
