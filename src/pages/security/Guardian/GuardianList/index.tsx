import React, { useState, useRef, useImperativeHandle, useCallback, useEffect, Fragment } from 'react';
import { Box, Button, Text, Image, useToast, Select, Menu, MenuList, MenuButton, MenuItem } from '@chakra-ui/react';
import ArrowRightIcon from '@/components/Icons/ArrowRight';
import Heading1 from '@/components/web/Heading1';
import Heading3 from '@/components/web/Heading3';
import TextBody from '@/components/web/TextBody';
import RoundButton from '@/components/web/Button';
import TextButton from '@/components/web/TextButton';
import { ethers } from 'ethers';
import MinusIcon from '@/assets/icons/minus.svg';
import { DoubleFormInfo } from '@/components/web/Form/DoubleFormInput';
import useWallet from '@/hooks/useWallet';
import useForm from '@/hooks/useForm';
import Icon from '@/components/Icon';
import { nextRandomId } from '@/lib/tools';
import DropDownIcon from '@/components/Icons/DropDown';
import PlusIcon from '@/components/Icons/Plus';
import useWalletContext from '@/context/hooks/useWalletContext';
import { nanoid } from 'nanoid';

const defaultGuardianIds = [nextRandomId(), nextRandomId(), nextRandomId()];

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


export default function GuardianList({ onSubmit, loading, textButton, startBackup }: any) {
  const [guardianIds, setGuardianIds] = useState(defaultGuardianIds);
  const [fields, setFields] = useState(getFieldsByGuardianIds(defaultGuardianIds));
  const [guardiansList, setGuardiansList] = useState([]);
  const [amountData, setAmountData] = useState<any>({});
  const { account } = useWalletContext();

  const { values, errors, invalid, onChange, onBlur, showErrors, addFields, removeFields } = useForm({
    fields,
    validate,
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
    console.log('guardiansList', guardiansList);

    const guardianAddresses = guardiansList.map((item: any) => item.address);
    const guardianNames = guardiansList.map((item: any) => item.name);
    const threshold = amountForm.values.amount || 0;

    if (onSubmit) onSubmit(guardianAddresses, guardianNames, threshold);
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

  return (
    <Fragment>
      <Box background="#D9D9D9" borderRadius="20px" padding="45px" display="flex" marginBottom="20px">
        <Box width="40%" paddingRight="32px">
          <Heading1>Current guardian</Heading1>
          <TextBody fontSize="18px" marginBottom="20px">Choose trusted friends or use your existing Ethereum wallets as guardians.</TextBody>
          <Box>
            <TextButton _styles={{ padding: '0', color: '#EC588D' }} _hover={{ color: '#EC588D' }} onClick={() => {}}>
              Learn more
            </TextButton>
          </Box>
        </Box>
        <Box width="60%" overflow="scroll">
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="center"
              gap="0.75em"
              width="100%"
            >
              {guardianIds.map((id: any, i: number) => (
                <Box position="relative" width="100%" key={id}>
                  <DoubleFormInfo
                    rightPlaceholder={`Guardian address ${i + 1}`}
                    rightValue={'0xAAAA12345678E25FDa5f8a56B8e267fDaB6dS123'}
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
                    leftValue={'Vitalik'}
                    leftComponent={
                      <Text color="#898989" fontWeight="600">
                        eth:
                      </Text>
                    }
                    _leftContainerStyles={{ width: '30%', minWidth: '240px' }}
                    onEnter={handleSubmit}
                    _styles={{ width: '100%', minWidth: '760px', fontSize: '16px' }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box background="#D9D9D9" borderRadius="20px" padding="20px 45px" display="flex">
        <Box width="40%" display="flex" alignItems="center">
          <Heading1 marginBottom="0">Required confirmation</Heading1>
        </Box>
        <Box width="60%" display="flex" alignItems="center">
          <TextBody>Wallet recovery requires</TextBody>
          <Box width="80px" margin="0 10px">
            <Box
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
                1
                <DropDownIcon />
              </Box>
            </Box>
          </Box>
          <TextBody>out of 3 guardian(s) confirmation. </TextBody>
        </Box>
      </Box>
      <Box padding="40px">
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
          <RoundButton _styles={{ width: '320px', background: '#1E1E1E', color: 'white' }} _hover={{ background: '#1E1E1E', color: 'white' }} onClick={() => startBackup()}>
            Backup current guardians
          </RoundButton>
        </Box>
      </Box>
    </Fragment>
  )
}
