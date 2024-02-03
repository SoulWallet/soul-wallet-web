import { useState, useCallback, Fragment } from 'react';
import Header from '@/components/Header';
import { SectionMenu, SectionMenuItem } from '@/components/new/SectionMenu';
import RoundSection from '@/components/new/RoundSection';
import SignerCard from '@/components/new/SignerCard';
import GuardianCard from '@/components/new/GuardianCard';
import { Box, Menu, MenuList, MenuButton, MenuItem } from '@chakra-ui/react';
import SetSignerModal from '@/pages/security_new/SetSignerModal';
import SelectSignerTypeModal from '@/pages/security_new/SelectSignerTypeModal';
import SelectGuardianTypeModal from '@/pages/security_new/SelectGuardianTypeModal';
import IntroGuardianModal from '@/pages/security_new/IntroGuardianModal';
import EditGuardianModal from '@/pages/security_new/EditGuardianModal';
import BackupGuardianModal from '@/pages/security_new/BackupGuardianModal';
import WalletConnectModal from '@/pages/security_new/WalletConnectModal';
import Button from '@/components/new/Button';
import TextButton from '@/components/new/TextButton';
import PlusIcon from '@/components/Icons/Plus';
import HistoryIcon from '@/components/Icons/History';
import Title from '@/components/new/Title';
import TextBody from '@/components/new/TextBody';
import DropDownIcon from '@/components/Icons/DropDown';
import useBrowser from '@/hooks/useBrowser';
import DashboardLayout from '@/components/Layouts/DashboardLayout';
import { useSignerStore } from '@/store/signer';
import { toShortAddress } from '@/lib/tools';

export default function Signer() {
  const { navigate } = useBrowser();
  const [activeSection, setActiveSection] = useState<string>('signer');
  const [signerIdToSet, setSignerIdToSet] = useState('');
  const { eoas, credentials, signerId } = useSignerStore();
  const [isSetDefaultOpen, setIsSetDefaultOpen] = useState<any>(false);
  const [isChooseSignerOpen, setIsChooseSignerOpen] = useState<any>(false);
  const [isSelectGuardianOpen, setIsSelectGuardianOpen] = useState<any>(false);
  const [isIntroGuardianOpen, setIsIntroGuardianOpen] = useState<any>(false);
  const [isEditGuardianOpen, setIsEditGuardianOpen] = useState<any>(false);
  const [isBackupGuardianOpen, setIsBackupGuardianOpen] = useState<any>(false);
  const [isWalletConnectOpen, setIsWalletConnectOpen] = useState<any>(false);

  console.log('s', signerId);
  const openSetDefaultModal = useCallback(() => {
    setIsSetDefaultOpen(true);
  }, []);

  const closeSetDefaultModal = useCallback(() => {
    setIsSetDefaultOpen(false);
  }, []);

  const openChooseSignerModal = useCallback(() => {
    setIsChooseSignerOpen(true);
  }, []);

  const closeChooseSignerModal = useCallback(() => {
    setIsChooseSignerOpen(false);
  }, []);

  const openWalletConnectModal = useCallback(() => {
    setIsWalletConnectOpen(true);
  }, []);

  const closeWalletConnectModal = useCallback(() => {
    setIsWalletConnectOpen(false);
  }, []);

  const openSelectGuardianModal = useCallback(() => {
    setIsSelectGuardianOpen(true);
  }, []);

  const closeSelectGuardianModal = useCallback(() => {
    setIsSelectGuardianOpen(false);
  }, []);

  const openIntroGuardianModal = useCallback(() => {
    setIsIntroGuardianOpen(true);
  }, []);

  const closeIntroGuardianModal = useCallback(() => {
    setIsIntroGuardianOpen(false);
  }, []);

  const openEditGuardianModal = useCallback(() => {
    setIsEditGuardianOpen(true);
  }, []);

  const closeEditGuardianModal = useCallback(() => {
    setIsEditGuardianOpen(false);
  }, []);

  const openBackupGuardianModal = useCallback(() => {
    setIsBackupGuardianOpen(true);
  }, []);

  const closeBackupGuardianModal = useCallback(() => {
    setIsBackupGuardianOpen(false);
  }, []);

  return (
    <Fragment>
      <Box display="flex" flexDirection="column" padding="0 40px" pt="6">
        <SectionMenu>
          <SectionMenuItem isActive={activeSection == 'signer'} onClick={() => navigate('/security/signer')}>
            Signer
          </SectionMenuItem>
          <SectionMenuItem isActive={activeSection == 'guardian'} onClick={() => navigate('/security/guardian')}>
            Guardian
          </SectionMenuItem>
        </SectionMenu>
        <RoundSection marginTop="10px" background="white">
          {activeSection === 'signer' && (
            <Fragment>
              <Box fontFamily="Nunito" fontWeight="700" fontSize="18px" display="flex">
                <Box>My Signers</Box>
                <Box marginLeft="auto">
                  <Button type="mid" onClick={openChooseSignerModal}>
                    <Box marginRight="6px">
                      <PlusIcon color="white" />
                    </Box>
                    Add signer
                  </Button>
                </Box>
              </Box>
              <Box paddingTop="14px" display="flex">
                {eoas.map((item) => (
                  <SignerCard
                    name={`EOA: ${toShortAddress(item, 4, 4)}`}
                    address={item}
                    time="Added on 2023-12-14"
                    marginRight="18px"
                    isDefault={signerId === item}
                    cursor="pointer"
                    {...(signerId !== item
                      ? {
                          onClick: () => {
                            setSignerIdToSet(item);
                            openSetDefaultModal();
                          },
                        }
                      : {})}
                  />
                ))}
                {credentials.map((item: any, index: number) => (
                  <SignerCard
                    name={`Passkey_${index + 1}`}
                    address={item.id}
                    device="Chrome profile"
                    time="Added on 2023-12-14 "
                    cursor="pointer"
                    marginRight="18px"
                    isDefault={signerId === item.id}
                    {...(signerId !== item.id
                      ? {
                          onClick: () => {
                            setSignerIdToSet(item.id);
                            openSetDefaultModal();
                          },
                        }
                      : {})}
                  />
                ))}
              </Box>
            </Fragment>
          )}
        </RoundSection>
      </Box>
      <SetSignerModal isOpen={isSetDefaultOpen} signerIdToSet={signerIdToSet} onClose={closeSetDefaultModal} />
      <SelectSignerTypeModal
        isOpen={isChooseSignerOpen}
        onClose={closeChooseSignerModal}
        startWalletConnect={openWalletConnectModal}
      />
      <SelectGuardianTypeModal
        isOpen={isSelectGuardianOpen}
        onClose={closeSelectGuardianModal}
        setIsIntroGuardianOpen={setIsIntroGuardianOpen}
        setIsSelectGuardianOpen={setIsSelectGuardianOpen}
        setIsEditGuardianOpen={setIsEditGuardianOpen}
      />
      <IntroGuardianModal isOpen={isIntroGuardianOpen} onClose={closeIntroGuardianModal} />
      <EditGuardianModal isOpen={isEditGuardianOpen} onClose={closeEditGuardianModal} />
      <BackupGuardianModal isOpen={isBackupGuardianOpen} onClose={closeBackupGuardianModal} />
      <WalletConnectModal isOpen={isWalletConnectOpen} onClose={closeWalletConnectModal} />
    </Fragment>
  );
}
