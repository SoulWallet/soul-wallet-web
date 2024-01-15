import { useState, useCallback, Fragment } from 'react';
import Header from '@/components/Header';
import { SectionMenu, SectionMenuItem } from '@/components/new/SectionMenu';
import RoundSection from '@/components/new/RoundSection'
import SignerCard from '@/components/new/SignerCard'
import GuardianCard from '@/components/new/GuardianCard'
import { Box, Menu, MenuList, MenuButton, MenuItem } from '@chakra-ui/react'
import SetSignerModal from '@/pages/security_new/SetSignerModal'
import ChooseSignerTypeModal from '@/pages/security_new/ChooseSignerTypeModal'
import WalletConnectModal from '@/pages/security_new/WalletConnectModal'
import Button from '@/components/new/Button'
import PlusIcon from '@/components/Icons/Plus';
import Title from '@/components/new/Title'
import TextBody from '@/components/new/TextBody'
import DropDownIcon from '@/components/Icons/DropDown';

export default function Security() {
  const [keepPrivate, setKeepPrivate] = useState<any>(false);
  const [activeSection, setActiveSection] = useState<string>('signer');
  const [isSetDefaultOpen, setIsSetDefaultOpen] = useState<any>(false);
  const [isChooseSignerOpen, setIsChooseSignerOpen] = useState<any>(false);
  const [isWalletConnectOpen, setIsWalletConnectOpen] = useState<any>(false);

  const openSetDefaultModal = useCallback(() => {
    setIsSetDefaultOpen(true)
  }, [])

  const closeSetDefaultModal = useCallback(() => {
    setIsSetDefaultOpen(false)
  }, [])

  const openChooseSignerModal = useCallback(() => {
    setIsChooseSignerOpen(true)
  }, [])

  const closeChooseSignerModal = useCallback(() => {
    setIsChooseSignerOpen(false)
  }, [])

  const openWalletConnectModal = useCallback(() => {
    setIsWalletConnectOpen(true)
  }, [])

  const closeWalletConnectModal = useCallback(() => {
    setIsWalletConnectOpen(false)
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
          {activeSection === 'signer' && (
            <Fragment>
              <Box
                fontFamily="Nunito"
                fontWeight="700"
                fontSize="18px"
                display="flex"
              >
                <Box>My Signers</Box>
                <Box marginLeft="auto">
                  <Button type="mid" onClick={openChooseSignerModal}>
                    <Box marginRight="6px"><PlusIcon color="white" /></Box>
                    Add signer
                  </Button>
                </Box>
              </Box>
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
            </Fragment>
          )}
          {activeSection === 'guardian' && (
            <Fragment>
              <Box
                fontFamily="Nunito"
                fontWeight="700"
                fontSize="18px"
                display="flex"
              >
                <Box>Guardian List</Box>
                <Box marginLeft="auto">
                  <Button type="mid" onClick={openChooseSignerModal}>
                    <Box marginRight="6px"><PlusIcon color="white" /></Box>
                    Add Guardian
                  </Button>
                </Box>
              </Box>
              <Box paddingTop="14px" display="flex">
                <GuardianCard
                  name="Guardiannnnn"
                  address="0xAAAA12345678E25FDa5f8a56B8e267fDaB6dS123"
                  time="Added on 2023-12-14 "
                  marginRight="18px"
                  cursor="pointer"
                  onClick={openSetDefaultModal}
                />
                <GuardianCard
                  name="Soulwallet"
                  address="necklaceeez@gmail.com"
                  time="Added on 2023-12-14"
                  cursor="pointer"
                  onClick={openSetDefaultModal}
                />
              </Box>
              <Box borderTop="1px solid #F0F0F0" marginTop="30px" paddingTop="20px">
                <Title
                  fontFamily="Nunito"
                  fontWeight="700"
                  fontSize="18px"
                  display="flex"
                >
                  Recovery settings
                </Title>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-start"
                  marginTop="10px"
                >
                  <Box
                    fontFamily="Nunito"
                    fontWeight="700"
                    fontSize="14px"
                    marginRight="6px"
                  >
                    Threshold:
                  </Box>
                  <TextBody type="t2" display="flex" alignItems="center" justifyContent="flex-start">
                    <Box>Wallet recovery requires</Box>
                    <Box width="80px" margin="0 10px">
                      <Menu>
                        <MenuButton
                          px={2}
                          py={2}
                          width="80px"
                          transition="all 0.2s"
                          borderRadius="16px"
                          borderWidth="1px"
                          padding="12px"
                          background="white"
                          _hover={{
                            borderColor: '#3182ce',
                            boxShadow: '0 0 0 1px #3182ce',
                          }}
                          _expanded={{
                            borderColor: '#3182ce',
                            boxShadow: '0 0 0 1px #3182ce',
                          }}
                        >
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            0
                            <DropDownIcon />
                          </Box>
                        </MenuButton>
                        <MenuList>
                          <MenuItem>
                            0
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Box>
                    <Box>{`out of 2 guardian(s) confirmation.`}</Box>
                  </TextBody>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-start"
                  marginTop="10px"
                >
                  <Box
                    fontFamily="Nunito"
                    fontWeight="700"
                    fontSize="14px"
                    marginRight="6px"
                  >
                    Advanced:
                  </Box>
                  <TextBody type="t2" display="flex" alignItems="center" justifyContent="flex-start">
                    <Box marginRight="10px">Keep guardians private</Box>
                    <Box width="72px" minWidth="72px" height="40px" background={keepPrivate ? '#1CD20F' : '#D9D9D9'} borderRadius="40px" padding="5px" cursor="pointer" onClick={() => setKeepPrivate(!keepPrivate)} transition="all 0.2s ease" paddingLeft={keepPrivate ? '37px' : '5px'}>
                      <Box width="30px" height="30px" background="white" borderRadius="30px" />
                    </Box>
                  </TextBody>
                </Box>
              </Box>
            </Fragment>
          )}
        </RoundSection>
      </Box>
      <SetSignerModal
        isOpen={isSetDefaultOpen}
        onClose={closeSetDefaultModal}
      />
      <ChooseSignerTypeModal
        isOpen={isChooseSignerOpen}
        onClose={closeChooseSignerModal}
        startWalletConnect={openWalletConnectModal}
      />
      <WalletConnectModal
        isOpen={isWalletConnectOpen}
        onClose={closeWalletConnectModal}
      />
    </Box>
  );
}