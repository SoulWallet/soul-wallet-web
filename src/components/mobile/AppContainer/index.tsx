import { Flex, Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure } from '@chakra-ui/react';
import { headerHeight, tgLink } from '@/config';
import { Outlet } from 'react-router-dom';
import ProfileIcon from '@/components/Icons/mobile/Profile'
import SettingIcon from '@/components/Icons/mobile/Setting'
import TelegramIcon from '@/components/Icons/mobile/Telegram'
import UserIcon from '@/components/Icons/mobile/User'
import MenuIcon from '@/components/Icons/mobile/Menu'
import { useAddressStore } from '@/store/address';
import Button from '@/components/mobile/Button'
import useWallet from '@/hooks/useWallet';
import AddressIcon from '@/components/AddressIcon';
import useNavigation from '@/hooks/useNavigation'
import Settings from '@/pages/settings'
import Activity from '@/pages/activity'
import Details from '@/pages/dashboard/Details'

export function Header({ openMenu, username, ...props }: any) {
  const { walletName, selectedAddress } = useAddressStore();
  return (
    <Box
      height="44px"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding="0 30px"
      background="white"
      position="relative"
      {...props}
    >
      <Box display="flex" gap="2" alignItems="center" justifyContent="center">
        {/* <AddressIcon address={selectedAddress} width={24} /> */}
        {/* <ProfileIcon /> */}
        <Box fontSize="16px" lineHeight={"20px"} fontWeight="800">{walletName}</Box>
        {/* <Box fontSize="16px" fontWeight="400">{`(${toShortAddress(selectedAddress)})`}</Box> */}
      </Box>
      <Box fontSize="18px" fontWeight="700" color="black" lineHeight="24px">
        <Box background="white" height="36px" width="36px" borderRadius="36px" display="flex" alignItems="center" justifyContent="center" onClick={openMenu}>
          <UserIcon />
        </Box>
      </Box>
    </Box>
  );
}

export default function AppContainer() {
  const { isModalOpen, openModal, closeModal, activeModal } = useNavigation()
  const { logoutWallet } = useWallet();
  const innerHeight = window.innerHeight
  const contentHeight = innerHeight - 64
  const marginHeight = innerHeight - 250
  console.log('isModalOpen', isModalOpen)

  const doLogout = async () => {
    logoutWallet();
  }

  const getContentStyles = (isOpen: any) => {
    if (isOpen) {
      return {
        'transform': 'perspective(1500px) translateZ(-120px)',
        'transform-style': 'preserve-3d',
        'border-radius': '20px'
      }
    }

    return {}
  }

  const renderModal = (name: any) => {
    if (name === 'settings') {
      return <Settings />
    } else if (name === 'activity') {
      return <Activity />
    } else if (name === 'details') {
      return <Details />
    }
  }

  return (
    <Box background="black">
      <Box
        height={innerHeight}
        background="linear-gradient(180deg, #F5F6FA 0%, #EEF2FB 100%)"
        transition="all 0.2s ease"
        sx={getContentStyles(isModalOpen)}
      >
        <Header
          showLogo
          paddingTop="10px"
          paddingBottom="10px"
          height="64px"
          background="transparent"
          openMenu={() => openModal('settings')}
        />
        <Flex
          h={contentHeight}
          flexDir={{ base: 'column', lg: 'row' }}
          gap={{ base: 6, md: 8, lg: '50px' }}
          overflow="auto"
          paddingTop="0"
        >
          <Box w="100%">
            <Outlet context={[openModal]} />
          </Box>
        </Flex>
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          motionPreset="slideInBottom"
          blockScrollOnMount={true}
        >
          <ModalOverlay />
          <ModalContent
            zIndex="2"
            borderRadius={{
              sm: '20px 20px 0 0',
              // md: '20px',
            }}
            maxW={{
              sm: '100vw',
              md: '430px'
            }}
            marginTop={{
              sm: `56px`,
              // md: 'calc(50vh - 125px)'
            }}
            mb="0"
            height={{
              sm: contentHeight,
              // md: '250px'
            }}
            overflow="auto"
          >
            <Box tabIndex={0} />
            <ModalCloseButton />
            <ModalBody
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="flex-start"
              width="100%"
            >
              {renderModal(activeModal)}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}
