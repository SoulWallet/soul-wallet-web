import { Flex, Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure } from '@chakra-ui/react';
import { headerHeight, tgLink } from '@/config';
import { Outlet } from 'react-router-dom';
import ProfileIcon from '@/components/Icons/mobile/Profile'
import SettingIcon from '@/components/Icons/mobile/Setting'
import TelegramIcon from '@/components/Icons/mobile/Telegram'
import MenuIcon from '@/components/Icons/mobile/Menu'
import { useAddressStore } from '@/store/address';
import Button from '@/components/mobile/Button'
import useWallet from '@/hooks/useWallet';
import AddressIcon from '@/components/AddressIcon';

export function Header({ openMenu, username, ...props }: any) {
  const { walletName, selectedAddress } = useAddressStore();
  return (
    <Box
      height="44px"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding="0 20px"
      background="white"
      position="relative"
      {...props}
    >
      <Box display="flex" gap="2" alignItems="center" justifyContent="center">
          <AddressIcon address={selectedAddress} width={24} />
          {/* <ProfileIcon /> */}
        <Box fontSize="16px" lineHeight={"20px"} fontWeight="800">{walletName}</Box>
        {/* <Box fontSize="16px" fontWeight="400">{`(${toShortAddress(selectedAddress)})`}</Box> */}
      </Box>
      <Box fontSize="18px" fontWeight="700" color="black" lineHeight="24px">
        <Box background="white" height="36px" width="36px" borderRadius="36px" display="flex" alignItems="center" justifyContent="center" onClick={openMenu}>
          <MenuIcon />
        </Box>
      </Box>
    </Box>
  );
}

export default function AppContainer() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { logoutWallet } = useWallet();
  const innerHeight = window.innerHeight
  const contentHeight = innerHeight - 64
  const marginHeight = innerHeight - 250

  const doLogout = async () => {
    logoutWallet();
  }

  return (
    <Box background="linear-gradient(180deg, #F5F6FA 0%, #EEF2FB 100%)">
      <Header
        showLogo
        paddingTop="10px"
        paddingBottom="10px"
        height="64px"
        background="transparent"
        openMenu={onOpen}
      />
      <Flex
        h={contentHeight}
        flexDir={{ base: 'column', lg: 'row' }}
        gap={{ base: 6, md: 8, lg: '50px' }}
      >
        <Box w="100%">
          <Outlet />
        </Box>
      </Flex>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        blockScrollOnMount={true}
      >
        <ModalOverlay />
        <ModalContent
          borderRadius="20px 20px 0 0"
          maxW="100vw"
          height="250px"
          overflow="auto"
          mb="0"
          marginTop={`${marginHeight}px`}
        >
          <Box tabIndex={0} />
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="flex-start"
            width="100%"
            paddingTop="34px"
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              width="100%"
              marginTop="10px"
            >
              <Box
                width="100%"
                fontSize="16px"
                fontWeight="700"
                py="10px"
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
              >
                <Box
                  marginRight="12px"
                  height="32px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <SettingIcon />
                </Box>
                <Box>Recovery Setting</Box>
                <Box
                  marginLeft="auto"
                  background="#F2F2F2"
                  padding="3px 8px"
                  fontSize="12px"
                  fontWeight="400"
                  rounded="4px"
                >
                  Coming soon
                </Box>
              </Box>
              <a target='_blank' href={tgLink} style={{width: "100%"}}>
                <Box
                  width="100%"
                  fontSize="16px"
                  fontWeight="700"
                  py="10px"
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <Box
                    marginRight="12px"
                    height="32px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <TelegramIcon />
                  </Box>
                  <Box>Join Telegram group</Box>
                </Box>
              </a>
            </Box>
            <Box width="100%" marginTop="20px">
              <Button
                size="xl"
                width="100%"
                background="#F2F2F2"
                color="#E83D26"
                onClick={doLogout}
                _hover={{ background: '#F2F2F2' }}
              >
                Logout
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
