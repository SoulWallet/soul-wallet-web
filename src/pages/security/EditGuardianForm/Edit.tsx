import { useState, useRef, useEffect, Fragment } from 'react';
import { Box, Text } from '@chakra-ui/react';
import Button from '@/components/Button'
import TextButton from '@/components/new/TextButton';
import { ethers } from 'ethers';
import MinusIcon from '@/assets/icons/minus.svg';
import DoubleFormInput from '@/components/new/DoubleFormInput';
import Icon from '@/components/Icon';
import { nextRandomId } from '@/lib/tools';
import PlusIcon from '@/components/Icons/Plus';
import ENSResolver, { extractENSAddress } from '@/components/ENSResolver'

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
  values,
  onChange,
  onBlur,
  showErrors,
  errors,
  addGuardian,
  removeGuardian,
  handleSubmit,
  loading,
  disabled,
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
              <Text fontSize="16px" fontWeight="800" marginLeft="5px" color="#FF2E79">
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
