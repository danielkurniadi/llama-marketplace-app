# Llama Marketplace for NFTs

This dApp is my final project for the 2022 Base Blockchain Developer
Bootcamp. It [is deployed here](#) (), and
a screencast of me going through the code and interface
[may be found here](#) (TODO).

The main contract is [deployed on Base Goerli Chain](https://goerli.basescan.org/address/0x2Fe205E647D85bB692242ebE578ca4f8f6f87664) (TODO),
though it is mainly interacted with by users going through the frontend application.

Once the course is over, I'd like my certification NFT to be sent to
[danielkurniadi.cb.id](https://goerli.basescan.org/address/0x559B56eE5501931fbD779103cD9b5E1104167408).

## Overview

Llama Marketplace is a web decentralised application that where NFT creators and
buyers can transact and exchange NFT arts (mainly image art for now). Creators can
also mint tokens and add it to their collection of NTFs.

## Directory Structure

### Top-level:

```
./
├── docs         # Documentation supporting README.md
├── frontend     # The frontend project (Typscript).
├── README.md    # README documentation.
├── scripts      # Scripts helper to deploy.
└── web3         # Smart contracts bootstrapped with thirdweb (Typescript)

. LICENSE
. DEPLOYED_ADDRESS.tst
```

### Frontend:

Created by using thirdweb create command and use `next-typescript-starter` template:

```bash
npx thirdweb create --app --template next-typescript-starter
```

The project structure in Next.js is slightly different than normal Javascript codebase, where there is no `src` module
at all. Instead, the modules hierarchy is flat and straight to the point.

```
frontend/
├── api          # Helpers to interact with Web3 deployed contract.
├── assets       # Static assets used in the React.js components.
├── components   # React.js components to be rendered.
├── const        # Constants. Contain NFT deployed contract addresses.
├── hooks        # React hooks for managing isolated states.
├── pages        # Next.js page corresponding to the website URL path.
├── styles       # Global base CSS styles.
  tsconfig.json
  package.json
  yarn.lock
  README.md
```

### Web 3

Create by using thirdweb create command and use `hardhat-typescript` template:

```bash
npx thirdweb create --contract --template hardhat-typescript
```

The project structure in Next.js is slightly different than normal Javascript codebase, where there is no `src` module
at all. Instead, the modules hierarchy is flat and straight to the point.

```
web3/
├── contracts        # Solidity smart contracts interface and implementation.
  hardhat.config.ts  # Configuration for hardhat to compile the smart contracts.
  tsconfig.json
  package.json
  yarn.lock
  README.md
```

## Setup and Run

### Frontend

Navigate to the `frontend/` folder and do the following instruction.
More detail of the setup in [frontend/README.md](./frontend/README.md)

First, install dependencies:
```bash
    # All the frontend command is in frontend/ folder.
    $ cd frontend
    $ yarn install
```

To run the application in developer mode (with hot-reload):
```
$ yarn dev
```

Or you can also use
```
$ yarn start
```

To deploy a copy of your application to IPFS, use the following command:

```bash
yarn deploy
```

Then visit [http://localhost:3000](http://localhost:3000) in a browser with either Coinbase wallet or Metamask installed.

### Modifying / Extending this example

#### Using your own Smart Contract

In the `const/addresses.ts` you can see that the following
smart contract addresses constants has been set for you.
Feel free to deploy your own marketplace and NFT smart contracts
and use it in to interact with this frontend.

| NAME | DEFAULT VALUE | REMARK |
| ---  | ---           | ------------------- |
| `NFT_COLLECTION_ADDRESS` | 0x16433D082e8b7F8514FAcbB3c066bcD751769b67 | TODO |

#### Add support for your wallets

To add support for your wallet other than Coinbase wallet or Metamask. Add the wallets method in the `pages/_app.tsx` in the `ConnectWallet` component.

`ConnectWallet` component renders a button which when clicked opens a modal to allow users to connect to wallets specified in the ThirdwebProvider's supportedWallets prop.

See more details [ThirdWeb: ConnectWallet docs](https://portal.thirdweb.com/react/react.connectwallet).

At the time of writing, thirdweb supports

- [MetaMask](https://portal.thirdweb.com/react/react.metamaskwallet)
- [Coinbase Wallet](https://portal.thirdweb.com/react/react.coinbasewallet)
- [WalletConnect](https://portal.thirdweb.com/react/react.rainbowWallet)
- [Rainbow](https://portal.thirdweb.com/react/react.rainbowWallet)
- [Trust Wallet](https://portal.thirdweb.com/react/react.trustWallet)
- [Zerion Wallet](https://portal.thirdweb.com/react/react.zerion)
- [Phantom](https://portal.thirdweb.com/react/react.phantom)

## Web3

Navigate to the `web3/` folder and do the following instruction.
Full detail of the setup in [web3/README.md](./web3/README.md).

### Deploying Contracts

When you're ready to deploy your contracts, just run one of the following command to deploy you're contracts:

```bash
npm run deploy
# or
yarn deploy
```

### Releasing Contracts

If you want to release a version of your contracts publicly, you can use one of the followings command:

```bash
npm run release
# or
yarn release
```

## Contributing

Currently, this repository does not support contributing. I might archieve it soon as I might not be working on it full time past the 2023 Base Bootcamp graduation.

If you are keen to go further, kindly fork and help cite this repository

```latex
@misc{danielkurniadi,
  author = {Daniel},
  title = {Llama Marketplace dApp},
  year = {2023},
  publisher = {GitHub},
  journal = {GitHub repository},
  howpublished = {\url{https://github.com/danielkurniadi/llama-marketplace-app}},
  commit = {master}
}
```
