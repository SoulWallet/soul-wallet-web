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
import { useSettingStore } from '@/store/setting';
import useForm from '@/hooks/useForm';
import useKeystore from '@/hooks/useKeystore';
import { defaultGuardianSafePeriod } from '@/config';
import { nanoid } from 'nanoid';
import useConfig from '@/hooks/useConfig';
import useWallet from '@/hooks/useWallet';
import { ethers } from 'ethers';
import { useGuardianStore } from '@/store/guardian';
import { useSlotStore } from '@/store/slot';
import { useSignerStore } from '@/store/signer';
import { L1KeyStore } from '@soulwallet/sdk';
import useWalletContext from '@/context/hooks/useWalletContext';
import useTransaction from '@/hooks/useTransaction';
import api from '@/lib/api';

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
  startEditGuardian,
  cancelEditGuardian
}: any) {
  const { getAddressName, saveAddressName } = useSettingStore();
  const { getEditingGuardiansInfo, clearCreateInfo } = useTempStore();
  const guardiansInfo = getEditingGuardiansInfo();
  const { getReplaceGuardianInfo, calcGuardianHash } = useKeystore();
  const [keepPrivate, setKeepPrivate] = useState(!!guardiansInfo.keepPrivate)
  const { createWallet } = useWallet();
  const [isCreating, setIsCreating] = useState(false);
  const { chainConfig } = useConfig();
  const guardianStore = useGuardianStore();
  const { slotInfo } = useSlotStore();
  const { navigate } = useBrowser();
  const { credentials, eoas, } = useSignerStore();
  const { showConfirmPayment } = useWalletContext();
  const { sendErc20, payTask } = useTransaction();

  const guardianDetails = guardiansInfo.guardianDetails

  const guardianNames = (guardiansInfo && guardiansInfo.guardianDetails && guardiansInfo.guardianDetails.guardians && guardiansInfo.guardianDetails.guardians.map((address: any) => getAddressName(address && address.toLowerCase()))) || []

  const guardianList = guardianDetails.guardians.map((guardian: any, i: number) => {
    return {
      address: guardian,
      name: guardianNames[i]
    }
  })

  const [amountData, setAmountData] = useState<any>({ guardiansCount: guardianList.length });

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

  /* useEffect(() => {
   *   setAmountData({ guardiansCount: guardianList.length });
   * }, [guardianList]);
   */
  console.log('guardianList', guardianList)

  const handleConfirm = useCallback((addresses: any, names: any) => {
    console.log('handleConfirm', addresses, names)
  }, [])

  const next = useCallback(async () => {
    const initialGuardianHash = slotInfo && slotInfo.initialGuardianHash

    if (!initialGuardianHash) {
      try {
        setIsCreating(true)
        const guardianAddresses = guardianList.map((item: any) => item.address);
        const guardianNames = guardianList.map((item: any) => item.name);
        const threshold = amountForm.values.amount || 0;
        const keystore = chainConfig.contracts.l1Keystore;
        const newGuardianHash = calcGuardianHash(guardianAddresses, threshold);
        const salt = ethers.ZeroHash;

        const guardiansInfo = {
          keystore,
          guardianHash: newGuardianHash,
          guardianNames,
          guardianDetails: {
            guardians: guardianAddresses,
            threshold: Number(threshold),
            salt,
          },
          requireBackup: true,
          keepPrivate
        };

        const initialGuardianSafePeriod = defaultGuardianSafePeriod
        await createWallet({
          initialGuardianHash: newGuardianHash,
          initialGuardianSafePeriod
        })

        // guardianStore()
        await api.guardian.backupGuardians(guardiansInfo);
        guardianStore.setGuardiansInfo(guardiansInfo)

        for (let i = 0; i < guardianAddresses.length; i++) {
          const address = guardianAddresses[i]
          const name = guardianNames[i]
          if (address) saveAddressName(address.toLowerCase(), name);
        }

        setIsCreating(false)
        clearCreateInfo()
        navigate(`/dashboard`);
      } catch (error: any) {
        console.log('error', error.message)
      }
    } else {
      // try {
      setIsCreating(true)
      const guardianAddresses = guardianList.map((item: any) => item.address);
      const guardianNames = guardianList.map((item: any) => item.name);
      const threshold = amountForm.values.amount || 0;
      const keystore = chainConfig.contracts.l1Keystore;
      const newGuardianHash = calcGuardianHash(guardianAddresses, threshold);
      const salt = ethers.ZeroHash;

      const guardiansInfo = {
        keystore,
        guardianHash: newGuardianHash,
        guardianNames,
        guardianDetails: {
          guardians: guardianAddresses,
          threshold: Number(threshold),
          salt,
        },
        requireBackup: true,
        keepPrivate
      };

      // await api.guardian.backupGuardians(guardiansInfo);
      const { initialKeys, initialKeyHash, initialGuardianHash, initialGuardianSafePeriod, slot } = slotInfo;
      const currentKeys = L1KeyStore.initialKeysToAddress([
        ...credentials.map((credential: any) => credential.publicKey),
        ...eoas,
      ]);
      const rawKeys = new ethers.AbiCoder().encode(["bytes32[]"], [currentKeys]);
      console.log('currentKeys', currentKeys, initialKeys, newGuardianHash)

      // const initialKeyHash = L1KeyStore.getKeyHash(initialKeys);

      const { keySignature } = await getReplaceGuardianInfo(newGuardianHash)

      const functionName = `setGuardian(bytes32,bytes32,uint256,bytes32,bytes,bytes)`
      const parameters = [
        initialKeyHash,
        initialGuardianHash,
        initialGuardianSafePeriod,
        newGuardianHash,
        rawKeys,
        keySignature,
      ]

      const res1 = await api.guardian.createTask({
        keystore,
        functionName,
        parameters
      })

      const task = res1.data
      const paymentContractAddress = chainConfig.contracts.paymentContractAddress;
      const res2 = await showConfirmPayment(task.estiamtedFee);
      const res3 = await payTask(paymentContractAddress, task.estiamtedFee, task.taskID);
      guardianStore.updateGuardiansInfo({
        ...guardiansInfo
      })

      for (let i = 0; i < guardianAddresses.length; i++) {
        const address = guardianAddresses[i]
        const name = guardianNames[i]
        if (address) saveAddressName(address.toLowerCase(), name);
      }
      setIsCreating(false)
      cancelEditGuardian()

      // } catch (error: any) {
      // console.log('error', error.message)
      // }
    }
  }, [guardianList, keepPrivate, slotInfo])

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
                  Edit Guardian
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
                  <Box width="42px" minWidth="42px" height="24px" background={keepPrivate ? '#1CD20F' : '#D9D9D9'} borderRadius="40px" padding="2px" cursor="pointer" onClick={() => setKeepPrivate(!keepPrivate)} transition="all 0.2s ease" paddingLeft={keepPrivate ? '20px' : '2px'}>
                    <Box boxShadow={"0px 2.036px 0.679px 0px rgba(0, 0, 0, 0.06), 0px 2.036px 5.429px 0px rgba(0, 0, 0, 0.15), 0px 0px 0px 0.679px rgba(0, 0, 0, 0.04)"} width="20px" height="20px" background="white" borderRadius="30px" />
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
        <Button type="mid" theme="light" padding="0 20px" marginRight="16px" onClick={cancelEditGuardian}>
          Cancel
        </Button>
        <Button type="mid" onClick={next} isLoading={isCreating} disabled={isCreating}>
          Continue
        </Button>
      </Box>
    </Fragment>
  )
}
