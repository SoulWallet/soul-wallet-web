import React, { useState, useRef, useImperativeHandle, useCallback, useEffect, Fragment } from 'react';
import { Box, Text, Image, useToast, Select, Menu, MenuList, MenuButton, MenuItem, Tooltip } from '@chakra-ui/react';
import FullscreenContainer from '@/components/FullscreenContainer';
import ArrowRightIcon from '@/components/Icons/ArrowRight';
import Heading1 from '@/components/web/Heading1';
import Heading3 from '@/components/web/Heading3';
import TextBody from '@/components/web/TextBody';
import Button from '@/components/web/Button';
import TextButton from '@/components/web/TextButton';
import { ethers } from 'ethers';
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
import ArrowDownIcon from '@/components/Icons/ArrowDown';
import QuestionIcon from '@/components/Icons/Question';
import DownloadIcon from '@/components/Icons/Download';
import useWalletContext from '@/context/hooks/useWalletContext';
import { useAddressStore } from '@/store/address';
import { nanoid } from 'nanoid';
import { useGuardianStore } from '@/store/guardian';
import useKeystore from '@/hooks/useKeystore';
import useConfig from '@/hooks/useConfig';
import { L1KeyStore } from '@soulwallet/sdk';
import useTransaction from '@/hooks/useTransaction';
import api from '@/lib/api';
import { useCredentialStore } from '@/store/credential';
import useTools from '@/hooks/useTools';
import ArrowLeftIcon from '@/components/Icons/ArrowLeft';
import GreySection from '@/components/GreySection'
import Backup from '@/components/Guardian/Backup';
import Edit from '@/components/Guardian/Edit';
import GuardianModal from '../GuardianModal'
import DoubleCheckModal from '../DoubleCheckModal'

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

