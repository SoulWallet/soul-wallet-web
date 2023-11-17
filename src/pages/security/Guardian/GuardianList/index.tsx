import React, { useState, useRef, useImperativeHandle, useCallback, useEffect, Fragment } from 'react';
import {
  Box,
  Button,
  Text,
  Image,
  useToast,
  Select,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Tooltip
} from '@chakra-ui/react';
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
import ArrowDownIcon from '@/components/Icons/ArrowDown';
import QuestionIcon from '@/components/Icons/Question';
import useWalletContext from '@/context/hooks/useWalletContext';
import { useGuardianStore } from '@/store/guardian';
import { nanoid } from 'nanoid';
import { L1KeyStore } from '@soulwallet/sdk';
import { useCredentialStore } from '@/store/credential';
import useKeystore from '@/hooks/useKeystore';
import useConfig from '@/hooks/useConfig';
import useTransaction from '@/hooks/useTransaction';
import api from '@/lib/api';
import { useAddressStore } from '@/store/address';
import DoubleCheckModal from '../DoubleCheckModal'
import GuardianModal from '../GuardianModal'

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

export default function GuardianList({ onSubmit, textButton, startBackup }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [showAdvance, setShowAdvance] = useState(false)
  const [showAdvance2, setShowAdvance2] = useState(false)
  const [loading, setLoading] = useState(false);
  const { credentials } = useCredentialStore();
  const { getReplaceGuardianInfo, calcGuardianHash } = useKeystore();
  const { chainConfig } = useConfig();
  const { showConfirmPayment } = useWalletContext();
  const { payTask } = useTransaction();
  const { setFinishedSteps } = useAddressStore();

  const { guardiansInfo, editingGuardiansInfo, slotInfo, setEditingGuardiansInfo } = useGuardianStore();
  const guardianDetails = (guardiansInfo && guardiansInfo.guardianDetails) || {
    guardians: [],
    guardianNames: [],
    threshold: 0
  }

  const guardianNames = (guardiansInfo && guardiansInfo.guardianNames) || []

  const guardianList = guardianDetails.guardians.map((guardian: any, i: number) => {
    return {
      address: guardian,
      name: guardianNames[i]
    }
  })

  let pendingGuardianDetails: any = {
    guardians: [],
    guardianNames: [],
    threshold: 0
  }
  let pendingGuardianList: any = []
  let pendingGuardianNames: any = []
  const isPending = editingGuardiansInfo && !!editingGuardiansInfo.guardianDetails && editingGuardiansInfo.guardianHash !== guardiansInfo.guardianHash

  if (isPending) {
    pendingGuardianDetails = (editingGuardiansInfo && editingGuardiansInfo.guardianDetails)
    pendingGuardianNames = (editingGuardiansInfo && editingGuardiansInfo.guardianNames)
    pendingGuardianList = pendingGuardianDetails.guardians.map((guardian: any, i: number) => {
      return {
        address: guardian,
        name: guardianNames[i]
      }
    })
  }

  const handleCancel = async () => {
    try {
      setIsConfirmOpen(false)
      setLoading(true);
      const guardianAddresses = guardianDetails.guardians
      const threshold = guardianDetails.threshold
      const keepPrivate = !!guardiansInfo.keepPrivate
      const newGuardianHash = calcGuardianHash(guardianAddresses, threshold);
      const keystore = chainConfig.contracts.l1Keystore;
      const salt = ethers.ZeroHash;
      const { initialKeys, initialGuardianHash, initialGuardianSafePeriod, slot } = slotInfo;
      const currentKeys = await Promise.all(credentials.map((credential: any) => credential.publicKey))
      const initalkeysAddress = L1KeyStore.initialKeysToAddress(initialKeys);
      const currentkeysAddress = L1KeyStore.initialKeysToAddress(currentKeys);
      console.log('initialKeys', initalkeysAddress, currentkeysAddress)
      let initalRawkeys
      if (initalkeysAddress.join('') === currentkeysAddress.join('')) {
        initalRawkeys = new ethers.AbiCoder().encode(["bytes32[]"], [initalkeysAddress]);
      } else {
        initalRawkeys = new ethers.AbiCoder().encode(["bytes32[]"], [currentkeysAddress]);
      }

      const initialKeyHash = L1KeyStore.getKeyHash(initalkeysAddress);

      /* const guardiansInfo = {
       *   keystore,
       *   slot,
       *   guardianHash: newGuardianHash,
       *   guardianNames,
       *   guardianDetails: {
       *     guardians: guardianAddresses,
       *     threshold: Number(threshold),
       *     salt,
       *   },
       *   requireBackup: true,
       *   keepPrivate
       * };
       */
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

      const res1 = await api.guardian.createTask({
        keystore,
        functionName,
        parameters
      })

      const task = res1.data
      const paymentContractAddress = chainConfig.contracts.paymentContractAddress;
      const res2 = await showConfirmPayment(task.estiamtedFee);
      const res3 = await payTask(paymentContractAddress, task.estiamtedFee, task.taskID);
      console.log('handleSubmit1111', res1, res2, res3);
      setEditingGuardiansInfo(guardiansInfo)
      setLoading(false);
      const res = await api.operation.finishStep({
        slot,
        steps: [2],
      })
      setFinishedSteps(res.data.finishedSteps);
    } catch (error: any) {
      console.log('error', error.message)
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Box width="100%" bg="#EDEDED" borderRadius="20px" padding="45px" display="flex" alignItems="flex-start" justifyContent="space-around" margin="0 auto">
        <Box width="40%" marginRight="45px">
          <Heading1>Current guardians</Heading1>
          <TextBody fontSize="18px" marginBottom="20px">Please enter Ethereum wallet address to set up guardians.</TextBody>
          <Box>
            <TextButton _styles={{ padding: '0', color: '#EC588D' }} _hover={{ color: '#EC588D' }} onClick={() => setIsModalOpen(true)}>
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
              gap="0.75em"
              width="100%"
            >
              {guardianList.map((item: any, i: number) => (
                <Box position="relative" width="100%" key={i}>
                  <DoubleFormInfo
                    rightPlaceholder={`Guardian address ${i + 1}`}
                    rightValue={item.address}
                    _rightInputStyles={{
                      fontFamily: 'Martian',
                      fontWeight: 600,
                      fontSize: '14px',
                    }}
                    _rightContainerStyles={{ width: '70%', minWidth: '520px' }}
                    leftValue={item.name}
                    leftComponent={
                      <Text color="#898989" fontWeight="600">
                        eth:
                      </Text>
                    }
                    _leftContainerStyles={{ width: '30%', minWidth: '240px' }}
                    onEnter={() => {}}
                    _styles={{ width: '100%', minWidth: '760px', fontSize: '16px' }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box background="#EDEDED" borderRadius="20px" padding="16px 45px" display="flex" marginTop="36px">
        <Box width="40%" display="flex" alignItems="center">
          <Heading1 marginBottom="0">Threshold</Heading1>
        </Box>
        <Box width="60%" display="flex" alignItems="center" paddingLeft="20px">
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
              _expanded={{
                borderColor: '#3182ce',
                boxShadow: '0 0 0 1px #3182ce',
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">
                {guardianDetails.threshold || 0}
                <DropDownIcon />
              </Box>
            </Box>
          </Box>
          <TextBody>out of {guardianDetails.guardians.length} guardian(s) confirmation. </TextBody>
        </Box>
      </Box>
      <TextButton onClick={() => setShowAdvance(!showAdvance)} color="#EC588D" _hover={{ color: '#EC588D' }} marginTop="20px">
        <Text fontSize="18px" marginRight="5px">Advance setting</Text>
        <Box transform={showAdvance ? 'rotate(-180deg)' : ''}><ArrowDownIcon color="#EC588D" /></Box>
      </TextButton>
      {showAdvance && (
        <Box background="#EDEDED" borderRadius="20px" padding="16px 45px" display="flex" marginTop="20px">
          <Box width="40%" display="flex" alignItems="center">
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
          <Box width="60%" display="flex" alignItems="center" paddingLeft="20px">
            <Box width="72px" height="40px" background={(guardiansInfo.keepPrivate) ? '#1CD20F' : '#D9D9D9'} borderRadius="40px" padding="5px" cursor="pointer" transition="all 0.2s ease" paddingLeft={(guardiansInfo.keepPrivate) ? '37px' : '5px'}>
              <Box width="30px" height="30px" background="white" borderRadius="30px" />
            </Box>
            <TextBody marginLeft="20px">Backup guardians in the next step for easy recovery.</TextBody>
          </Box>
        </Box>
      )}
      {isPending && (
        <Fragment>
          <Box width="100%" height="1px" background="#D7D7D7" marginTop="20px" />
          <Box width="100%" bg="#D7D7D7" borderRadius="20px" padding="45px" display="flex" alignItems="flex-start" justifyContent="space-around" margin="0 auto" marginTop="20px">
            <Box width="40%" marginRight="45px">
              <Heading1>Pending new guardians</Heading1>
              <TextBody fontSize="18px" marginBottom="20px">You have a pending guardian update. New guardians updating in 12:56:73. </TextBody>
              <Box>
                <RoundButton _styles={{ width: '168px', maxWidth: '100%', borderRadius: '50px', height: '31px', fontSize: '16px', fontWeight: '700' }} onClick={() => setIsConfirmOpen(true)} loading={loading} disabled={loading}>
                  Discard change
                </RoundButton>
              </Box>
            </Box>
            <Box width="60%">
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-start"
                  justifyContent="center"
                  gap="0.75em"
                  width="100%"
                >
                  {pendingGuardianList.map((item: any, i: number) => (
                    <Box position="relative" width="100%" key={i}>
                      <DoubleFormInfo
                        rightPlaceholder={`Guardian address ${i + 1}`}
                        rightValue={item.address}
                        _rightInputStyles={{
                          fontFamily: 'Martian',
                          fontWeight: 600,
                          fontSize: '14px',
                        }}
                        _rightContainerStyles={{ width: '70%', minWidth: '520px' }}
                        leftValue={item.name}
                        leftComponent={
                          <Text color="#898989" fontWeight="600">
                            eth:
                          </Text>
                        }
                        _leftContainerStyles={{ width: '30%', minWidth: '240px' }}
                        onEnter={() => {}}
                        _styles={{ width: '100%', minWidth: '760px', fontSize: '16px' }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
          <Box background="#D7D7D7" borderRadius="20px" padding="16px 45px" display="flex" marginTop="36px">
            <Box width="40%" display="flex" alignItems="center">
              <Heading1 marginBottom="0">Threshold</Heading1>
            </Box>
            <Box width="60%" display="flex" alignItems="center" paddingLeft="20px">
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
                  _expanded={{
                    borderColor: '#3182ce',
                    boxShadow: '0 0 0 1px #3182ce',
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    {pendingGuardianDetails.threshold || 0}
                    <DropDownIcon />
                  </Box>
                </Box>
              </Box>
              <TextBody>out of {pendingGuardianDetails.guardians.length} guardian(s) confirmation. </TextBody>
            </Box>
          </Box>
          <TextButton onClick={() => setShowAdvance2(!showAdvance2)} color="#EC588D" _hover={{ color: '#EC588D' }} marginTop="20px">
            <Text fontSize="18px" marginRight="5px">Advance setting</Text>
            <Box transform={showAdvance2 ? 'rotate(-180deg)' : ''}><ArrowDownIcon color="#EC588D" /></Box>
          </TextButton>
          {showAdvance2 && (
            <Box background="#D7D7D7" borderRadius="20px" padding="16px 45px" display="flex" marginTop="20px">
              <Box width="40%" display="flex" alignItems="center">
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
              <Box width="60%" display="flex" alignItems="center" paddingLeft="20px">
                <Box width="72px" height="40px" background={(editingGuardiansInfo.keepPrivate) ? '#1CD20F' : 'white'} borderRadius="40px" padding="5px" cursor="pointer" transition="all 0.2s ease" paddingLeft={(editingGuardiansInfo.keepPrivate) ? '37px' : '5px'}>
                  <Box width="30px" height="30px" background="#D7D7D7" borderRadius="30px" />
                </Box>
                <TextBody marginLeft="20px">Backup guardians in the next step for easy recovery.</TextBody>
              </Box>
            </Box>
          )}
        </Fragment>
      )}
      {!!guardianList.length && !isPending && (
        <Box padding="40px">
          <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
            <RoundButton _styles={{ width: '320px', background: '#1E1E1E', color: 'white' }} _hover={{ background: '#1E1E1E', color: 'white' }} onClick={() => startBackup()}>
              Backup current guardians
            </RoundButton>
          </Box>
        </Box>
      )}
      <GuardianModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <DoubleCheckModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onSubmit={handleCancel} />
    </Fragment>
  )
}
