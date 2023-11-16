import React, { useState, useEffect, useRef } from 'react';
import FullscreenContainer from '@/components/FullscreenContainer';
import {
  Box,
  Text,
  Image,
  useToast,
  Select,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody
} from '@chakra-ui/react';
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
import ArrowDownIcon from '@/components/Icons/ArrowDown';
import api from '@/lib/api';
import MinusIcon from '@/assets/icons/minus.svg';
import IconButton from '@/components/web/IconButton';
import SendIcon from '@/components/Icons/Send';
import FormInput from '@/components/web/Form/FormInput';
import DoubleFormInput from '@/components/web/Form/DoubleFormInput';
import useWallet from '@/hooks/useWallet';
import useForm from '@/hooks/useForm';
import BN from 'bignumber.js'
import Icon from '@/components/Icon';
import { nextRandomId } from '@/lib/tools';
import DropDownIcon from '@/components/Icons/DropDown';
import PlusIcon from '@/components/Icons/Plus';
import QuestionIcon from '@/components/Icons/Question';
import DownloadIcon from '@/components/Icons/Download';
import useWalletContext from '@/context/hooks/useWalletContext';
import { nanoid } from 'nanoid';
import useTransaction from '@/hooks/useTransaction';
import GuardianModal from '@/pages/security/Guardian/GuardianModal'
import useTools from '@/hooks/useTools';

