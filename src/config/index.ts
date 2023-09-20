import IconTwitter from "@/assets/socials/twitter.svg";
import IconTelegram from "@/assets/socials/telegram.svg";
import IconGithub from "@/assets/socials/github.svg";
import IconOp from "@/assets/chains/op.svg";
import IconArb from "@/assets/chains/arb.svg";
import IconEth from "@/assets/chains/eth.svg";
import ArbConfig from "./chains/arb-goerli";
import OpConfig from "./chains/op-goerli";
import GoerliConfig from "./chains/goerli";

export const chainIdMapping = {
    1: "ETH Mainnet",
    5: "Goerli",
    42: "KOVAN",
    56: "BSC Mainnet",
    128: "HECO Mainnet",
    97: "BSC Testnet",
    420: "Optimism Goerli",
    421613: "Arbitrum Goerli",
};

// get all chainId mapping, especially for switch chain.
export const chainMapping = {
    "0x1": {
        icon: IconEth,
        name: "Ethereum",
    },
    "0x5": {
        icon: IconEth,
        name: "Goerli",
    },
    "0xa": {
        icon: IconOp,
        name: "Optimism",
    },
    "0x1a4": {
        icon: IconOp,
        name: "Optimism Goerli",
    },
    "0xa4b1": {
        icon: IconArb,
        name: "Arbitrum",
    },
    "0x66eed": {
        icon: IconArb,
        name: "Arbitrum Goerli",
    },
};

export default {
    walletName: "Soul Wallet",
    faviconUrl: "https://www.google.com/s2/favicons?domain=",
    socials: [
        {
            icon: IconTwitter,
            link: "https://twitter.com/soulwallet_eth",
        },
        {
            icon: IconTelegram,
            link: "https://t.me/+XFUHusXFdTYyODQ9",
        },
        {
            icon: IconGithub,
            link: "https://github.com/proofofsoulprotocol",
        },
    ],
    magicValue: "0x1626ba7e",
    backendURL: "https://api-dev.soulwallet.io/appapi",
    soulScanURL: "https://api-dev.soulwallet.io/opapi",
    officialWebUrl: import.meta.env.VITE_OFFICIAL_WEB_URL,
    /* @vite-ignore */
    chainList: [
      ArbConfig,
      OpConfig,
      GoerliConfig,
    ],
};
