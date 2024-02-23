import { useState, useCallback, Fragment, useEffect } from 'react';
import { SectionMenu, SectionMenuItem } from '@/components/new/SectionMenu';
import RoundSection from '@/components/new/RoundSection';
import SignerCard from '@/components/new/SignerCard';
import { Box } from '@chakra-ui/react';
import SetSignerModal from '@/pages/security/SetSignerModal';
import SelectSignerTypeModal from '@/pages/security/SelectSignerTypeModal';
import SelectGuardianTypeModal from '@/pages/security/SelectGuardianTypeModal';
import IntroGuardianModal from '@/pages/security/IntroGuardianModal';
import EditGuardianModal from '@/pages/security/EditGuardianModal';
import BackupGuardianModal from '@/pages/security/BackupGuardianModal';
import WalletConnectModal from '@/pages/security/WalletConnectModal';
import useBrowser from '@/hooks/useBrowser';
import { useSignerStore } from '@/store/signer';
import { toShortAddress } from '@/lib/tools';
import useWalletContract from '@/hooks/useWalletContract';

export default function Signer() {
  const { navigate } = useBrowser();
  const [activeSection] = useState<string>('signer');
  const [signerIdToSet, setSignerIdToSet] = useState('');
  const { eoas, credentials, signerId } = useSignerStore();
  const [owners, setOwners] = useState([]);
  const [isSetDefaultOpen, setIsSetDefaultOpen] = useState<any>(false);
  const [isChooseSignerOpen, setIsChooseSignerOpen] = useState<any>(false);
  const [isSelectGuardianOpen, setIsSelectGuardianOpen] = useState<any>(false);
  const [isIntroGuardianOpen, setIsIntroGuardianOpen] = useState<any>(false);
  const [isEditGuardianOpen, setIsEditGuardianOpen] = useState<any>(false);
  const [isBackupGuardianOpen, setIsBackupGuardianOpen] = useState<any>(false);
  const [isWalletConnectOpen, setIsWalletConnectOpen] = useState<any>(false);
  const { listOwner }= useWalletContract();

  const openSetDefaultModal = useCallback(() => {
    setIsSetDefaultOpen(true);
  }, []);

  const closeSetDefaultModal = useCallback(() => {
    setIsSetDefaultOpen(false);
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

  const closeSelectGuardianModal = useCallback(() => {
    setIsSelectGuardianOpen(false);
  }, []);

  const closeIntroGuardianModal = useCallback(() => {
    setIsIntroGuardianOpen(false);
  }, []);

  const closeEditGuardianModal = useCallback(() => {
    setIsEditGuardianOpen(false);
  }, []);

  const closeBackupGuardianModal = useCallback(() => {
    setIsBackupGuardianOpen(false);
  }, []);

  const getOwners = async() => {
    const res = await listOwner();
    // compare owners length to the contract
    if(res.length > eoas.length + credentials.length) {
      setOwners(res);
    }
  }

  useEffect(()=>{

  }, [])

  return (
    <Fragment>
      <Box display="flex" flexDirection="column" padding={{base: "0 24px", lg: "auto"}} pt="6">
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
              <Box fontFamily="Nunito" fontWeight="700" fontSize="18px" display="flex" height="36px">
                <Box>My Signers</Box>
              </Box>
              <Box paddingTop="14px" display="flex" gap="18px" flexWrap="wrap">
                <Fragment>
                  {eoas.map((item) => (
                    <SignerCard
                      key={item}
                      name={`EOA: ${toShortAddress(item)}`}
                      address={item}
                      time="Added on 2023-12-14"
                      marginRight={{ base: '0', md: '18px' }}
                      width={{ base: '100%', md: '272px' }}
                      marginBottom="18px"
                      isDefault={signerId === item}
                      cursor="pointer"
                      onClick={signerId !== item ? () => { setSignerIdToSet(item); openSetDefaultModal(); } : () => {}}
                    />
                  ))}
                </Fragment>
                <Fragment>
                  {credentials.map((item: any) => (
                    <SignerCard
                      key={item.id}
                      name={item.name || 'No Name'}
                      address={item.id}
                      device="Chrome profile"
                      time="Added on 2023-12-14 "
                      cursor="pointer"
                      marginRight={{ base: '0', md: '18px' }}
                      width={{ base: '100%', md: '272px' }}
                      marginBottom="18px"
                      isDefault={signerId === item.id}
                      onClick={signerId !== item.id ? () => { setSignerIdToSet(item.id); openSetDefaultModal(); } : () => {}}
                    />
                  ))}
                </Fragment>

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
