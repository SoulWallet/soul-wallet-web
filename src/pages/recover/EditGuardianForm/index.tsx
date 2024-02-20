import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import useForm from '@/hooks/useForm';
import { nextRandomId } from '@/lib/tools';
import Edit from './Edit';
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
      errors[addressKey] = 'Address already in use';
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

export default function GuardianForm({
  cancelEdit,
  onConfirm,
  onBack,
  canGoBack
}: any) {
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
  const [loading] = useState(false);
  const [showAdvance, setShowAdvance] = useState(false)

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
