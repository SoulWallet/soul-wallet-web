import React, { useState, useRef, useImperativeHandle, useCallback, useEffect, Fragment } from 'react';
import { Box, Text, Image, useToast, Select, Menu, MenuList, MenuButton, MenuItem, Tooltip } from '@chakra-ui/react';
import FullscreenContainer from '@/components/FullscreenContainer';
import ArrowRightIcon from '@/components/Icons/ArrowRight';
import Heading1 from '@/components/web/Heading1';
import Heading3 from '@/components/web/Heading3';
import TextBody from '@/components/web/TextBody';
import Button from '@/components/Button'
import TextButton from '@/components/web/TextButton';
import { ethers } from 'ethers';
import MinusIcon from '@/assets/icons/minus.svg';
import IconButton from '@/components/web/IconButton';
import SendIcon from '@/components/Icons/Send';
import FormInput from '@/components/web/Form/FormInput';
import DoubleFormInput from '@/components/new/DoubleFormInput';
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
import { useSignerStore } from '@/store/signer';
import useTools from '@/hooks/useTools';
import ArrowLeftIcon from '@/components/Icons/ArrowLeft';
import GreySection from '@/components/GreySection'
import config from '@/config';
import Backup from '@/components/Guardian/Backup';
import { toShortAddress } from '@/lib/tools';
import ENSResolver, { extractENSAddress, isENSAddress } from '@/components/ENSResolver'
import { ensContractAddress } from '@/config'

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

// const getInitialValues = (ids: string[], guardians: string[], guardianNames: string[]) => {
//   const idCount = ids.length;
//   const guardianCount = guardians.length;
//   const count = idCount > guardianCount ? idCount : guardianCount;
//   const values: any = {};

//   for (let i = 0; i < count; i++) {
//     if (ids[i]) {
//       values[`address_${ids[i]}`] = guardians[i];
//       values[`name_${ids[i]}`] = guardianNames[i];
//     }
//   }

//   return values;
// };

const isGuardiansListFilled = (list: any) => {
  if (!list.length) return false

  let isFilled = true

  for (const item of list) {
    isFilled = isFilled && item
  }

  return isFilled
}

