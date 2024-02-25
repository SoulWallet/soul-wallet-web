import React, { useState, useRef, useEffect, Fragment } from 'react';
import { Box, Text, Image,  Menu, MenuList, MenuButton, MenuItem, Tooltip } from '@chakra-ui/react';
import TextBody from '@/components/new/TextBody';
import Button from '@/components/Button'
import TextButton from '@/components/new/TextButton';
import { ethers } from 'ethers';
import MinusIcon from '@/assets/icons/minus.svg';
import DoubleFormInput from '@/components/new/DoubleFormInput';
import Icon from '@/components/Icon';
import { nextRandomId } from '@/lib/tools';
import DropDownIcon from '@/components/Icons/DropDown';
import PlusIcon from '@/components/Icons/Plus';
import { nanoid } from 'nanoid';
import { toShortAddress } from '@/lib/tools';
import IconLoading from '@/assets/loading.svg';
import { ensContractAddress } from '@/config'
import ENSResolver, { extractENSAddress } from '@/components/ENSResolver'

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

function stringToSeed(str: any) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

function SeededRandom(seed: any) {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function generateSeededColor(strSeed: any, offset: any = 0) {
  const seed = stringToSeed(strSeed) + offset;
  const random = SeededRandom(seed);
  const min = 150;  // Adjusted minimum RGB value
  const max = 255; // Adjusted maximum RGB value
  const range = max - min;
  const red = Math.floor(random() * range + min);
  const green = Math.floor(random() * range + min);
  const blue = Math.floor(random() * range + min);
  return "rgb(" + red + "," + green + "," + blue + ")";
}

async function isENSExpiration(name: any, provider: any) {
  try {
    const ensRegistry = new ethers.Contract(
      ensContractAddress,
      ['function nameExpires(uint256 id) external view returns(uint)'],
      provider
    );

    // Compute the namehash for the ENS name
    const resolver = await provider.getResolver(name);

    if (resolver) {
      const nameLabel = name.endsWith('.eth') ? name.split('.')[0] : name
      const nameId = ethers.id(nameLabel);
      const expiresTimestamp = await ensRegistry.nameExpires(nameId);
      console.log('expiresTimestamp', expiresTimestamp, nameLabel, nameId)

      if (expiresTimestamp !== 0n) {
        const expiresDate = new Date(Number(expiresTimestamp) * 1000);
        const now = new Date();
        return now > expiresDate;
      }
    }

    return false
  } catch (error: any) {
    console.log('error', error);
    return false
  }
}

const GuardianInput = ({
  id,
  values,
  showErrors,
  errors,
  onChange,
  onBlur,
  handleSubmit,
  removeGuardian,
  onChangeValues,
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
        rightAutoFocus={true}
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
          right={{ base: '-28px', md: '-34px' }}
          top="0"
          height="48px"
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
          width: { base: "100%", lg: "calc(100% - 240px)" },
          top: { base: "120px", lg: "50px" },
          left: { base: "0", lg: "240px" },
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
  loading,
  disabled,
  selectAmount,
  onChangeValues,
  formWidth,
  handleConfirm,
  handleBack,
  canGoBack
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
          <TextButton onClick={() => addGuardian()} color="#FF2E79" _hover={{ color: '#FF2E79' }} padding="2px">
            <PlusIcon color="#FF2E79" />
            <Text fontSize="16px" fontWeight="800" marginLeft="5px" color="#FF2E79">Add more guardians</Text>
          </TextButton>
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="flex-start"
        marginTop="10px"
        alignItems={{ base: 'flex-start', md: 'center' }}
        flexDirection={{ base: 'column', md: 'row' }}
      >
        <Box
          fontFamily="Nunito"
          fontWeight="700"
          fontSize="14px"
          marginRight="6px"
        >
          Threshold:
        </Box>
        <TextBody
          display="flex"
          justifyContent="flex-start"
          flexDirection={{ base: 'column', md: 'row' }}
          alignItems={{ base: 'flex-start', md: 'center' }}
        >
          <Box>Wallet recovery requires</Box>
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
          <Box>{`out of ${guardiansList.length || 0} guardian(s) confirmation.`}</Box>
        </TextBody>
      </Box>
      <Box marginTop="30px" display="flex" justifyContent="flex-end">
        <Box>
          {canGoBack && <Button type="white" padding="0 14px" marginRight="16px" onClick={handleBack}>Back</Button>}
          <Button onClick={handleConfirm} disabled={disabled} loading={loading} size="xl">Confirm</Button>
        </Box>
      </Box>
    </Fragment>
  )
}
