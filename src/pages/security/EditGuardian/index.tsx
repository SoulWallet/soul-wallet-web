import { useState, useCallback, Fragment, useEffect } from 'react';
import Header from '@/components/Header';
import { SectionMenu, SectionMenuItem } from '@/components/new/SectionMenu';
import RoundSection from '@/components/new/RoundSection'
import SignerCard from '@/components/new/SignerCard'
import GuardianCard from '@/components/new/GuardianCard'
import { Box, Image, Menu, MenuList, MenuButton, MenuItem, useToast } from '@chakra-ui/react'
import SetSignerModal from '@/pages/security/SetSignerModal'
import SelectSignerTypeModal from '@/pages/security/SelectSignerTypeModal'
import SelectGuardianTypeModal from '@/pages/security/SelectGuardianTypeModal'
import IntroGuardianModal from '@/pages/security/IntroGuardianModal'
import EditGuardianModal from '@/pages/security/EditGuardianModal'
import BackupGuardianModal from '@/pages/security/BackupGuardianModal'
import WalletConnectModal from '@/pages/security/WalletConnectModal'
import Button from '@/components/Button'
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
import EmptyGuardianIcon from '@/assets/icons/empty-guardian.svg'
import RemoveIcon from '@/components/Icons/Remove'

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
    Number(values.amount) < 1
    // || Number(values.amount) > Number(props.guardiansCount)
  ) {
    errors.amount = 'Invalid Amount';
  }

  return errors;
};