export default function GuardianForm({ cancelEdit, startBackup, startGuardianInterval }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const { guardiansInfo, updateGuardiansInfo } = useGuardianStore();
  const guardianDetails = (guardiansInfo && guardiansInfo.guardianDetails) || {
    guardians: [],
    threshold: 0
  }
  const guardianNames = (guardiansInfo && guardiansInfo.guardianNames) || []
  const { setFinishedSteps } = useAddressStore();
  const defaultGuardianIds = getDefaultGuardianIds((guardianDetails.guardians && guardianDetails.guardians.length > 1 && guardianDetails.guardians.length) || 1)
  const [guardianIds, setGuardianIds] = useState(defaultGuardianIds);
  const [fields, setFields] = useState(getFieldsByGuardianIds(defaultGuardianIds));
  const [guardiansList, setGuardiansList] = useState([]);
  const [amountData, setAmountData] = useState<any>({});
  const { slotInfo, setGuardiansInfo, setEditingGuardiansInfo } = useGuardianStore();
  const { getReplaceGuardianInfo, calcGuardianHash, getSlot } = useKeystore();
  const { chainConfig } = useConfig();
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(false);
  const { sendErc20, payTask } = useTransaction();
  const { showConfirmPayment } = useWalletContext();
  const { credentials } = useCredentialStore();
  const [showAdvance, setShowAdvance] = useState(false)
  const [keepPrivate, setKeepPrivate] = useState(!!guardiansInfo.keepPrivate)
  const [status, setStatus] = useState<string>('editing');
  const [isDone, setIsDone] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sending, setSending] = useState(false);
  const { generateJsonName, downloadJsonFile } = useTools()
  const toast = useToast();
  const emailForm = useForm({
    fields: ['email'],
    validate,
  });

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

  const handleSubmit = async () => {
    setIsConfirmOpen(false)
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
      const rawKeys = new ethers.AbiCoder().encode(["bytes32[]"], [currentKeys]);
      const initialKeyHash = L1KeyStore.getKeyHash(initialKeys);

      const walletInfo = {
        keystore,
        slot,
        slotInfo: {
          initialKeyHash,
          initialGuardianHash,
          initialGuardianSafePeriod
        },
        keys: initialKeys
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
        requireBackup: true,
        keepPrivate
      };

      await api.guardian.backupGuardians(guardiansInfo);

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
      console.log('handleSubmit1111', res1, res2, res3);
      // setGuardiansInfo(guardiansInfo)
      setEditingGuardiansInfo(guardiansInfo)
      setPending(true)
      await startGuardianInterval()
      cancelEdit()
      setLoading(false);
      setPending(false)
      const res = await api.operation.finishStep({
        slot,
        steps: [2],
      })
      setFinishedSteps(res.data.finishedSteps);
    } catch (error: any) {
      console.log('error', error.message)
      setLoading(false);
    }
  };

  useEffect(() => {
    const test = async () => {
      const result2 = await api.guardian.getTask({
        taskID: '0xfc1e5a082b9d06f4031108b18c160c730fde805e391e1a306474d2f370e61a63'
      })
      console.log('taskID', result2);
    }

    test()
  }, [])

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

  const handleEmailBackupGuardians = async () => {
    try {
      setSending(true);
      const keystore = chainConfig.contracts.l1Keystore;
      const slot = slotInfo.slot
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
      const guardianHash = calcGuardianHash(guardianAddresses, threshold);
      const salt = ethers.ZeroHash;

      const guardiansInfo = {
        keystore,
        slot,
        guardianHash,
        guardianNames,
        guardianDetails: {
          guardians: guardianAddresses,
          threshold,
          salt,
        },
        keepPrivate
      };

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
      const keystore = chainConfig.contracts.l1Keystore;
      const slot = slotInfo.slot
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
      const guardianHash = calcGuardianHash(guardianAddresses, threshold);
      const salt = ethers.ZeroHash;

      const guardiansInfo = {
        keystore,
        slot,
        guardianHash,
        guardianNames,
        guardianDetails: {
          guardians: guardianAddresses,
          threshold,
          salt,
        },
        keepPrivate
      };

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

  const goBack = () => {
    setStatus('editing');
  };

  if (status === 'backuping') {
    return (
      <Backup
        handleEmailBackupGuardians={handleEmailBackupGuardians}
        handleDownloadGuardians={handleDownloadGuardians}
        downloading={downloading}
        sending={sending}
        emailForm={emailForm}
        backButton={
          <Box width="100%">
            <TextButton
              color="#1E1E1E"
              fontSize="16px"
              fontWeight="800"
              width="57px"
              padding="0"
              alignItems="center"
              justifyContent="center"
              onClick={goBack}
            >
              <ArrowLeftIcon />
              <Box marginLeft="2px" fontSize="16px">Back</Box>
            </TextButton>
          </Box>
        }
        confirmButton={
          <Button
            onClick={handleSubmit}
            disabled={!isDone || loading || disabled}
            loading={loading}
            _styles={{ width: '320px', marginTop: '60px' }}
          >
            Continue
          </Button>
        }
      />
    )
  }

  return (
    <Fragment>
      <Edit
        description={
          <Fragment>
            <Heading1>Guardians</Heading1>
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
        handleSubmit={() => setIsConfirmOpen(false)}
        amountForm={amountForm}
        amountData={amountData}
        showAdvance={showAdvance}
        setShowAdvance={setShowAdvance}
        loading={loading}
        disabled={disabled}
        hasGuardians={hasGuardians}
        cancelEdit={cancelEdit}
        selectAmount={selectAmount}
        keepPrivate={keepPrivate}
        setKeepPrivate={setKeepPrivate}
        confirmButton={
          <Box padding="40px">
            <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
              <Button disabled={loading || disabled} loading={loading} _styles={{ width: '320px', background: '#1E1E1E', color: 'white' }} _hover={{ background: '#1E1E1E', color: 'white' }} onClick={() => setIsConfirmOpen(true)}>
                {pending ? 'Pending...' : 'Confirm'}
              </Button>
              {hasGuardians && (
                <TextButton _styles={{ width: '320px' }} onClick={cancelEdit}>
                  Cancel
                </TextButton>
              )}
            </Box>
          </Box>
        }
      />
      <GuardianModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <DoubleCheckModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onSubmit={keepPrivate ? () => { setIsConfirmOpen(false); setStatus('backuping'); } : () => handleSubmit()} />
    </Fragment>
  )
}
