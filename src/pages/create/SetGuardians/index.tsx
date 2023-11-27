import React, { useState, useEffect, useRef, Fragment } from 'react';
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
import { defaultGuardianSafePeriod } from '@/config';
import GreySection from '@/components/GreySection'
import Backup from '@/components/Guardian/Backup';
import Edit from '@/components/Guardian/Edit';

function SkipModal({ isOpen, onClose, doSkip, skipping }: any) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="#ededed"  maxW={{base: "360px", md: "480px"}} display="flex" alignItems="center" justifyContent="flex-start" padding="30px" overflow="auto">
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
              {skipping ? 'Skipping...' : 'I understand the risks, skip for now'}
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

const isGuardiansListFilled = (list: any) => {
  if (!list.length) return false

  let isFilled = true

  for (const item of list) {
    isFilled = isFilled && item
  }

  return isFilled
}

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

  const disabled = invalid || !guardiansList.length || amountForm.invalid || loading || !isGuardiansListFilled(guardiansList);

  useEffect(() => {
    setGuardiansList(
      Object.keys(values)
            .filter((key) => key.indexOf('address') === 0)
            .map((key) => values[key]) as any
      // .filter((address) => !!String(address).trim().length) as any,
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
      await api.guardian.backupGuardians(guardiansInfo);
      await createInitialWallet()
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
    let initialGuardianSafePeriod = toHex(defaultGuardianSafePeriod);
    const initialKeysAddress = L1KeyStore.initialKeysToAddress(initialKeys);
    const initialKeyHash = L1KeyStore.getKeyHash(initialKeysAddress);
    const slot = L1KeyStore.getSlot(initialKeyHash, initialGuardianHash, initialGuardianSafePeriod);

    const slotInfo = {
      initialKeys,
      initialGuardianHash,
      initialGuardianSafePeriod,
      initialKeysAddress,
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
      initialKeys: initialKeysAddress
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
      keepPrivate
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
        <Backup
          handleEmailBackupGuardians={handleEmailBackupGuardians}
          handleDownloadGuardians={handleDownloadGuardians}
          downloading={downloading}
          sending={sending}
          emailForm={emailForm}
          step={
            <Box marginBottom="12px">
              <Steps
                backgroundColor="#1E1E1E"
                foregroundColor="white"
                count={3}
                activeIndex={2}
                marginTop="24px"
              />
            </Box>
          }
          confirmButton={
            <Button
              onClick={() => changeStep(3)}
              disabled={!isDone}
              _styles={{ width: '320px', marginTop: '60px' }}
            >
              Continue
            </Button>
          }
        />
      </FullscreenContainer>
    )
  }

  if (status === 'editing') {
    return (
      <FullscreenContainer padding="16px">
        <Box width="100%" maxWidth="1200px" display="flex" flexDirection="column" alignItems="center" justifyContent="center" margin="0 auto">
          <Box marginBottom="12px">
            <Steps
              backgroundColor="#1E1E1E"
              foregroundColor="white"
              count={3}
              activeIndex={2}
              marginTop="24px"
            />
          </Box>
          <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" marginBottom="20px" margin="0 auto" textAlign="center">
            <Heading1>Setup guardians for social recovery</Heading1>
          </Box>
        </Box>
        <Edit
          description={
            <Fragment>
              <Heading1>Guardian</Heading1>
              <TextBody fontSize="18px" marginBottom="20px">Please enter Ethereum wallet address to set up guardians.</TextBody>
              <Box>
                <TextButton _styles={{ padding: '0', color: '#EC588D' }} _hover={{ color: '#EC588D' }} onClick={() => setIsModalOpen(true)}>
                  Learn more
                </TextButton>
              </Box>
            </Fragment>
          }
          guardianIds={guardianIds}
          guardiansList={guardiansList}
          values={values}
          onChange={onChange}
          onBlur={onBlur}
          showErrors={showErrors}
          errors={errors}
          addGuardian={addGuardian}
          removeGuardian={removeGuardian}
          handleSubmit={handleSubmit}
          amountForm={amountForm}
          amountData={amountData}
          showAdvance={showAdvance}
          setShowAdvance={setShowAdvance}
          loading={loading}
          disabled={disabled}
          hasGuardians={hasGuardians}
          selectAmount={selectAmount}
          keepPrivate={keepPrivate}
          setKeepPrivate={setKeepPrivate}
          formWidth={{ base: "100%", md: "760px" }}
          confirmButton={
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" marginTop="36px">
              <Button _styles={{ width: '320px', marginBottom: '12px' }} disabled={loading || disabled} loading={loading} onClick={keepPrivate ? () => startBackup() : () => handleSubmit()}>
                Confirm
              </Button>
              <TextButton loading={isConfirming} disabled={isConfirming || !credentials.length} onClick={() => setIsSkipOpen(true)} _styles={{ width: '320px' }}>
                Later
              </TextButton>
            </Box>
          }
        />
        <GuardianModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <SkipModal isOpen={isSkipOpen} onClose={() => setIsSkipOpen(false)} doSkip={doSkip} skipping={skipping} />
      </FullscreenContainer>
    )
  }

  return (
    <FullscreenContainer padding="16px">
      <Box width="100%" maxWidth="1200px" display="flex" flexDirection="column" alignItems="center" justifyContent="center" margin="0 auto" textAlign="center">
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
      <GreySection
        padding={{ base: '16px', md: '45px' }}
        leftPart={
          <Box>
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
                <TextBody fontSize="14px" fontWeight="700" marginBottom="20px">
                  Pick friends you trust or use your current Ethereum wallets as guardians for extra security.
                </TextBody>
                <TextBody fontSize="14px" fontWeight="700" marginBottom="20px">
                  Both EOA wallets (e.g MetaMask) and smart contract wallet are supported.
                </TextBody>
                <TextBody fontSize="14px" fontWeight="700" marginBottom="20px">
                  If choosing smart contract wallet as your guardian, make sure it's deployed on Ethereum.
                </TextBody>
              </Box>
            </Box>
            <Box>
              <Box display="flex" alignItems="center" justifyContent="flex-start">
                <TextBody fontSize="16px" fontWeight="800">
                  What is social recovery?
                </TextBody>
              </Box>
              <Box maxWidth="560px">
                <TextBody fontSize="14px" fontWeight="700">
                  If you lose your Soul Wallet, simply have your chosen friends (guardians) sign to recover it.
                </TextBody>
              </Box>
            </Box>
          </Box>
        }
        rightPart={
          <Box
            as="video"
            width="760px"
            aspectRatio="auto"
            borderRadius="24px"
            controls
          >
            <source src="https://static-assets.soulwallet.io/videos/guardians-and-recovery-intro.webm" type="video/webm" />
          </Box>
        }
      />
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" marginTop="20px">
        <Button onClick={startEdit} _styles={{ width: '320px', marginBottom: '12px' }}>
          Set up now
        </Button>
        <TextButton loading={isConfirming} disabled={isConfirming || !credentials.length} onClick={() => setIsSkipOpen(true)} _styles={{ width: '320px' }}>
          Later
        </TextButton>
      </Box>
      <SkipModal isOpen={isSkipOpen} onClose={() => setIsSkipOpen(false)} doSkip={doSkip} skipping={skipping} />
    </FullscreenContainer>
  );
}