export default function EditGuardian({
  cancelEdit,
  onEditGuardianConfirm,
  startEditGuardian,
  cancelEditGuardian,
  openBackupGuardianModal,
  startDeleteGuardian,
  startAddGuardian,
  startEditSingleGuardian,
  startRemoveGuardian
}: any) {
  const { getAddressName, saveAddressName } = useSettingStore();
  const {
    getEditingGuardiansInfo,
    updateEditingGuardiansInfo,

    getEditingSingleGuardiansInfo,
    updateEditingSingleGuardiansInfo,

    getAddingGuardiansInfo,
    updateAddingGuardiansInfo,

    clearCreateInfo,
    getCreateInfo,
  } = useTempStore();
  const guardiansInfo = getEditingGuardiansInfo();
  const { getReplaceGuardianInfo, calcGuardianHash } = useKeystore();
  const [keepPrivate, setKeepPrivate] = useState(!!guardiansInfo.keepPrivate)
  const { createWallet } = useWallet();
  const [isCreating, setIsCreating] = useState(false);
  const { chainConfig } = useConfig();
  const guardianStore = useGuardianStore();
  const [showGuardianTip1, setShowGuardianTip1] = useState(true)
  const [showGuardianTip2, setShowGuardianTip2] = useState(true)
  const { slotInfo } = useSlotStore();
  const { navigate } = useBrowser();
  const { credentials, eoas, } = useSignerStore();
  const { showConfirmPayment } = useWalletContext();
  const { sendErc20, payTask } = useTransaction();
  const toast = useToast();

  const guardianDetails = guardiansInfo.guardianDetails || {
    guardians: [],
    threshold: 0
  }

  const guardianNames = (guardiansInfo && guardiansInfo.guardianDetails && guardiansInfo.guardianDetails.guardians && guardiansInfo.guardianDetails.guardians.map((address: any) => getAddressName(address && address.toLowerCase()))) || []
  console.log('getEditingGuardiansInfo', getEditingGuardiansInfo(), guardianNames)

  const guardianList = guardianDetails.guardians.map((guardian: any, i: number) => {
    return {
      address: guardian,
      name: guardianNames[i]
    }
  })

  // const [amountData, setAmountData] = useState<any>({ guardiansCount: guardianList.length });

  const amountForm = useForm({
    fields: ['amount'],
    validate: amountValidate,
    initialValues: {
      amount: 0,
    },
  });

  const selectAmount = (amount: any) => () => {
    updateEditingGuardiansInfo({
      threshold: amount
    })

    amountForm.onChange('amount')(amount);
  };

  useEffect(() => {
    updateEditingGuardiansInfo({
      threshold: getRecommandCount(guardianList.length)
    })
  }, [guardianList.length])

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

        if (!keepPrivate) await api.guardian.backupGuardians(guardiansInfo);

        const initialGuardianSafePeriod = defaultGuardianSafePeriod
        await createWallet({
          initialGuardianHash: newGuardianHash,
          initialGuardianSafePeriod
        })

        // guardianStore()
        console.log('keepPrivate', keepPrivate)

        guardianStore.setGuardiansInfo(guardiansInfo)

        for (let i = 0; i < guardianAddresses.length; i++) {
          const address = guardianAddresses[i]
          const name = guardianNames[i]
          if (address) saveAddressName(address.toLowerCase(), name);
        }

        setIsCreating(false)
        clearCreateInfo()
        cancelEditGuardian()
        // navigate(`/dashboard`);
      } catch (error: any) {
        setIsCreating(false)

        if (error.message) {
          toast({
            status: 'error',
            title: error.message,
          });
        }

        console.log('error', error.message)
      }
    } else {
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

        await api.guardian.backupGuardians(guardiansInfo);
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

      } catch (error: any) {
        setIsCreating(false)

        if (error.message) {
          toast({
            status: 'error',
            title: error.message,
          });
        }

        console.log('error', error.message)
      }
    }
  }, [guardianList, keepPrivate, slotInfo])

  const handleDelete = useCallback((i: any) => {
    const guardiansInfo = getEditingGuardiansInfo();
    const guardianDetails = guardiansInfo.guardianDetails
    const guardianNames = guardiansInfo.guardianNames
    const guardians = guardianDetails.guardians
    guardianDetails.guardians = guardians.filter((_: any, idx: number) => idx !== i)

    guardianStore.updateEditingGuardiansInfo({
      guardianDetails,
      guardianNames: guardianNames.filter((_: any, idx: number) => idx !== i)
    })
  }, [])

  const onBackupFinished = useCallback(() => {
    next()
  }, [keepPrivate])


  useEffect(() => {
    if (!amountForm.values.amount || Number(amountForm.values.amount) > guardianList.length) {
      amountForm.onChange('amount')(getRecommandCount(guardianList.length));
    }
  }, [guardianList.length, amountForm.values.amount]);

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
            <Box marginLeft="auto">
              {!!guardianList.length && (
                <Button size="mid" type="white" onClick={() => openBackupGuardianModal()} marginRight="14px">
                  <Box marginRight="2px"><HistoryIcon /></Box>
                  Backup list
                </Button>
              )}
              <Button size="mid" onClick={() => startAddGuardian()}>
                <Box marginRight="6px"><PlusIcon color="white" /></Box>
                Add Guardian
              </Button>
            </Box>
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
                      marginRight="18px"
                      cursor="pointer"
                      allowDelete={true}
                      onDelete={() => startRemoveGuardian(i, address)}
                      allowEdit={true}
                      marginBottom="18px"
                      height="140px"
                      onEdit={() => startEditSingleGuardian({
                        guardianDetails: {
                          guardians: [address]
                        },
                        guardianNames: [guardianNames[i]],
                        i
                      })}
                    />
                  )}
                  {guardianDetails.guardians.length == 1 && showGuardianTip1 && (
                    <Box
                      border="1px solid #DFDFDF"
                      padding="19px 13px"
                      borderRadius="12px"
                      width="270px"
                      position="relative"
                      overflow="hidden"
                      background="#7F56D9"
                      marginBottom="18px"
                      marginRight="18px"
                      height="140px"
                    >
                      <Box
                        position="absolute"
                        top="15px"
                        right="15px"
                        cursor="pointer"
                        onClick={() => setShowGuardianTip1(false)}
                      >
                        <RemoveIcon />
                      </Box>
                      <Box
                        fontFamily="Nunito"
                        fontWeight="700"
                        fontSize="16px"
                        marginBottom="10px"
                        color="white"
                      >
                        🎉 Bravo!
                      </Box>
                      <Box
                        fontFamily="Nunito"
                        fontWeight="400"
                        fontSize="12px"
                        color="white"
                      >
                        You’ve added <Box as="span" fontWeight="bold">1</Box> guardian! We suggest to have <Box as="span" fontWeight="bold">3 guardians</Box> and <Box as="span" fontWeight="bold">2 threshold</Box> to keep your wallet safe! Add some here.
                      </Box>
                    </Box>
                  )}
                  {guardianDetails.guardians.length == 2 && showGuardianTip2 && (
                    <Box
                      border="1px solid #DFDFDF"
                      padding="19px 13px"
                      borderRadius="12px"
                      width="270px"
                      position="relative"
                      overflow="hidden"
                      background="#7F56D9"
                      marginBottom="18px"
                      marginRight="18px"
                      height="140px"
                    >
                      <Box
                        position="absolute"
                        top="15px"
                        right="15px"
                        cursor="pointer"
                        onClick={() => setShowGuardianTip2(false)}
                      >
                        <RemoveIcon />
                      </Box>
                      <Box
                        fontFamily="Nunito"
                        fontWeight="700"
                        fontSize="16px"
                        marginBottom="10px"
                        color="white"
                      >
                        👍🏻 Awesome!
                      </Box>
                      <Box
                        fontFamily="Nunito"
                        fontWeight="400"
                        fontSize="12px"
                        color="white"
                      >
                        You’ve added <Box as="span" fontWeight="bold">2</Box> guardian! We suggest to have <Box as="span" fontWeight="bold">3 guardians</Box> and <Box as="span" fontWeight="bold">2 threshold</Box> to keep your wallet safe! 1 more to go.
                      </Box>
                    </Box>
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
                            {amountForm.values.amount || 0}
                            <DropDownIcon />
                          </Box>
                        </MenuButton>
                        <MenuList>
                          {!(guardianList.length || 0) && (
                            <MenuItem key={nanoid(4)} onClick={selectAmount(0)}>
                              0
                            </MenuItem>
                          )}
                          {!!(guardianList.length || 0) &&
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
        <Button size="mid" type="white" padding="0 20px" marginRight="16px" onClick={cancelEditGuardian}>
          Cancel
        </Button>
        <Button size="mid" onClick={keepPrivate ? () => { openBackupGuardianModal(onBackupFinished) } : () => next()} isLoading={isCreating} disabled={isCreating || !guardianList.length}>
          Continue
        </Button>
      </Box>
    </Fragment>
  )
}