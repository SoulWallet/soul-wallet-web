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
import { useSlotStore } from '@/store/slot';
import useKeystore from '@/hooks/useKeystore';
import useConfig from '@/hooks/useConfig';
import { L1KeyStore } from '@soulwallet/sdk';
import useTransaction from '@/hooks/useTransaction';
import api from '@/lib/api';
import { useSignerStore } from '@/store/signer';
import useTools from '@/hooks/useTools';
import ArrowLeftIcon from '@/components/Icons/ArrowLeft';
import GreySection from '@/components/GreySection'
import Backup from '@/components/Guardian/Backup';
import Edit from './Edit';
import { useSettingStore } from '@/store/setting';
import { useTempStore } from '@/store/temp';

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

const defaultGuardianInfo = {
  guardianDetails: {
    guardians: [],
    threshold: 0
  }
}

export default function GuardianForm({
  cancelEdit,
  startGuardianInterval,
  onConfirm,
  onBack,
  canGoBack
}: any) {
  const { getAddressName, setFinishedSteps, saveAddressName } = useSettingStore();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const tempStore = useTempStore()
  const { recoverInfo } = tempStore;
  const guardianDetails = recoverInfo.guardianDetails || {
    guardians: [],
    threshold: 0
  }
  const guardianNames = (recoverInfo && recoverInfo.guardianNames) || []
  const defaultGuardianIds = getDefaultGuardianIds((guardianDetails.guardians && guardianDetails.guardians.length > 1 && guardianDetails.guardians.length) || 1)
  const [guardianIds, setGuardianIds] = useState(defaultGuardianIds);
  const [fields, setFields] = useState(getFieldsByGuardianIds(defaultGuardianIds));
  const [guardiansList, setGuardiansList] = useState([]);
  const [amountData, setAmountData] = useState<any>({});
  const { setGuardiansInfo, setEditingGuardiansInfo } = useGuardianStore();
  const { slotInfo } = useSlotStore()
  const { getReplaceGuardianInfo, calcGuardianHash, getSlot } = useKeystore();
  const { chainConfig } = useConfig();
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(false);
  const { sendErc20, payTask } = useTransaction();
  const { showConfirmPayment } = useWalletContext();
  const { credentials } = useSignerStore();
  const [showAdvance, setShowAdvance] = useState(false)
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

  const { values, errors, invalid, onChange, onBlur, showErrors, addFields, removeFields, onChangeValues } = useForm({
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

  const handleConfirm = () => {
    if (onConfirm) {
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
      const threshold = amountForm.values.amount

      onConfirm(guardianAddresses, guardianNames, threshold)
    }
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    }
  }

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

  const goBack = () => {
    setStatus('editing');
  };

  return (
    <Edit
      guardianIds={guardianIds}
      guardiansList={guardiansList}
      values={values}
      onChange={onChange}
      onChangeValues={onChangeValues}
      onBlur={onBlur}
      showErrors={showErrors}
      errors={errors}
      addGuardian={addGuardian}
      removeGuardian={removeGuardian}
      handleSubmit={() => setIsConfirmOpen(false)}
      handleConfirm={handleConfirm}
      handleBack={handleBack}
      amountForm={amountForm}
      amountData={amountData}
      showAdvance={showAdvance}
      setShowAdvance={setShowAdvance}
      loading={loading}
      disabled={disabled}
      hasGuardians={hasGuardians}
      cancelEdit={cancelEdit}
      selectAmount={selectAmount}
      canGoBack={canGoBack}
    />
  )
}
