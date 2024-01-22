import { useState, useCallback, Fragment, useEffect } from 'react';
import Header from '@/components/Header';
import { SectionMenu, SectionMenuItem } from '@/components/new/SectionMenu';
import RoundSection from '@/components/new/RoundSection'
import SignerCard from '@/components/new/SignerCard'
import GuardianCard from '@/components/new/GuardianCard'
import { Box, Menu, MenuList, MenuButton, MenuItem } from '@chakra-ui/react'
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
import useForm from '@/hooks/useForm';
import { nanoid } from 'nanoid';

const getRecommandCount = (c: number) => {
  if (!c) {
    return 0;
  }

  return Math.ceil(c / 2);
};

const getNumberArray = (count: number) => {
  const arr = [];

  for (let i = 1; i <= count; i++) {
    arr.push(i);
  }

  return arr;
};

const amountValidate = (values: any, props: any) => {
  const errors: any = {};

  if (
    !values.amount ||
    !Number.isInteger(Number(values.amount)) ||
    Number(values.amount) < 1 ||
    Number(values.amount) > Number(props.guardiansCount)
  ) {
    errors.amount = 'Invalid Amount';
  }

  return errors;
};

export default function EditGuardian({
  cancelEdit,
  onEditGuardianConfirm,
  startEditGuardian
}: any) {
  const { getAddressName } = useSettingStore();
  const { getEditingGuardiansInfo } = useTempStore();
  const guardiansInfo = getEditingGuardiansInfo();
  const [keepPrivate, setKeepPrivate] = useState(!!guardiansInfo.keepPrivate)
  const [amountData, setAmountData] = useState<any>({});

  const amountForm = useForm({
    fields: ['amount'],
    validate: amountValidate,
    restProps: amountData,
    initialValues: {
      amount: getRecommandCount(amountData.guardiansCount),
    },
  });

  const selectAmount = (amount: any) => () => {
    amountForm.onChange('amount')(amount);
  };

  const guardianDetails = guardiansInfo.guardianDetails

  const guardianNames = (guardiansInfo && guardiansInfo.guardianDetails && guardiansInfo.guardianDetails.guardians && guardiansInfo.guardianDetails.guardians.map((address: any) => getAddressName(address && address.toLowerCase()))) || []

  const guardianList = guardianDetails.guardians.map((guardian: any, i: number) => {
    return {
      address: guardian,
      name: guardianNames[i]
    }
  })

  /* useEffect(() => {
   *   setAmountData({ guardiansCount: guardianList.length });
   * }, [guardianList]);
   */
  console.log('guardianList', guardianList)

  const handleConfirm = useCallback((addresses: any, names: any) => {
    console.log('handleConfirm', addresses, names)
  }, [])

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
                <Button type="mid" onClick={startEditGuardian}>
                  <Box marginRight="6px"><PlusIcon color="white" /></Box>
                  Add Guardian
                </Button>
              </Box>
            )}
          </Box>
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
                    name={guardianDetails.guardianNames[i] || 'No Name'}
                    address={address}
                    time="Added on 2023-12-14 "
                    marginRight="18px"
                    cursor="pointer"
                  />
                )}
              </Fragment>
            )}
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
                          {amountForm.values.amount}
                          <DropDownIcon />
                        </Box>
                      </MenuButton>
                      <MenuList>
                        {!amountData.guardiansCount && (
                          <MenuItem key={nanoid(4)} onClick={selectAmount(0)}>
                            0
                          </MenuItem>
                        )}
                        {!!amountData.guardiansCount &&
                         getNumberArray(guardianList.length || 0).map((i: any) => (
                           <MenuItem key={nanoid(4)} onClick={selectAmount(i)}>
                             {i}
                           </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </Box>
                  <Box>{`out of ${guardianList.length || 0} guardian(s) confirmation.`}</Box>
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
            </Fragment>
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
        <Button type="mid" theme="light" padding="0 20px" marginRight="16px" onClick={() => {}}>
          Cancel
        </Button>
        <Button type="mid" onClick={() => {}}>
          Continue to sign
        </Button>
      </Box>
    </Fragment>
  )
}
