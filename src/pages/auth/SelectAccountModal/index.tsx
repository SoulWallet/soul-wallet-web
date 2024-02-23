import {
  useState,
  useEffect,
  useCallback,
  Fragment
} from 'react'
import {
  Box,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody
} from '@chakra-ui/react'
import TextBody from '@/components/new/TextBody'
import Title from '@/components/new/Title'
import ImportIcon from '@/components/Icons/Auth/Import'
import Button from '@/components/Button'
import IconOp from '@/assets/chains/op.svg';
import IconArb from '@/assets/chains/arb.svg';
import IconEth from '@/assets/chains/eth.svg';
import { createConfig, http, useBalance } from 'wagmi';
import { sepolia, arbitrumSepolia, optimismSepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

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

function AccountCard({ i, id, isSelected, account, selectAccount }: any) {
  const [chainId, setChainId] = useState<any>('0xaa36a7')
  const chainIds = ['0xaa36a7', '0x66eee']
  const currentBalance = useBalance({
    address: account && account[chainId],
    chainId: Number(chainId),
  })

  return (
    <Box borderRadius="12px" padding="24px" width="100%" marginBottom="24px" border={isSelected ? '2px solid black' : '2px solid rgba(0, 0, 0, 0.1)'} onClick={() => selectAccount(account, i)} cursor="pointer">
      <Title fontSize="18px">Wallet _{i}</Title>
      <Fragment>
        <Box display="flex" marginTop="18px">
          {chainIds.map((id: any) =>
            <Box marginRight="11px" borderBottom={id === chainId ? '2px solid black' : 'none'} opacity={id === chainId ? '1' : '0.5'} paddingBottom="10px" cursor="pointer" onClick={() => setChainId(id)}>
              <Image width="22px" height="22px" src={getChainIcon(id)} borderRadius="100%" />
            </Box>
          )}
        </Box>
        <Box background="rgba(236, 236, 236, 0.3)" borderRadius="12px" padding="14px" marginTop="14px">
          <TextBody fontWeight="normal">ETH Address: {account[chainId]}</TextBody>
          <TextBody fontWeight="normal">Balance ≈ {(currentBalance && currentBalance.data && currentBalance.data.formatted) || 0} ETH</TextBody>
        </Box>
      </Fragment>
    </Box>
  )
}

export default function SelectAccountModal({ isOpen, onClose, startImportAccount, activeLoginAccounts, importWallet, isImporting }: any) {
  const [selectedAccount, setSelectedAccount] = useState()
  const [selectedAccountIndex, setSelectedAccountIndex] = useState(-1)

  console.log('signerIdAddress activeLoginAccounts', activeLoginAccounts);

  const selectAccount = useCallback((account: any, i: number) => {
    setSelectedAccount(account)
    setSelectedAccountIndex(i)
  }, [selectedAccount])

  const confirmImport = useCallback(() => {
    importWallet(Object.values(selectedAccount as any)[0])
  }, [selectedAccount])

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
              <Box width="100%" display="flex" flexWrap="wrap" maxHeight="500px" overflowY="auto">
                {!!activeLoginAccounts && activeLoginAccounts.map((account: any, i: number) => {
                  const isSelected = i === selectedAccountIndex

                  return (
                    <AccountCard key={i} i={i} isSelected={isSelected} account={account} selectAccount={selectAccount} />
                  )
                })}
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
                  disabled={!selectedAccount || !!isImporting}
                  isLoading={isImporting}
                  onClick={confirmImport}
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
