import { useState, useRef, useCallback, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { ethers } from 'ethers';
import useForm from '@/hooks/useForm';
import { nextRandomId } from '@/lib/tools';
import useWalletContext from '@/context/hooks/useWalletContext';
import { useGuardianStore } from '@/store/guardian';
import { useSlotStore } from '@/store/slot';
import useKeystore from '@/hooks/useKeystore';
import useConfig from '@/hooks/useConfig';
import useTransaction from '@/hooks/useTransaction';
import { useSignerStore } from '@/store/signer';
import useTools from '@/hooks/useTools';
import Edit from './Edit';
import { useSettingStore } from '@/store/setting';
import { useTempStore } from '@/store/temp';

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

const toLowerCase = (str: any) => {
  return (typeof str === 'string') ? str.toLowerCase() : null
}

const validate = (values: any, props: any = {}, callbackRef: any) => {
  let errors: any = {};
  const addressKeys = Object.keys(values).filter((key) => key.indexOf('address') === 0);
  const nameKeys = Object.keys(values).filter((key) => key.indexOf('name') === 0);
  const existedAddress = [];
  const { editType, eoas, getEditingGuardiansInfo } = props

  for (const addressKey of addressKeys) {
    const address = values[addressKey];

    if (address && address.length && !ethers.isAddress(address)) {
      errors[addressKey] = 'Invalid Address';
    } else if (existedAddress.map((address: any) => toLowerCase(address)).filter((address: any) => !!address).indexOf((toLowerCase(address))) !== -1) {
      errors[addressKey] = 'Address already in use';
    } else if (address && address.length) {
      existedAddress.push(address);
    }

    if (callbackRef) {
      const externalErrors = callbackRef(values) || {}
      errors = { ...errors, ...externalErrors }
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
  },
  guardianNames: []
}

export default function GuardianForm({
  cancelEdit,
  onConfirm,
  onBack,
  canGoBack,
  editType
}: any) {
  const { getAddressName } = useSettingStore();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const tempStore = useTempStore()
  const {
    getEditingGuardiansInfo,
    getEditingSingleGuardiansInfo,
    createInfo
  } = tempStore;
  const guardiansInfo = (editType === 'edit') ? getEditingGuardiansInfo() : (
    editType === 'add' ? defaultGuardianInfo : getEditingSingleGuardiansInfo()
  );
  const guardianDetails = guardiansInfo.guardianDetails || {
    guardians: [],
    threshold: 0
  }
  const guardianNames = (guardiansInfo && guardiansInfo.guardianDetails && guardiansInfo.guardianDetails.guardians && guardiansInfo.guardianDetails.guardians.map((address: any) => getAddressName(address && address.toLowerCase()))) || []
  const defaultGuardianIds = getDefaultGuardianIds((guardianDetails.guardians && guardianDetails.guardians.length > 1 && guardianDetails.guardians.length) || 1)
  const [guardianIds, setGuardianIds] = useState(defaultGuardianIds);
  const [fields, setFields] = useState(getFieldsByGuardianIds(defaultGuardianIds));
  const [guardiansList, setGuardiansList] = useState([]);
  const [amountData, setAmountData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const { eoas } = useSignerStore();
  const [showAdvance, setShowAdvance] = useState(false)
  const [keepPrivate, setKeepPrivate] = useState(!!guardiansInfo.keepPrivate)
  const [status, setStatus] = useState<string>('editing');

  const externalValidate = useCallback((values: any) => {
    const errors: any = {}
    const addressKeys = Object.keys(values).filter((key) => key.indexOf('address') === 0);

    for (const addressKey of addressKeys) {
      const address = values[addressKey];

      if (eoas.indexOf(address) !== -1) {
        errors[addressKey] = 'Can not use signer as guardian';
      } else if (editType === 'add') {
        const editingGuardiansInfo = getEditingGuardiansInfo()
        const guardians = editingGuardiansInfo.guardianDetails ? (editingGuardiansInfo.guardianDetails.guardians || []) : []

        if (guardians.map((address: any) => toLowerCase(address)).filter((address: any) => !!address).indexOf(toLowerCase(address)) !== -1) {
          errors[addressKey] = 'Address already in use';
        }
      }

      if (createInfo && createInfo.eoaAddress && createInfo.eoaAddress.map((address: any) => toLowerCase(address)).filter((address: any) => !!address).indexOf(toLowerCase(address)) !== -1) {
        errors[addressKey] = 'This address is already been used as signer.';
      }
    }

    return errors
  }, [editType, eoas, createInfo.eoaAddress])

  const { values, errors, invalid, onChange, onBlur, showErrors, addFields, removeFields, onChangeValues } = useForm({
    fields,
    validate,
    initialValues: getInitialValues(defaultGuardianIds, guardianDetails.guardians, guardianNames),
    callbackRef: externalValidate
  });

  const amountForm = useForm({
    fields: ['amount'],
    validate: amountValidate,
    restProps: amountData,
    initialValues: {
      amount: getRecommandCount(amountData.guardiansCount),
    },
  });

  const disabled = invalid || !guardiansList.length || loading || !isGuardiansListFilled(guardiansList);

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

  const handleConfirm = useCallback(() => {
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

      if (editType === 'editSingle') {
        const info = getEditingSingleGuardiansInfo()
        onConfirm(guardianAddresses, guardianNames, info.i)
      } else {
        onConfirm(guardianAddresses, guardianNames)
      }
    }
  }, [editType, values])

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
      keepPrivate={keepPrivate}
      setKeepPrivate={setKeepPrivate}
      canGoBack={canGoBack}
      editType={editType}
    />
  )
}
