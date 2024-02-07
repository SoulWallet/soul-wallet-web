import React, {
  useState,
  useRef,
  useImperativeHandle,
  useCallback,
  useEffect,
  Fragment
} from 'react'
import {
  Box,
  Text,
  Image,
  useToast,
  Select,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody
} from '@chakra-ui/react'
import TextBody from '@/components/new/TextBody'
import Title from '@/components/new/Title'
import ArrowRightIcon from '@/components/Icons/ArrowRight'
import ImportIcon from '@/components/Icons/Auth/Import'
import Button from '@/components/Button'
import { getChainInfo } from '@/lib/tools';
import IconOp from '@/assets/chains/op.svg';
import IconArb from '@/assets/chains/arb.svg';
import IconEth from '@/assets/chains/eth.svg';
import { createConfig, http, useBalance } from 'wagmi';
import { sepolia, arbitrumSepolia, optimismSepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { ethers } from 'ethers';
import BN from 'bignumber.js';

const getChainIcon = (chainId: any) => {
  if (chainId == '0xaa36a7') {
    return IconEth
  } else if (chainId == '0x66eee') {
    return IconArb
  } else if (chainId == '0xaa37dc') {
    return IconOp
  }

  return IconEth
}

const config = createConfig({
  chains: [sepolia, arbitrumSepolia, optimismSepolia],
  transports: {
    [sepolia.id]: http(),
    [arbitrumSepolia.id]: http(),
    [optimismSepolia.id]: http(),
  },
  connectors: [
    injected(),
    walletConnect({
      projectId: import.meta.env.VITE_WALLETCONNECT_ID,
    }),
  ],
});

export default function SelectAccountModal({ isOpen, onClose, startImportAccount, activeLoginAccount, importWallet, isImporting }: any) {
  const [selectedAddress, setSelectedAddress] = useState()
  const [chainId, setChainId] = useState<any>('0xaa36a7')
  const chainIds = ['0xaa36a7', '0x66eee']
  const currentBalance = useBalance({
    address: activeLoginAccount && activeLoginAccount[chainId],
    chainId: Number(chainId),
  })
  console.log('currentBalance', currentBalance, activeLoginAccount)

  useEffect(() => {
    const getBalances = async () => {
      if (activeLoginAccount) {
        const balanceMap = {}

        for (const chainId of chainIds) {
          /* const address = activeLoginAccount[chainId]
           * const balance = getBalance(config, { address })
           * balanceMap[chainId] = balance
           * console.log('balance', chainId, balance) */
        }

        // setBalanceMap(balanceMap)
      }
    }
  }, [activeLoginAccount])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent background="white" maxW="840px" borderRadius="20px">
        <ModalHeader
          display="flex"
          justifyContent="flex-start"
          gap="5"
          fontWeight="800"
          textAlign="center"
          // borderBottom="1px solid #d7d7d7"
          padding="20px 32px"
        >
          Select a wallet
        </ModalHeader>
        <ModalCloseButton top="14px" />
        <ModalBody overflow="auto" padding="20px 32px">
          <Box
            background="white"
            height="100%"
            roundedBottom="20px"
            display="flex"
          >
            <Box width="100%">
              <Title type="t2" marginBottom="20px" fontWeight="500">
                Multiple wallets found under this signer, please select to login
              </Title>
              <Box width="100%" display="flex" flexWrap="wrap">
                <Box borderRadius="12px" padding="24px" width="100%" marginBottom="24px" border={'2px solid black'} onClick={() => { setSelectedAddress(activeLoginAccount && activeLoginAccount[chainId])}} cursor="pointer">
                  <Title fontSize="18px">Wallet _1</Title>
                  {!!activeLoginAccount && (
                    <Fragment>
                      <Box display="flex" marginTop="18px">
                        {chainIds.map((id: any) =>
                          <Box marginRight="11px" borderBottom={id === chainId ? '2px solid black' : 'none'} opacity={id === chainId ? '1' : '0.5'} paddingBottom="10px" cursor="pointer" onClick={() => setChainId(id)}>
                            <Image width="22px" height="22px" src={getChainIcon(id)} borderRadius="100%" />
                          </Box>
                        )}
                      </Box>
                      <Box background="rgba(236, 236, 236, 0.3)" borderRadius="12px" padding="14px" marginTop="14px">
                        <TextBody fontWeight="normal">ETH Address: {activeLoginAccount[chainId]}</TextBody>
                        <TextBody fontWeight="normal">Balance ≈ {(currentBalance && currentBalance.data && currentBalance.data.formatted) || 0} ETH</TextBody>
                      </Box>
                    </Fragment>
                  )}
                </Box>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="10px">
                <TextBody
                  fontSize="18px"
                  display="flex"
                  alignItems="center"
                  onClick={startImportAccount}
                  cursor="pointer"
                >
                  <Box marginRight="5px">
                    <ImportIcon />
                  </Box>
                  Import account
                </TextBody>
                <Button
                  type="black"
                  color="white"
                  padding="0 20px"
                  disabled={!selectedAddress || !!isImporting}
                  isLoading={isImporting}
                  onClick={() => importWallet(activeLoginAccount[chainId])}
                  size="xl"
                >
                  Go to my wallet
                </Button>
              </Box>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
