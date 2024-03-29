import { useState, useEffect } from 'react';

const getInitialValues = (fields: any, values: any = {}) => {
  const initialValues: any = {};

  for (const fieldName of fields) {
    initialValues[fieldName] = values[fieldName] || '';
  }

  return initialValues;
};

export default function useForm(props: any) {
  const { fields, validate, restProps, initialValues, callbackRef } = props;
  const [values, setValues] = useState<any>(getInitialValues(fields, initialValues));
  const [errors, setErrors] = useState<any>({});
  const [showErrors, setShowErrors] = useState<any>({});
  const [invalid, setInvalid] = useState<boolean>(true);
  const [pristine, setPristine] = useState<boolean>(true);

  useEffect(() => {
    const errors = validate(values, restProps, callbackRef);
    // console.log('validate', values, restProps);
    setErrors(errors);

    if (Object.keys(errors).length) {
      setInvalid(true);
    } else {
      setInvalid(false);
    }
  }, [values, restProps, callbackRef]);

  useEffect(() => {
    // console.log('fields', getInitialValues(fields, values))
  }, [fields]);

  const onChange = (fieldName: string) => (value: any) => {
    setValues({ ...values, [fieldName]: value });
  };

  const onChangeValues = (newValues: any) => {
    setValues({ ...values, ...newValues });
  };

  const onBlur = (fieldName: string) => (value: any) => {
    if (!!values[fieldName]) {
      setShowErrors({ ...showErrors, [fieldName]: true });
    }
  };

  const addFields = (fieldNames: string[]) => {
    const newValues = { ...values };

    for (const fieldName of fieldNames) {
      newValues[fieldName] = newValues[fieldName] || '';
    }

    setValues(newValues);
  };

  const removeFields = (fieldNames: string[]) => {
    const newValues = { ...values };

    for (const fieldName of fieldNames) {
      delete newValues[fieldName];
    }

    setValues(newValues);
  };

  const clearFields = (fieldNames: string[]) => {
    const newValues = { ...values };

    for (const fieldName of fieldNames) {
      newValues[fieldName] = '';
    }

    setValues(newValues);
  };

  return {
    values,
    errors,
    invalid,
    pristine,
    onChange,
    onBlur,
    showErrors,
    addFields,
    removeFields,
    clearFields,
    onChangeValues
  };
}
