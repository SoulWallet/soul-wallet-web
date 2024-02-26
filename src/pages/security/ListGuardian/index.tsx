import { useState, useCallback, Fragment } from 'react';
import RoundSection from '@/components/new/RoundSection'
import GuardianCard from '@/components/new/GuardianCard'
import { Image, Box, Menu, MenuList, MenuButton, MenuItem } from '@chakra-ui/react'
import Button from '@/components/Button'
import PlusIcon from '@/components/Icons/Plus';
import HistoryIcon from '@/components/Icons/History';
import Title from '@/components/new/Title'
import TextBody from '@/components/new/TextBody'
import DropDownIcon from '@/components/Icons/DropDown';
import useBrowser from '@/hooks/useBrowser';
import { useTempStore } from '@/store/temp';
import { useGuardianStore } from '@/store/guardian';
import { useSettingStore } from '@/store/setting';
import EmptyGuardianIcon from '@/assets/icons/empty-guardian.svg'

export default function ListGuardian({
  startEditGuardian,
  openBackupGuardianModal,
  enterEditGuardian,
  isPending
}: any) {
  const [isEditGuardianOpen, setIsEditGuardianOpen] = useState<any>(false);

  const [editingGuardianDetails, setEditingGuardianDetails] = useState<any>({
    guardians: [],
    guardianNames: [],
    threshold: 0
  });

  const { getAddressName } = useSettingStore();

  const tempStore = useTempStore();
  const guardianStore = useGuardianStore();
  const guardiansInfo = !tempStore.createInfo.creatingGuardianInfo ? guardianStore.guardiansInfo : tempStore.getCreatingGuardianInfo()
  const keepPrivate = guardiansInfo?.keepPrivate

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

  return (
    <Fragment>
      <RoundSection marginTop="10px" background="white">
        <Fragment>
          <Box
            fontFamily="Nunito"
            fontWeight="700"
            fontSize="18px"
            display="flex"
            flexDirection={{ base: 'column', md: 'row' }}
          >
            <Box>Guardian List</Box>
            <Box
              marginLeft={{ base: '0', md: 'auto' }}
              marginTop={{ base: '20px', md: '0' }}
              display="flex"
              alignItems="flex-start"
              justifyContent="center"
              flexDirection={{ base: 'column', md: 'row' }}
              width={{ base: '100%', md: 'auto' }}
            >
              {!!guardianList.length && (
                <Button
                  size="mid"
                  type="white"
                  onClick={() => openBackupGuardianModal()}
                  marginBottom={{ base: '20px', md: '0px' }}
                  marginRight={{ base: '0px', md: '14px' }}
                  width={{ base: '100%', md: 'auto' }}
                >
                  <Box marginRight="2px"><HistoryIcon /></Box>
                  Backup list
                </Button>
              )}
            </Box>
          </Box>
          {isPending && (
            <Box background="#F3FBF2" borderRadius="8px" padding="8px 16px" fontFamily="Nunito" fontSize="14px" fontWeight="700" width="100%" maxWidth="600px">
              You have a pending guardian update.
            </Box>
          )}
          {!guardianList.length && !keepPrivate && (
            <Box width="100%" display="flex" alignItems="center" justifyContent="center">
              <Box display="flex" flexDirection="column" alignItems="center"  justifyContent="center">
                <Box width="85px" height="85px" borderRadius="85px">
                  <Image width="85px" height="85px" src={EmptyGuardianIcon} />
                </Box>
                <Box fontWeight="600" fontSize="14px" marginTop="10px">You currently have no guardians</Box>
              </Box>
            </Box>
          )}
          {!guardianList.length && keepPrivate && (
            <Box width="100%" display="flex" alignItems="center" justifyContent="center">
              <Box display="flex" flexDirection="column" alignItems="center"  justifyContent="center">
                <Box fontWeight="600" fontSize="14px" marginTop="10px" width="391px" textAlign="center">Based on your privacy settings, the guardian list is encrypted, Please check backup file on your local device or email.</Box>
              </Box>
            </Box>
          )}
          {!!guardianList.length && (
            <Box
              paddingTop="14px"
              display="flex"
              alignItems="flex-start"
              justifyContent="flex-start"
              flexWrap="wrap"
            >
              {guardianDetails && guardianDetails.guardians && (
                <Fragment>
                  {guardianDetails.guardians.map((address: any, i: any) =>
                    <GuardianCard
                      key={i}
                      name={guardianNames[i] || 'No Name'}
                      address={address}
                      marginRight={{ base: '0px', md: '18px' }}
                      marginBottom="18px"
                      width={{ base: '100%', md: '272px' }}
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
            {!guardianList.length && !keepPrivate && (
              <Box display="flex" alignItems="center" justifyContent="center">
                <Box fontWeight="600" fontSize="14px" marginTop="20px" marginBottom="20px">Setup recovery threshold after added guardians</Box>
              </Box>
            )}
            {!guardianList.length && keepPrivate && (
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
            {!!guardianList.length && (
              <Fragment>
                <Box
                  display="flex"
                  justifyContent="flex-start"
                  marginTop="10px"
                  alignItems={{ base: 'flex-start', md: 'center' }}
                  flexDirection={{ base: 'column', md: 'row' }}
                >
                  <Box
                    fontFamily="Nunito"
                    fontWeight="700"
                    fontSize="14px"
                    marginRight="6px"
                  >
                    Threshold:
                  </Box>
                  <TextBody
                    type="t2"
                    justifyContent="flex-start"
                    display="flex"
                    flexDirection={{ base: 'column', md: 'row' }}
                    alignItems={{ base: 'flex-start', md: 'center' }}
                  >
                    <Box>Wallet recovery requires</Box>
                    <Box
                      width="80px"
                      margin={{ base: '0', md: '0 10px' }}
                    >
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
          <Button size="mid" onClick={startEditGuardian}>
            <Box marginRight="6px"><PlusIcon color="white" /></Box>
            Add Guardian
          </Button>
        )}
        {(!!guardianList && !!guardianList.length) && (
          <Button size="mid" w="120px" onClick={enterEditGuardian}>
            Edit
          </Button>
        )}
      </Box>
    </Fragment>
  )
}
