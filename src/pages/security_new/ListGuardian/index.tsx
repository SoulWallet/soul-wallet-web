import { useState, useCallback, Fragment } from 'react';
import Header from '@/components/Header';
import { SectionMenu, SectionMenuItem } from '@/components/new/SectionMenu';
import RoundSection from '@/components/new/RoundSection'
import SignerCard from '@/components/new/SignerCard'
import GuardianCard from '@/components/new/GuardianCard'
import { Image, Box, Menu, MenuList, MenuButton, MenuItem } from '@chakra-ui/react'
import SetSignerModal from '@/pages/security_new/SetSignerModal'
import SelectSignerTypeModal from '@/pages/security_new/SelectSignerTypeModal'
import SelectGuardianTypeModal from '@/pages/security_new/SelectGuardianTypeModal'
import IntroGuardianModal from '@/pages/security_new/IntroGuardianModal'
import EditGuardianModal from '@/pages/security_new/EditGuardianModal'
import BackupGuardianModal from '@/pages/security_new/BackupGuardianModal'
import WalletConnectModal from '@/pages/security_new/WalletConnectModal'
import Button from '@/components/new/Button'
import TextButton from '@/components/new/TextButton'
import PlusIcon from '@/components/Icons/Plus';
import HistoryIcon from '@/components/Icons/History';
import Title from '@/components/new/Title'
import TextBody from '@/components/new/TextBody'
import DropDownIcon from '@/components/Icons/DropDown';
import useBrowser from '@/hooks/useBrowser';
import DashboardLayout from '@/components/Layouts/DashboardLayout';
import { useTempStore } from '@/store/temp';
import { useGuardianStore } from '@/store/guardian';
import { useSettingStore } from '@/store/setting';
import EmptyGuardianIcon from '@/assets/icons/empty-guardian.svg'