const GuardianInput = ({
  id,
  values,
  showErrors,
  errors,
  guardianIds,
  onChange,
  onBlur,
  handleSubmit,
  removeGuardian,
  onChangeValues,
  handleConfirm,
  i
}: any) => {
  const [isENSOpen, setIsENSOpen] = useState(false)
  const [isENSLoading, setIsENSLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchAddress, setSearchAddress] = useState('')
  const [resolvedAddress, setResolvedAddress] = useState('')

  const activeENSNameRef = useRef()
  const menuRef = useRef()
  const inputRef = useRef()

  const inputOnChange = (id: any, value: any) => {
    onChange(`address_${id}`)(value)
    setSearchText(value)

    if (extractENSAddress(value)) {
      setIsENSOpen(true)
    } else {
      setIsENSOpen(false)
    }
  }

  const inputOnFocus = (id: any, value: any) => {
    setSearchText(value)

    if (extractENSAddress(value)) {
      setIsENSOpen(true)
    } else {
      setIsENSOpen(false)
    }
  }

  const inputOnBlur = (id: any, value: any) => {
    if (value) {
      onBlur(`address_${id}`)(value)
    }
  }

  const setMenuRef = (value: any) => {
    menuRef.current = value
  }

  const setInputRef = (value: any) => {
    inputRef.current = value
  }

  const setActiveENSNameRef = (value: any) => {
    activeENSNameRef.current = value
  }

  const getActiveENSNameRef = (value: any) => {
    return activeENSNameRef.current
  }

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (inputRef.current && !(inputRef.current as any).contains(event.target) && menuRef.current && !(menuRef.current as any).contains(event.target)) {
        setIsENSOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const submitENSName = (name: any) => {
    console.log('submitENSName', resolvedAddress)
    setIsENSOpen(false)
    onChangeValues({
      [`name_${id}`]: name,
      [`address_${id}`]: resolvedAddress,
    })
  }

  return (
    <Box position="relative" key={id} width="100%">
      <DoubleFormInput
        rightPlaceholder={`ENS or Ethereum wallet address`}
        rightValue={values[`address_${id}`]}
        rightOnChange={(value: any) => inputOnChange(id, value)}
        rightOnFocus={(value: any,) => inputOnFocus(id, value)}
        rightOnBlur={(value: any) => inputOnBlur(id, value)}
        setRightInput={setInputRef}
        rightErrorMsg={showErrors[`address_${id}`] && errors[`address_${id}`]}
        _rightInputStyles={{
          fontWeight: 600,
          fontSize: '14px',
          fontFamily: 'Nunito'
        }}
        _rightContainerStyles={{
          width: { base: 'calc(100%)', 'md': 'calc(100% - 240px)' },
          zIndex: 0
        }}
        leftAutoFocus={id === guardianIds[0]}
        leftPlaceholder="Guardian Name (optinal)"
        leftValue={values[`name_${id}`]}
        leftOnChange={onChange(`name_${id}`)}
        leftOnBlur={onBlur(`name_${id}`)}
        leftErrorMsg={showErrors[`name_${id}`] && errors[`name_${id}`]}
        leftComponent={
          <Text color="#898989" fontWeight="600">
            {import.meta.env.VITE_MAINNET_ADDRESS_PREFIX}
          </Text>
        }
        _leftContainerStyles={{
          width: { base: '100%', 'md': '240px' },
          marginBottom: { base: '20px', 'md': '0' },
        }}
        _leftInputStyles={{
          fontWeight: 600,
          fontSize: '14px',
          fontFamily: 'Nunito'
        }}
        onEnter={handleSubmit}
        _styles={{ width: '100%', fontSize: '16px' }}
      />
      {i > 0 && (
        <Box
          onClick={() => removeGuardian(id)}
          position="absolute"
          width="40px"
          right={{ base: '-28px', md: '-40px' }}
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
      <ENSResolver
        _styles={{
          width: "calc(100% - 240px)",
          top: "50px",
          left: "240px",
          right: "0",
        }}
        isENSOpen={isENSOpen}
        setIsENSOpen={setIsENSOpen}
        isENSLoading={isENSLoading}
        setIsENSLoading={setIsENSLoading}
        searchText={searchText}
        setSearchText={setSearchText}
        searchAddress={searchAddress}
        setSearchAddress={setSearchAddress}
        resolvedAddress={resolvedAddress}
        setResolvedAddress={setResolvedAddress}
        setMenuRef={setMenuRef}
        submitENSName={submitENSName}
        setActiveENSNameRef={setActiveENSNameRef}
        getActiveENSNameRef={getActiveENSNameRef}
      />
    </Box>
  )
}

export default function Edit({
  description,
  guardianIds,
  guardiansList,
  values,
  onChange,
  onBlur,
  showErrors,
  errors,
  addGuardian,
  removeGuardian,
  handleSubmit,
  amountForm,
  amountData,
  showAdvance,
  setShowAdvance,
  loading,
  disabled,
  hasGuardians,
  selectAmount,
  keepPrivate,
  setKeepPrivate,
  confirmButton,
  onChangeValues,
  formWidth,
  handleConfirm,
  handleBack,
  canGoBack,
  editType
}: any) {
  return (
    <Fragment>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="center"
          gap="12px"
          position="relative"
          width={formWidth || '100%'}
        >
          {guardianIds.map((id: any, i: number) => (
            <GuardianInput
              id={id}
              key={id}
              values={values}
              showErrors={showErrors}
              errors={errors}
              guardianIds={guardianIds}
              onChange={onChange}
              onBlur={onBlur}
              handleSubmit={handleSubmit}
              removeGuardian={removeGuardian}
              onChangeValues={onChangeValues}
              i={i}
            />
          ))}
          {editType !== 'editSingle' && (
            <TextButton onClick={() => addGuardian()} color="#FF2E79" _hover={{ color: '#FF2E79' }} padding="2px">
              <PlusIcon color="#FF2E79" />
              <Text fontSize="16px" fontWeight="800" marginLeft="5px">
                Add more guardians
              </Text>
            </TextButton>
          )}
        </Box>
      </Box>
      <Box marginTop="30px" display="flex" justifyContent="flex-end">
        <Box>
          {canGoBack && <Button type="white" padding="0 14px" marginRight="16px" onClick={handleBack} size="xl">Back</Button>}
          <Button type="black" onClick={handleConfirm} disabled={disabled} loading={loading} size="xl">Confirm</Button>
        </Box>
      </Box>
    </Fragment>
  )
}
