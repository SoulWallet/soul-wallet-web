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
import CopyIcon from '@/components/Icons/Copy';
import OpenScanIcon from '@/components/Icons/OpenScan';
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
import useTools from '@/hooks/useTools';
import GreySection from '@/components/GreySection'
import List from '@/components/Guardian/List'
// import DoubleCheckModal from '../DoubleCheckModal'
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
  const { setFinishedSteps } = useAddressStore();
  const { showConfirmPayment } = useWalletContext();
  const { payTask } = useTransaction();
  const { doCopy } = useTools();

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
        name: pendingGuardianNames[i]
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
      const rawKeys = new ethers.AbiCoder().encode(["bytes32[]"], [currentKeys]);
      const initialKeyHash = L1KeyStore.getKeyHash(initialKeys);

      const { keySignature } = await getReplaceGuardianInfo(newGuardianHash)

      const functionName = `setGuardian(bytes32,bytes32,uint256,bytes32,bytes,bytes)`
      const parameters = [
        initialKeyHash,
        initialGuardianHash,
        initialGuardianSafePeriod,
        newGuardianHash,
        rawKeys,
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

  const copyAddress = (address: string) => {
    doCopy(address)
  }

  const openScan = (address: string) => {
    window.open(`https://goerli.etherscan.io/address/${address}`, '_blank')
  }

  return (
    <Fragment>
      <List
        description={
          <Fragment>
            <Heading1>Current guardians</Heading1>
            <TextBody fontSize="18px" marginBottom="20px">Please enter Ethereum wallet address to set up guardians.</TextBody>
            <Box>
              <TextButton _styles={{ padding: '0', color: '#EC588D' }} _hover={{ color: '#EC588D' }} onClick={() => setIsModalOpen(true)}>
                Learn more
              </TextButton>
            </Box>
          </Fragment>
        }
        guardianList={guardianList}
        openScan={openScan}
        copyAddress={copyAddress}
        guardianDetails={guardianDetails}
        showAdvance={showAdvance}
        setShowAdvance={setShowAdvance}
        guardiansInfo={guardiansInfo}
      />
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
    </Fragment>
  )
}