export default function ListGuardian({
  openEditGuardianModal,
  startEditGuardian,
  startAddGuardian
}: any) {
  const { navigate } = useBrowser();
  const [activeSection, setActiveSection] = useState<string>('guardian');
  const [isSetDefaultOpen, setIsSetDefaultOpen] = useState<any>(false);
  const [isChooseSignerOpen, setIsChooseSignerOpen] = useState<any>(false);
  const [isSelectGuardianOpen, setIsSelectGuardianOpen] = useState<any>(false);
  const [isIntroGuardianOpen, setIsIntroGuardianOpen] = useState<any>(false);
  const [isEditGuardianOpen, setIsEditGuardianOpen] = useState<any>(false);
  const [isBackupGuardianOpen, setIsBackupGuardianOpen] = useState<any>(false);
  const [isWalletConnectOpen, setIsWalletConnectOpen] = useState<any>(false);
  const [isEditing, setIsEditing] = useState<any>(false);

  const [editingGuardianDetails, setEditingGuardianDetails] = useState<any>({
    guardians: [],
    guardianNames: [],
    threshold: 0
  });

  const { getAddressName } = useSettingStore();

  const tempStore = useTempStore();
  const guardianStore = useGuardianStore();
  const guardiansInfo = !tempStore.createInfo.creatingGuardianInfo ? guardianStore.guardiansInfo : tempStore.getCreatingGuardianInfo()
  const updateGuardiansInfo = !tempStore.createInfo.creatingGuardianInfo ? guardianStore.updateGuardiansInfo : tempStore.updateCreatingGuardianInfo
  const keepPrivate = guardiansInfo.keepPrivate

  const guardianDetails = (guardiansInfo && guardiansInfo.guardianDetails) || {
    guardians: [],
    guardianNames: [],
    threshold: 0
  }

  const guardianNames = (guardiansInfo && guardiansInfo.guardianDetails && guardiansInfo.guardianDetails.guardians && guardiansInfo.guardianDetails.guardians.map((address: any) => getAddressName(address && address.toLowerCase()))) || []

  const guardianList = guardianDetails.guardians.map((guardian: any, i: number) => {
    return {
      address: guardian,
      name: guardianNames[i]
    }
  })
  console.log('guardiansInfo000', guardiansInfo)

  const onGuardianListConfirm = useCallback((addresses: any, names: any) => {
    setIsEditGuardianOpen(false)
    // startEditing()

    setEditingGuardianDetails({
      guardians: addresses,
      guardianNames: names,
      threshold: editingGuardianDetails.threshold || 0
    })
  }, [editingGuardianDetails])

  return (
    <Fragment>
      <RoundSection marginTop="10px" background="white">
        <Fragment>
          <Box
            fontFamily="Nunito"
            fontWeight="700"
            fontSize="18px"
            display="flex"
          >
            <Box>Guardian List</Box>
            {!!guardianList.length && (
              <Box marginLeft="auto">
                <TextButton type="mid" onClick={() => {}}>
                  <Box marginRight="6px"><HistoryIcon /></Box>
                  Back up list
                </TextButton>
              </Box>
            )}
          </Box>
          {!guardianList.length && (
            <Box width="100%" display="flex" alignItems="center" justifyContent="center">
              <Box display="flex" flexDirection="column" alignItems="center"  justifyContent="center">
                <Box width="85px" height="85px" borderRadius="85px">
                  <Image width="85px" height="85px" src={EmptyGuardianIcon} />
                    </Box>
                    <Box fontWeight="600" fontSize="14px" marginTop="10px">You currently have no guardians</Box>
              </Box>
            </Box>
          )}
            {!!guardianList.length && (
              <Box
                paddingTop="14px"
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
              >
                {guardianDetails && guardianDetails.guardians && (
                  <Fragment>
                    {guardianDetails.guardians.map((address: any, i: any) =>
                      <GuardianCard
                        key={i}
                        name={guardianNames[i] || 'No Name'}
                        address={address}
                        time="Added on 2023-12-14 "
                        marginRight="18px"
                        cursor="pointer"
                      />
                    )}
                  </Fragment>
                )}
              </Box>
            )}
            <Box borderTop="1px solid #F0F0F0" marginTop="30px" paddingTop="20px">
              <Title
                fontFamily="Nunito"
                fontWeight="700"
                fontSize="18px"
                display="flex"
              >
                Recovery settings
              </Title>
              {!guardianList.length && (
                <Box display="flex" alignItems="center" justifyContent="center">
                  <Box fontWeight="600" fontSize="14px" marginTop="20px" marginBottom="20px">Setup recovery threshold after added guardians</Box>
                </Box>
              )}
              {!!guardianList.length && (
                <Fragment>
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
                        <Box
                          px={2}
                          py={2}
                          width="80px"
                          transition="all 0.2s"
                          borderRadius="16px"
                          borderWidth="1px"
                          padding="12px"
                          background="white"
                          _expanded={{
                            borderColor: '#3182ce',
                            boxShadow: '0 0 0 1px #3182ce',
                          }}
                        >
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            {guardianDetails.threshold || 0}
                            <DropDownIcon />
                          </Box>
                        </Box>
                      </Box>
                      <Box>{`out of ${guardianDetails.guardians.length} guardian(s) confirmation.`}</Box>
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
                      <Box width="42px" minWidth="42px" height="24px" background={keepPrivate ? '#1CD20F' : '#D9D9D9'} borderRadius="40px" padding="2px" cursor="pointer" transition="all 0.2s ease" paddingLeft={keepPrivate ? '20px' : '2px'}>
                        <Box boxShadow={"0px 2.036px 0.679px 0px rgba(0, 0, 0, 0.06), 0px 2.036px 5.429px 0px rgba(0, 0, 0, 0.15), 0px 0px 0px 0.679px rgba(0, 0, 0, 0.04)"} width="20px" height="20px" background="white" borderRadius="30px" />
                      </Box>
                    </TextBody>
                  </Box>
                </Fragment>
              )}
            </Box>
        </Fragment>
      </RoundSection>
      <Box
        width="100%"
        padding="20px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {(!guardianList || !guardianList.length) && (
          <Button type="mid" onClick={startAddGuardian}>
            <Box marginRight="6px"><PlusIcon color="white" /></Box>
            Add Guardian
          </Button>
        )}
        {(!!guardianList && !!guardianList.length) && (
          <Button type="mid" onClick={startEditGuardian}>
            Edit
          </Button>
        )}
      </Box>
    </Fragment>
  )
}
