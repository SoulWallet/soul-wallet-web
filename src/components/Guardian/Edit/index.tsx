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
  formWidth
}: any) {
  return (
    <Fragment>
      <GreySection
        padding={{ base: '16px', md: '45px' }}
        leftPart={description}
        rightPart={
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="center"
              gap="12px"
              width={formWidth || '100%'}
            >
              {guardianIds.map((id: any, i: number) => (
                <Box position="relative" key={id} width="100%">
                  <DoubleFormInput
                    rightPlaceholder={`Guardian address ${i + 1}`}
                    rightValue={values[`address_${id}`]}
                    rightOnChange={onChange(`address_${id}`)}
                    rightOnBlur={onBlur(`address_${id}`)}
                    rightErrorMsg={showErrors[`address_${id}`] && errors[`address_${id}`]}
                    _rightInputStyles={{
                      fontFamily: 'Martian',
                      fontWeight: 600,
                      fontSize: '14px',
                    }}
                    _rightContainerStyles={{ width: '70%' }}
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
                    _leftContainerStyles={{ width: '30%' }}
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
                </Box>
              ))}
              <TextButton onClick={() => addGuardian()} color="#EC588D" _hover={{ color: '#EC588D' }} padding="2px">
                <PlusIcon color="#EC588D" />
                <Text fontSize="18px" marginLeft="5px">Add more guardians</Text>
              </TextButton>
            </Box>
          </Box>
        }
      />
      <GreySection
        padding={{ base: '16px', md: '16px 45px' }}
        marginTop="30px"
        leftPart={
          <Box display="flex" alignItems="center" height="50px">
            <Heading1 marginBottom="0">Threshold</Heading1>
          </Box>
        }
        rightPart={
          <Box display="flex" alignItems="center" flexWrap="wrap">
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
                   getNumberArray(guardiansList.length || 0).map((i: any) => (
                     <MenuItem key={nanoid(4)} onClick={selectAmount(i)}>
                       {i}
                     </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Box>
            <TextBody>out of {guardiansList.length || 0} guardian(s) confirmation. </TextBody>
          </Box>
        }
      />
      <TextButton onClick={() => setShowAdvance(!showAdvance)} color="#EC588D" _hover={{ color: '#EC588D' }} marginTop="20px">
        <Text fontSize="18px" marginRight="5px">Advance setting</Text>
        <Box transform={showAdvance ? 'rotate(-180deg)' : ''}><ArrowDownIcon color="#EC588D" /></Box>
      </TextButton>
      {showAdvance && (
        <GreySection
          padding={{ base: '16px', md: '16px 45px' }}
          marginTop="20px"
          leftPart={
            <Box display="flex" alignItems="center">
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
          }
          rightPart={
            <Box display="flex" alignItems="center">
              <Box width="72px" height="40px" background={keepPrivate ? '#1CD20F' : '#D9D9D9'} borderRadius="40px" padding="5px" cursor="pointer" onClick={() => setKeepPrivate(!keepPrivate)} transition="all 0.2s ease" paddingLeft={keepPrivate ? '37px' : '5px'}>
                <Box width="30px" height="30px" background="white" borderRadius="30px" />
              </Box>
              <TextBody marginLeft="20px">Backup guardians in the next step for easy recovery.</TextBody>
            </Box>
          }
        />
      )}
      {confirmButton}
    </Fragment>
  )
}
