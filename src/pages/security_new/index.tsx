import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import { SectionMenu, SectionMenuItem } from '@/components/new/SectionMenu';
import RoundSection from '@/components/new/RoundSection'
import SignerCard from '@/components/new/SignerCard'
import { Box } from '@chakra-ui/react'
import SetSignerModal from '@/pages/security_new/SetSignerModal'

export default function Security() {
  const [activeSection, setActiveSection] = useState<string>('signer');
  const [isSetDefaultOpen, setIsSetDefaultOpen] = useState<any>(false);

  const openSetDefaultModal = useCallback(() => {
    setIsSetDefaultOpen(true)
  }, [])

  const closeSetDefaultModal = useCallback(() => {
    setIsSetDefaultOpen(false)
  }, [])

  return (
    <Box width="100%" height="100vh">
      <Box height="102px">
        <Header />
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        padding="0 40px"
      >
        <SectionMenu>
          <SectionMenuItem
            isActive={activeSection == 'signer'}
            onClick={() => setActiveSection('signer')}
          >
            Signer
          </SectionMenuItem>
          <SectionMenuItem
            isActive={activeSection == 'guardian'}
            onClick={() => setActiveSection('guardian')}
          >
            Guardian
          </SectionMenuItem>
        </SectionMenu>
        <RoundSection marginTop="10px" background="white">
          <Box fontFamily="Nunito" fontWeight="700" fontSize="18px">My Signers</Box>
          <Box paddingTop="14px" display="flex">
            <SignerCard
              name="Wallet (...dS123)"
              address="0xAAAA12345678E25FDa5f8a56B8e267fDaB6dS123"
              time="Added on 2023-12-14"
              marginRight="18px"
              isDefault="true"
              cursor="pointer"
              onClick={openSetDefaultModal}
            />
            <SignerCard
              name="Passkey_1"
              address="Wallet_1-2023-12-28-11:12:13"
              device="Chrome profile"
              time="Added on 2023-12-14 "
              cursor="pointer"
              onClick={openSetDefaultModal}
            />
          </Box>
        </RoundSection>
      </Box>
      <SetSignerModal
        isOpen={isSetDefaultOpen}
        onClose={closeSetDefaultModal}
      />
    </Box>
  );
}
