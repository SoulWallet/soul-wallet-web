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
import DoubleFormInput from '@/components/web/Form/DoubleFormInput';
import useWallet from '@/hooks/useWallet';
import useForm from '@/hooks/useForm';
import BN from 'bignumber.js'
import Icon from '@/components/Icon';
import { nextRandomId } from '@/lib/tools';
import DropDownIcon from '@/components/Icons/DropDown';
import PlusIcon from '@/components/Icons/Plus';
import useWalletContext from '@/context/hooks/useWalletContext';
import { useAddressStore } from '@/store/address';
import { nanoid } from 'nanoid';
import { useGuardianStore } from '@/store/guardian';
import useKeystore from '@/hooks/useKeystore';
import useConfig from '@/hooks/useConfig';
import { L1KeyStore } from '@soulwallet/sdk';
import useTransaction from '@/hooks/useTransaction';
import api from '@/lib/api';

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

export default function GuardianForm({ cancelEdit, startBackup }: any) {
  const { guardiansInfo } = useGuardianStore();
  const guardianDetails = guardiansInfo.guardianDetails
  const threshold = guardianDetails.threshold
  const { selectedAddress } = useAddressStore();
  const defaultGuardianIds = getDefaultGuardianIds((guardianDetails.guardians && guardianDetails.guardians.length > 3 && guardianDetails.guardians.length) || 3)
  const [guardianIds, setGuardianIds] = useState(defaultGuardianIds);
  const [fields, setFields] = useState(getFieldsByGuardianIds(defaultGuardianIds));
  const [guardiansList, setGuardiansList] = useState([]);
  const [amountData, setAmountData] = useState<any>({});
  const { slotInfo, setGuardiansInfo } = useGuardianStore();
  const { getReplaceGuardianInfo, calcGuardianHash, getSlot } = useKeystore();
  const { chainConfig } = useConfig();
  const [loading, setLoading] = useState(false);
  const { sendErc20, payTask } = useTransaction();

  const { values, errors, invalid, onChange, onBlur, showErrors, addFields, removeFields } = useForm({
    fields,
    validate,
    initialValues: getInitialValues(defaultGuardianIds, guardianDetails.guardians, guardiansInfo.guardianNames)
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
      const { initialKeys, initialGuardianHash, initialGuardianSafePeriod } = slotInfo;
      const initalkeysAddress = L1KeyStore.initialKeysToAddress(initialKeys);
      const initalRawkeys = new ethers.AbiCoder().encode(["bytes32[]"], [initalkeysAddress]);
      const initialKeyHash = L1KeyStore.getKeyHash(initalkeysAddress);
      console.log('initalkeys', initialKeys, initalkeysAddress, initalRawkeys);
      const slot = getSlot(initialKeys, initialGuardianHash, initialGuardianSafePeriod)

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
      };

      // const res1 = await api.guardian.backupWallet(walletInfo)

      const { keySignature } = await getReplaceGuardianInfo(newGuardianHash)

      const functionName = `setGuardian(bytes32,bytes32,uint256,bytes32,bytes,bytes)`
      const parameters = [
        initialKeyHash,
        initialGuardianHash,
        initialGuardianSafePeriod,
        newGuardianHash,
        initalRawkeys,
        keySignature,
      ]
      const result = await api.guardian.createTask({
        keystore,
        functionName,
        parameters
      })
      /* {
       *   "taskID": "0xfc1e5a082b9d06f4031108b18c160c730fde805e391e1a306474d2f370e61a63",
       *   "status": 0,
       *   "estiamtedFee": "0x1e7601b1a4db9",
       *   "transactionHash": ""
       * } */
      const task = result.data
      const txns = [{
        data: '0x',
        to: '0x22979c5a68932bbed6004c8cb106ea15219accdc',
        value: task.estiamtedFee
      }]
      // await showSignPayment(txns)
      // await sendEth('0x22979c5a68932bbed6004c8cb106ea15219accdc', BN(task.estiamtedFee).shiftedBy(-18).toString())
      await payTask('0x22979c5a68932bbed6004c8cb106ea15219accdc', BN(task.estiamtedFee).toString(), task.taskID);
      setGuardiansInfo(guardiansInfo)
      startBackup()
      // await api.guardian.backupGuardians(guardiansInfo)
      // 0x9e584021d6d66154f24b15156fa9bc23f8ab1903a92e01e20a4756b45902f2e3
      console.log('handleSubmit', result, txns);
      setLoading(false);
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

  return (
    <Fragment>
      <Box background="#D9D9D9" borderRadius="20px" padding="45px" display="flex" marginBottom="20px" overflow="scroll">
        <Box width="40%" paddingRight="32px">
          <Heading1>Friend as guardian</Heading1>
          <TextBody fontSize="18px" marginBottom="20px">Choose trusted friends or use your existing Ethereum wallets as guardians.</TextBody>
          <Box>
            <TextButton _styles={{ padding: '0', color: '#EC588D' }} _hover={{ color: '#EC588D' }} onClick={() => {}}>
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
      <Box background="#D9D9D9" borderRadius="20px" padding="20px 45px" display="flex">
        <Box width="40%" display="flex" alignItems="center">
          <Heading1 marginBottom="0">Required confirmation</Heading1>
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
      <Box padding="40px">
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
          <RoundButton disabled={loading} loading={loading} _styles={{ width: '320px', background: '#1E1E1E', color: 'white' }} _hover={{ background: '#1E1E1E', color: 'white' }} onClick={handleSubmit}>
            Confirm guardians
          </RoundButton>
          <TextButton _styles={{ width: '320px' }} onClick={cancelEdit}>
            Cancel
          </TextButton>
        </Box>
      </Box>
    </Fragment>
  )
}
