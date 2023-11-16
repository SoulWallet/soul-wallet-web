import React, { useState, useEffect } from 'react';
import FullscreenContainer from '@/components/FullscreenContainer';
import { Box, Text, Image, useToast, Select, Menu, MenuList, MenuButton, MenuItem } from '@chakra-ui/react';
import Heading1 from '@/components/web/Heading1';
import TextBody from '@/components/web/TextBody';
import Button from '@/components/web/Button';
import TextButton from '@/components/web/TextButton';
import Steps from '@/components/web/Steps';
import PassKeyList from '@/components/web/PassKeyList';
import usePassKey from '@/hooks/usePasskey';
import { useCredentialStore } from '@/store/credential';
import useBrowser from '@/hooks/useBrowser';
import useConfig from '@/hooks/useConfig';
import useKeystore from '@/hooks/useKeystore';
import { useGuardianStore } from '@/store/guardian';
import { ethers } from 'ethers';
import { L1KeyStore } from '@soulwallet/sdk';
import useSdk from '@/hooks/useSdk';
import { useAddressStore } from '@/store/address';
import WarningIcon from '@/components/Icons/Warning';
import SecureIcon from '@/components/Icons/Secure';
import api from '@/lib/api';
import MinusIcon from '@/assets/icons/minus.svg';
import DoubleFormInput from '@/components/web/Form/DoubleFormInput';
import useWallet from '@/hooks/useWallet';
import useForm from '@/hooks/useForm';
import BN from 'bignumber.js'
import Icon from '@/components/Icon';
import { nextRandomId } from '@/lib/tools';
import DropDownIcon from '@/components/Icons/DropDown';
import PlusIcon from '@/components/Icons/Plus';
import useWalletContext from '@/context/hooks/useWalletContext';
import { nanoid } from 'nanoid';
import useTransaction from '@/hooks/useTransaction';
import GuardianModal from '@/pages/security/Guardian/GuardianModal'

const defaultGuardianIds = [nextRandomId()];

const getNumberArray = (count: number) => {
  const arr = [];

  for (let i = 1; i <= count; i++) {
    arr.push(i);
  }

  return arr;
};

const toHex = (num: any) => {
  let hexStr = num.toString(16);

  if (hexStr.length % 2 === 1) {
    hexStr = '0' + hexStr;
  }

  hexStr = '0x' + hexStr;

  return hexStr;
};

const getRecommandCount = (c: number) => {
  if (!c) {
    return 0;
  }

  return Math.ceil(c / 2);
};

const getFieldsByGuardianIds = (ids: any) => {
  const fields = [];

  for (const id of ids) {
    const addressField = `address_${id}`;
    const nameField = `name_${id}`;
    fields.push(addressField);
    fields.push(nameField);
  }

  return fields;
};

const isENSAddress = (address: string) => {
  const ensRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
  return ensRegex.test(address);
};