function SkipModal({ isOpen, onClose, doSkip, skipping }: any) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="#ededed" maxW={'480px'} display="flex" alignItems="center" justifyContent="flex-start" padding="30px" overflow="scroll">
        <Box width="320px">
          <Box
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            padding="20px"
            paddingTop="10px"
          >
            <WarningIcon />
          </Box>
          <Box marginBottom="16px">
            <Box display="flex" alignItems="center" justifyContent="flex-start">
              <TextBody fontSize="16px" fontWeight="800">
                What if I don’t set up guardians now?
              </TextBody>
            </Box>
            <Box maxWidth="100%">
              <TextBody fontSize="14px" fontWeight="500">
                Guardians are required to recover your wallet. You will need to pay a network fee when setting up your guardians after wallet creation.
              </TextBody>
            </Box>
          </Box>
          <Box marginBottom="16px">
            <Box display="flex" alignItems="center" justifyContent="flex-start">
              <TextBody fontSize="16px" fontWeight="800">
                Can I change my guardians in the future?
              </TextBody>
            </Box>
            <Box maxWidth="100%">
              <TextBody fontSize="14px" fontWeight="500">
                Yes. You can always setup or edit your guardians in your wallet. (Network fee will occur.)
              </TextBody>
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" marginTop="20px">
            <Button onClick={onClose} _styles={{ width: '320px', marginBottom: '12px' }}>
              Set up now
            </Button>
            <TextButton loading={skipping} disabled={skipping} onClick={doSkip} _styles={{ width: '320px', maxWidth: '320px', padding: '0 20px', whiteSpace: 'break-spaces' }}>
              {skipping ? 'Skipping' : 'I understand the risks, skip for now'}
            </TextButton>
          </Box>
        </Box>
      </ModalContent>
    </Modal>
  )
}

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
  const [isSkipOpen, setIsSkipOpen] = useState(false)
  const [showAdvance, setShowAdvance] = useState(false)
  const [keepPrivate, setKeepPrivate] = useState(false)
  const toast = useToast();
  const emailForm = useForm({
    fields: ['email'],
    validate,
  });

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
  const [isDone, setIsDone] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [skipping, setSkipping] = useState(false);
  const { generateJsonName, downloadJsonFile } = useTools()
  const { sendErc20, payTask } = useTransaction();
  const { showConfirmPayment } = useWalletContext();
  const createdGuardiansInfo = useRef<any>()

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

  const doSkip = async () => {
    try {
      setSkipping(true);
      await createInitialSlotInfo({
        guardians: [],
        guardianNames: [],
        threshold: 0
      })
      await createInitialWallet()
      setIsDone(true)
      setSkipping(false);
      setIsSkipOpen(false)
      changeStep(3)
    } catch (error: any) {
      console.log('error', error.message)
      setSkipping(false);
    }
  }

  const handleEmailBackupGuardians = async () => {
    try {
      setSending(true);
      let guardiansInfo

      if (createdGuardiansInfo.current) {
        guardiansInfo = createdGuardiansInfo.current
      } else {
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

        guardiansInfo = await createInitialSlotInfo({
          guardians: guardianAddresses,
          guardianNames,
          threshold
        })
        await createInitialWallet()
      }

      const filename = generateJsonName('guardian');
      await api.guardian.emailBackupGuardians({
        email: emailForm.values.email,
        filename,
        ...guardiansInfo
      });
      setSending(false);
      emailForm.clearFields(['email'])
      setIsDone(true)
      updateGuardiansInfo({
        requireBackup: false
      })
      toast({
        title: 'Email Backup Success!',
        status: 'success',
      });
    } catch (e: any) {
      setSending(false);
      toast({
        title: e.message,
        status: 'error',
      });
    }
  }

  const handleDownloadGuardians = async () => {
    try {
      setDownloading(true);
      let guardiansInfo

      if (createdGuardiansInfo.current) {
        guardiansInfo = createdGuardiansInfo.current
      } else {
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

        guardiansInfo = await createInitialSlotInfo({
          guardians: guardianAddresses,
          guardianNames,
          threshold
        })
        await createInitialWallet()
      }

      await downloadJsonFile(guardiansInfo);
      setDownloading(false);
      setIsDone(true)
      updateGuardiansInfo({
        requireBackup: false
      })
      toast({
        title: 'Email Backup Success!',
        status: 'success',
      });
    } catch (e: any) {
      setDownloading(false);
      toast({
        title: e.message,
        status: 'error',
      });
    }
  }

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

      const guardiansInfo = await createInitialSlotInfo({
        guardians: guardianAddresses,
        guardianNames,
        threshold
      })
      await createInitialWallet()
      await api.guardian.backupGuardians(guardiansInfo);
      setIsDone(true)
      setLoading(false);
      changeStep(3);
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

  const createInitialSlotInfo = async ({ guardians, guardianNames, threshold }: any) => {
    const keystore = chainConfig.contracts.l1Keystore;
    const initialKeys = await Promise.all(credentials.map((credential: any) => credential.publicKey))
    const initialGuardianHash = calcGuardianHash(guardians, threshold);
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
      guardianNames,
      guardianDetails: {
        guardians,
        threshold,
        salt,
      },
    };

    const result = await api.guardian.backupSlot(walletInfo)
    setGuardiansInfo(guardiansInfo)
    setSlotInfo(slotInfo)
    createdGuardiansInfo.current = guardiansInfo
    console.log('createSlotInfo', slotInfo, walletInfo, guardiansInfo, result)
    return guardiansInfo
  };

  if (status === 'backuping') {
    return (
      <FullscreenContainer>
        <Box width="320px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
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
            <Heading1>Backup guardians</Heading1>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" marginBottom="24px">
            <TextBody color="#1E1E1E" textAlign="center" fontSize="14px">
              Save your guardians list for easy wallet recovery.
            </TextBody>
          </Box>
          <Box>
            <Button
              onClick={handleDownloadGuardians}
              disabled={downloading}
              loading={downloading}
              _styles={{ width: '320px', marginTop: '12px' }}
              LeftIcon={<DownloadIcon />}
            >
              Download
            </Button>
            <TextBody marginTop="12px" textAlign="center">Or</TextBody>
            <FormInput
              label=""
              placeholder="Send to Email"
              value={emailForm.values.email}
              errorMsg={emailForm.showErrors.email && emailForm.errors.email}
              onChange={emailForm.onChange('email')}
              onBlur={emailForm.onBlur('email')}
              onEnter={handleEmailBackupGuardians}
              _styles={{ width: '320px', marginTop: '12px' }}
              _inputStyles={{ background: 'white' }}
              RightIcon={
                <IconButton
                  onClick={handleEmailBackupGuardians}
                  disabled={sending || !emailForm.values.email}
                  loading={sending}
                >
                  {!emailForm.values.email && <SendIcon opacity="0.4" />}
                  {!!emailForm.values.email && <SendIcon color={'#EE3F99'} />}
                </IconButton>
              }
            />
            <Button
              onClick={() => changeStep(3)}
              disabled={!isDone}
              _styles={{ width: '320px', marginTop: '45px' }}
            >
              Done
            </Button>
          </Box>
        </Box>
      </FullscreenContainer>
    )
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
            <Heading1>Setup guardians for social recovery</Heading1>
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
        <Box background="#EDEDED" borderRadius="20px" padding="16px 45px" display="flex" marginTop="36px">
          <Box width="40%" display="flex" alignItems="center">
            <Heading1 marginBottom="0">Threshold</Heading1>
          </Box>
          <Box width="60%" display="flex" alignItems="center" paddingLeft="20px">
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
        <TextButton onClick={() => setShowAdvance(!showAdvance)} color="#EC588D" _hover={{ color: '#EC588D' }} marginTop="20px">
          <Text fontSize="18px" marginRight="5px">Advance setting</Text>
          <Box transform={showAdvance ? 'rotate(-180deg)' : ''}><ArrowDownIcon color="#EC588D" /></Box>
        </TextButton>
        {showAdvance && (
          <Box background="#EDEDED" borderRadius="20px" padding="16px 45px" display="flex" marginTop="20px">
            <Box width="40%" display="flex" alignItems="center">
              <Heading1 marginBottom="0">
                Keep guardians private
              </Heading1>
              <Box height="100%" display="flex" alignItems="center" justifyContent="center" marginLeft="4px" paddingTop="4px" cursor="pointer">
                <Tooltip
                  label={(
                    <Box background="white" padding="28px 24px 28px 24px" width="100%" borderRadius="16px" boxShadow="0px 4px 4px 0px rgba(0, 0, 0, 0.4)">
                      <TextBody fontSize="16px" fontWeight="800">Privacy Setting</TextBody>
                      <TextBody fontSize="16px" fontWeight="600" marginBottom="20px">This setting will only reveal guardian address when you use the social recovery.</TextBody>
                      <TextBody fontSize="16px" fontWeight="600">But you need to enter the complete guardian list and threshold values for recovery.</TextBody>
                    </Box>
                  )}
                  placement="top"
                  background="transparent"
                  boxShadow="none"
                >
                  <span><QuestionIcon /></span>
                </Tooltip>
              </Box>
            </Box>
            <Box width="60%" display="flex" alignItems="center" paddingLeft="20px">
              <Box width="72px" height="40px" background={keepPrivate ? '#1CD20F' : '#D9D9D9'} borderRadius="40px" padding="5px" cursor="pointer" onClick={() => setKeepPrivate(!keepPrivate)} transition="all 0.2s ease" paddingLeft={keepPrivate ? '37px' : '5px'}>
                <Box width="30px" height="30px" background="white" borderRadius="30px" />
              </Box>
              <TextBody marginLeft="20px">Backup guardians in the next step for easy recovery.</TextBody>
            </Box>
          </Box>
        )}
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" marginTop="36px">
          <Button _styles={{ width: '320px', marginBottom: '12px' }} disabled={loading || disabled} loading={loading} onClick={keepPrivate ? () => startBackup() : () => handleSubmit()}>
            Confirm
          </Button>
          <TextButton loading={isConfirming} disabled={isConfirming || !credentials.length} onClick={() => setIsSkipOpen(true)} _styles={{ width: '320px' }}>
            Set up later
          </TextButton>
        </Box>
        <GuardianModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <SkipModal isOpen={isSkipOpen} onClose={() => setIsSkipOpen(false)} doSkip={doSkip} skipping={skipping} />
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
              <TextBody fontSize="16px" fontWeight="800">
                What is guardian?
              </TextBody>
            </Box>
            <Box maxWidth="560px">
              <TextBody fontSize="14px" fontWeight="700">
                Guardians are Ethereum wallets that help you get back into your wallet if you're locked out.
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
        <Button onClick={startEdit} _styles={{ width: '320px', marginBottom: '12px' }}>
          Set up now
        </Button>
        <TextButton loading={isConfirming} disabled={isConfirming || !credentials.length} onClick={() => setIsSkipOpen(true)} _styles={{ width: '320px' }}>
          Set up later
        </TextButton>
      </Box>
      <SkipModal isOpen={isSkipOpen} onClose={() => setIsSkipOpen(false)} doSkip={doSkip} skipping={skipping} />
    </FullscreenContainer>
  );
}