const validate = (values: any) => {
  const errors: any = {};
  const addressKeys = Object.keys(values).filter((key) => key.indexOf('address') === 0);
  const nameKeys = Object.keys(values).filter((key) => key.indexOf('name') === 0);
  const existedAddress = [];

  for (const addressKey of addressKeys) {
    const address = values[addressKey];

    if (address && address.length && !ethers.isAddress(address)) {
      errors[addressKey] = 'Invalid Address';
    } else if (existedAddress.indexOf(address) !== -1) {
      errors[addressKey] = 'Duplicated Address';
    } else if (address && address.length) {
      existedAddress.push(address);
    }
  }

  return errors;
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

const getDefaultGuardianIds = (count: number) => {
  const ids = [];

  for (let i = 0; i < count; i++) {
    ids.push(nextRandomId());
  }

  return ids;
};

const getInitialValues = (ids: string[], guardians: string[], guardianNames: string[]) => {
  const idCount = ids.length;
  const guardianCount = guardians.length;
  const count = idCount > guardianCount ? idCount : guardianCount;
  const values: any = {};

  for (let i = 0; i < count; i++) {
    if (ids[i]) {
      values[`address_${ids[i]}`] = guardians[i];
      values[`name_${ids[i]}`] = guardianNames[i];
    }
  }

  return values;
};

export default function SetGuardians({ changeStep }: any) {
  const { navigate } = useBrowser();
  const { register } = usePassKey();
  const { chainConfig } = useConfig();
  const { addCredential, credentials, changeCredentialName, setSelectedCredentialId, walletName, } = useCredentialStore();
  const [isCreating, setIsCreating] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const { slotInfo, setSlotInfo, setGuardiansInfo, setEditingGuardiansInfo } = useGuardianStore();
  const { setSelectedAddress, setAddressList } = useAddressStore();
  const { calcWalletAddress } = useSdk();
  const [status, setStatus] = useState<string>('intro');
  const [isModalOpen, setIsModalOpen] = useState(false)
  const toast = useToast();

  const { guardiansInfo, updateGuardiansInfo } = useGuardianStore();
  const guardianDetails = (guardiansInfo && guardiansInfo.guardianDetails) || {
    guardians: [],
    threshold: 0
  }
  const guardianNames = (guardiansInfo && guardiansInfo.guardianNames) || []

  const defaultGuardianIds = getDefaultGuardianIds((guardianDetails.guardians && guardianDetails.guardians.length > 1 && guardianDetails.guardians.length) || 1)
  const [guardianIds, setGuardianIds] = useState(defaultGuardianIds);
  const [fields, setFields] = useState(getFieldsByGuardianIds(defaultGuardianIds));
  const [guardiansList, setGuardiansList] = useState([]);
  const [amountData, setAmountData] = useState<any>({});
  const { getReplaceGuardianInfo, calcGuardianHash, getSlot } = useKeystore();
  const [loading, setLoading] = useState(false);
  const { sendErc20, payTask } = useTransaction();
  const { showConfirmPayment } = useWalletContext();

  const { values, errors, invalid, onChange, onBlur, showErrors, addFields, removeFields } = useForm({
    fields,
    validate,
    initialValues: getInitialValues(defaultGuardianIds, guardianDetails.guardians, guardianNames)
  });

  const amountForm = useForm({
    fields: ['amount'],
    validate: amountValidate,
    restProps: amountData,
    initialValues: {
      amount: getRecommandCount(amountData.guardiansCount),
    },
  });

  const disabled = invalid || !guardiansList.length || amountForm.invalid || loading;

  useEffect(() => {
    setGuardiansList(
      Object.keys(values)
            .filter((key) => key.indexOf('address') === 0)
            .map((key) => values[key])
            .filter((address) => !!String(address).trim().length) as any,
    );
  }, [values]);

  useEffect(() => {
    setAmountData({ guardiansCount: guardiansList.length });
  }, [guardiansList]);

  const handleSubmit = async () => {
    if (disabled) return;

    try {
      setLoading(true);
      const guardiansList = guardianIds
        .map((id) => {
          const addressKey = `address_${id}`;
          const nameKey = `name_${id}`;
          let address = values[addressKey];

          if (address && address.length) {
            return { address, name: values[nameKey] };
          }

          return null;
        })
        .filter((i) => !!i);

      const guardianAddresses = guardiansList.map((item: any) => item.address);
      const guardianNames = guardiansList.map((item: any) => item.name);
      const threshold = amountForm.values.amount || 0;

      const newGuardianHash = calcGuardianHash(guardianAddresses, threshold);
      const keystore = chainConfig.contracts.l1Keystore;
      const salt = ethers.ZeroHash;
      const { initialKeys, initialGuardianHash, initialGuardianSafePeriod, slot } = slotInfo;
      const currentKeys = await Promise.all(credentials.map((credential: any) => credential.publicKey))
      const initalkeysAddress = L1KeyStore.initialKeysToAddress(initialKeys);
      const currentkeysAddress = L1KeyStore.initialKeysToAddress(currentKeys);
      console.log('initialKeys', initalkeysAddress, currentkeysAddress)
      let initalRawkeys
      if (initalkeysAddress.join('') === currentkeysAddress.join('')) {
        initalRawkeys = new ethers.AbiCoder().encode(["bytes32[]"], [initalkeysAddress]);
      } else {
        initalRawkeys = new ethers.AbiCoder().encode(["bytes32[]"], [currentkeysAddress]);
      }

      const initialKeyHash = L1KeyStore.getKeyHash(initalkeysAddress);

      const walletInfo = {
        keystore,
        slot,
        slotInfo: {
          initialKeyHash,
          initialGuardianHash,
          initialGuardianSafePeriod
        },
        keys: initalkeysAddress
      };

      const guardiansInfo = {
        keystore,
        slot,
        guardianHash: newGuardianHash,
        guardianNames,
        guardianDetails: {
          guardians: guardianAddresses,
          threshold: Number(threshold),
          salt,
        },
        requireBackup: true
      };

      /* const { keySignature } = await getReplaceGuardianInfo(newGuardianHash)

       * const functionName = `setGuardian(bytes32,bytes32,uint256,bytes32,bytes,bytes)`
       * const parameters = [
       *   initialKeyHash,
       *   initialGuardianHash,
       *   initialGuardianSafePeriod,
       *   newGuardianHash,
       *   initalRawkeys,
       *   keySignature,
       * ]

       * const res1 = await api.guardian.createTask({
       *   keystore,
       *   functionName,
       *   parameters
       * })

       * const task = res1.data
       * const paymentContractAddress = chainConfig.contracts.paymentContractAddress;
       * const res2 = await showConfirmPayment(task.estiamtedFee);
       * const res3 = await payTask(paymentContractAddress, task.estiamtedFee, task.taskID); */
      setGuardiansInfo(guardiansInfo)
      // startBackup()
      setLoading(false);
      /* api.operation.finishStep({
       *   slot,
       *   steps: [1],
       * }) */
    } catch (error: any) {
      console.log('error', error.message)
      setLoading(false);
    }
  };

  const addGuardian = () => {
    const id = nextRandomId();
    const newGuardianIds = [...guardianIds, id];
    const newFields = getFieldsByGuardianIds(newGuardianIds);
    setGuardianIds(newGuardianIds);
    setFields(newFields);
    addFields(getFieldsByGuardianIds([id]));
  };

  const removeGuardian = (deleteId: string) => {
    if (guardianIds.length > 1) {
      const newGuardianIds = guardianIds.filter((id) => id !== deleteId);
      const newFields = getFieldsByGuardianIds(newGuardianIds);
      setGuardianIds(newGuardianIds);
      setFields(newFields);
      removeFields(getFieldsByGuardianIds([deleteId]));
    }
  };

  const selectAmount = (amount: any) => () => {
    amountForm.onChange('amount')(amount);
  };

  useEffect(() => {
    if (!amountForm.values.amount || Number(amountForm.values.amount) > amountData.guardiansCount) {
      amountForm.onChange('amount')(getRecommandCount(amountData.guardiansCount));
    }
  }, [amountData.guardiansCount, amountForm.values.amount]);

  const hasGuardians = guardianDetails && guardianDetails.guardians && !!guardianDetails.guardians.length

  const startBackup = () => {
    setStatus('backuping')
  }

  const startEdit = () => {
    setStatus('editing')
  }

  const createWallet = async () => {
    try {
      setIsCreating(true);
      const credentialKey = await register(walletName);
      addCredential(credentialKey);
      setIsCreating(false);
      // navigate('/create');
    } catch (error: any) {
      console.log('ERR', error)
      console.log('error', error);
      setIsCreating(false);
      toast({
        title: error.message,
        status: 'error',
      });
    }
  }

  const createInitialWallet = async () => {
    const newAddress = await calcWalletAddress(0);
    const walletName = `Account 1`;
    setAddressList([{ title: walletName, address: newAddress, activatedChains: []}]);
    setEditingGuardiansInfo({});
    setSelectedCredentialId(credentials[0].id)
  };

  const createInitialSlotInfo = async () => {
    const keystore = chainConfig.contracts.l1Keystore;
    const initialKeys = await Promise.all(credentials.map((credential: any) => credential.publicKey))
    const initialGuardianHash = calcGuardianHash([], 0);
    const salt = ethers.ZeroHash;
    let initialGuardianSafePeriod = toHex(300);
    const initalkeysAddress = L1KeyStore.initialKeysToAddress(initialKeys);
    const initialKeyHash = L1KeyStore.getKeyHash(initalkeysAddress);
    const slot = L1KeyStore.getSlot(initialKeyHash, initialGuardianHash, initialGuardianSafePeriod);

    const slotInfo = {
      initialKeys,
      initialGuardianHash,
      initialGuardianSafePeriod,
      initalkeysAddress,
      initialKeyHash,
      slot
    };

    const walletInfo = {
      keystore,
      slot,
      slotInitInfo: {
        initialKeyHash,
        initialGuardianHash,
        initialGuardianSafePeriod
      },
      initialKeys: initalkeysAddress
    };

    const guardiansInfo = {
      keystore,
      slot,
      guardianHash: initialGuardianHash,
      guardianNames: [],
      guardianDetails: {
        guardians: [],
        threshold: 0,
        salt,
      },
    };

    const result = await api.guardian.backupSlot(walletInfo)
    setGuardiansInfo(guardiansInfo)
    setSlotInfo(slotInfo)
    console.log('createSlotInfo', slotInfo, walletInfo, guardiansInfo, result)
  };

  const onConfirm = async () => {
    try {
      setIsConfirming(true)
      await createInitialSlotInfo()
      await createInitialWallet()
      setIsConfirming(false)
      if(location.search){
        navigate({pathname: '/popup', search: location.search})
      }else{
        navigate('/wallet')
      }
    } catch (error: any) {
      setIsConfirming(false)
      console.log('error', error)
      toast({
        title: error.message,
        status: 'error',
      });
    }
  }

  if (status === 'editing') {
    return (
      <FullscreenContainer>
        <Box width="calc(100% - 40px)" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Box marginBottom="12px">
            <Steps
              backgroundColor="#1E1E1E"
              foregroundColor="white"
              count={3}
              activeIndex={2}
              marginTop="24px"
            />
          </Box>
          <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" marginBottom="20px">
            <Heading1 fontSize="24px">Setup guardians for social recovery</Heading1>
          </Box>
        </Box>
        <Box width="100%" bg="#EDEDED" borderRadius="20px" padding="45px" display="flex" alignItems="flex-start" justifyContent="space-around" margin="0 auto">
          <Box width="40%" marginRight="45px">
            <Heading1>Guardian</Heading1>
            <TextBody fontSize="18px" marginBottom="20px">Please enter Ethereum wallet address to set up guardians.</TextBody>
            <Box>
              <TextButton _styles={{ padding: '0', color: '#EC588D' }} _hover={{ color: '#EC588D' }} onClick={() => setIsModalOpen(true)}>
                Learn more
              </TextButton>
            </Box>
          </Box>
          <Box width="60%">
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
              <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                justifyContent="center"
                gap="12px"
                maxWidth="100%"
              >
                {guardianIds.map((id: any, i: number) => (
                  <Box position="relative" key={id}>
                    <DoubleFormInput
                      rightPlaceholder={`Guardian address ${i + 1}`}
                      rightValue={values[`address_${id}`]}
                      rightOnChange={onChange(`address_${id}`)}
                      rightOnBlur={onBlur(`address_${id}`)}
                      rightErrorMsg={showErrors[`address_${id}`] && errors[`address_${id}`]}
                      _rightInputStyles={
                      !!values[`address_${id}`]
                      ? {
                        fontFamily: 'Martian',
                        fontWeight: 600,
                        fontSize: '14px',
                      }
                      : {}
                      }
                      _rightContainerStyles={{ width: '70%', minWidth: '520px' }}
                      leftAutoFocus={id === guardianIds[0]}
                      leftPlaceholder="Name"
                      leftValue={values[`name_${id}`]}
                      leftOnChange={onChange(`name_${id}`)}
                      leftOnBlur={onBlur(`name_${id}`)}
                      leftErrorMsg={showErrors[`name_${id}`] && errors[`name_${id}`]}
                      leftComponent={
                        <Text color="#898989" fontWeight="600">
                          eth:
                        </Text>
                      }
                      _leftContainerStyles={{ width: '30%', minWidth: '240px' }}
                      onEnter={handleSubmit}
                      _styles={{ width: '100%', minWidth: '760px', fontSize: '16px' }}
                    />
                    {i > 0 && (
                      <Box
                        onClick={() => removeGuardian(id)}
                        position="absolute"
                        width="40px"
                        right="-40px"
                        top="0"
                        height="100%"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        cursor="pointer"
                      >
                        <Icon src={MinusIcon} />
                      </Box>
                    )}
                  </Box>
                ))}
                <TextButton onClick={() => addGuardian()} color="#EC588D" _hover={{ color: '#EC588D' }}>
                  <PlusIcon color="#EC588D" />
                  <Text fontSize="18px" marginLeft="5px">Add more guardians</Text>
                </TextButton>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box background="#EDEDED" borderRadius="20px" padding="20px 45px" display="flex" marginTop="36px">
          <Box width="40%" display="flex" alignItems="center">
            <Heading1 marginBottom="0">Threshold</Heading1>
          </Box>
          <Box width="60%" display="flex" alignItems="center">
            <TextBody>Wallet recovery requires</TextBody>
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
                   getNumberArray(amountData.guardiansCount || 0).map((i: any) => (
                     <MenuItem key={nanoid(4)} onClick={selectAmount(i)}>
                       {i}
                     </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Box>
            <TextBody>out of {amountData.guardiansCount || 0} guardian(s) confirmation. </TextBody>
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" marginTop="36px">
          <Button _styles={{ width: '300px', marginBottom: '12px' }} disabled={isCreating} loading={isCreating}>
            Confirm
          </Button>
          <TextButton loading={isConfirming} disabled={isConfirming || !credentials.length} onClick={onConfirm} _styles={{ width: '300px' }}>
            Set up later
          </TextButton>
        </Box>
      </FullscreenContainer>
    );
  }

  return (
    <FullscreenContainer>
      <Box width="calc(100% - 40px)" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Box marginBottom="12px">
          <Steps
            backgroundColor="#1E1E1E"
            foregroundColor="white"
            count={3}
            activeIndex={2}
            marginTop="24px"
          />
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
          <Heading1>Setup guardians for social recovery</Heading1>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" marginBottom="24px">
          <TextBody color="#1E1E1E" textAlign="center" fontSize="16px">
            Ensure your wallet's safety with a last step.
          </TextBody>
        </Box>
      </Box>
      <Box width="calc(100% - 40px)" bg="#EDEDED" borderRadius="20px" padding="45px" paddingRight="2px" display="flex" alignItems="flex-start" justifyContent="space-around" margin="0 auto">
        <Box width="40%" marginRight="45px">
          <Box marginBottom="16px">
            <Box display="flex" alignItems="center" justifyContent="flex-start">
              {/* <ArrowRightIcon /> */}
              <TextBody fontSize="16px" fontWeight="800">
                What is Soul Wallet guardian?
              </TextBody>
            </Box>
            <Box maxWidth="560px">
              <TextBody fontSize="14px" fontWeight="700">
                Guardians are Ethereum wallet addresses that assist you in recovering your wallet if needed. Soul Wallet replaces recovery phrases with guardian-signature social recovery, improving security and usability.
              </TextBody>
            </Box>
          </Box>
          <Box marginBottom="16px">
            <Box display="flex" alignItems="center" justifyContent="flex-start">
              <TextBody fontSize="16px" fontWeight="800">
                Who can be my guardians?
              </TextBody>
            </Box>
            <Box maxWidth="560px">
              <TextBody fontSize="14px" fontWeight="700">
                Choose trusted friends or use your existing Ethereum wallets as guardians. You can setup using regular Ethereum wallets (e.g MetaMask, Ledger, Coinbase Wallet, etc) and other Soul Wallets as your guardians. If choosing a Soul Wallet as your guardian, ensure it's activated on Ethereum for social recovery.
              </TextBody>
            </Box>
          </Box>
          <Box>
            <Box display="flex" alignItems="center" justifyContent="flex-start">
              <TextBody fontSize="16px" fontWeight="800">
                What is wallet recovery?
              </TextBody>
            </Box>
            <Box maxWidth="560px">
              <TextBody fontSize="14px" fontWeight="700">
                If your Soul Wallet is lost or stolen, social recovery helps you easily retrieve wallets with guardian signatures. The guardian list will be stored in an Ethereum-based keystore contract.
              </TextBody>
            </Box>
          </Box>
        </Box>
        <Box as="video" width="760px" aspectRatio="auto" borderRadius="24px" controls>
          <source src="https://static-assets.soulwallet.io/videos/guardians-and-recovery-intro.webm" type="video/webm" />
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" marginTop="20px">
        <Button onClick={startEdit} _styles={{ width: '300px', marginBottom: '12px' }}>
          Set up now
        </Button>
        <TextButton loading={isConfirming} disabled={isConfirming || !credentials.length} onClick={onConfirm} _styles={{ width: '300px' }}>
          Set up later
        </TextButton>
      </Box>
    </FullscreenContainer>
  );
}
