import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Image,
  Checkbox,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Text,
  ModalBody,
  useDisclosure,
} from '@chakra-ui/react';
import Button from '@/components/mobile/Button';
import ScanIcon from '@/components/Icons/mobile/Scan';
import CheckedIcon from '@/components/Icons/mobile/Checked';
import UncheckedIcon from '@/components/Icons/mobile/Unchecked';
import USDCIcon from '@/assets/mobile/usdc.png'
import USDCGreyIcon from '@/assets/mobile/usdc_grey.png'
import OpGreyIcon from '@/assets/mobile/op_grey.png'
import OpIcon from '@/assets/mobile/op.png'
import AAVEGreyIcon from '@/assets/mobile/aave_grey.png'
import AAVEIcon from '@/assets/mobile/aave.png'
import { useAddressStore } from '@/store/address';
import useTools from '@/hooks/useTools';
import ReceiveCode from '@/components/ReceiveCode';
import { shareFile } from '@/lib/tools';
import { useSettingStore } from '@/store/setting';
import { useHistoryStore } from '@/store/history';

export default function CheckDeposit({ onPrev, onNext, setIsPaginationActive }: any) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { historyList } = useHistoryStore();
  const { selectedAddress } = useAddressStore();
  const [qrcodeSrc, setQrcodeSrc] = useState('');
  const { doCopy } = useTools();
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);
  const { isDepositAllChecked, setIsDepositAllChecked } = useSettingStore();
  const isAllChecked = (checked1 && checked2 && checked3) || isDepositAllChecked;
  const innerHeight = window.innerHeight
  const contentHeight = innerHeight - 64

  useEffect(()=>{
    if(historyList.filter(item => item.action === 'Deposit').length > 3){
      setChecked1(true)
      setChecked2(true)
      setChecked3(true)
    }
  }, [historyList])

  useEffect(() => {
    if (checked1 && checked2 && checked3) {
      setIsPaginationActive(true)
    } else {
      setIsPaginationActive(false)
    }
  }, [checked1, checked2, checked3])

  return (
    <Box width="100%" height={contentHeight} position="relative" overflowY={isAllChecked ? 'auto' : 'hidden'}>
      <Box
        padding="30px"
        marginBottom={isAllChecked ? '120px' : '0px'}
      >
        <Box width="100%" fontSize="30px" fontWeight="700" textAlign="center" lineHeight="36px" marginTop="20px">
          Prior to deposit,<br/> please verify
        </Box>
        <Box
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          marginTop={isAllChecked ? '33px' : '75px'}
          marginBottom={isAllChecked ? '37px' : '55px'}
          transition="0.6s all ease"
        >
          <Box
            width={isAllChecked ? '40px' : '72px'}
            height={isAllChecked ? '40px' : '72px'}
            marginLeft="6px"
            marginRight="6px"
            transition="0.6s all ease"
          >
            <Image width="100%" src={!checked1 ? USDCGreyIcon : USDCIcon} className="icon" />
          </Box>
          <Box
            width={isAllChecked ? '40px' : '72px'}
            height={isAllChecked ? '40px' : '72px'}
            marginLeft="6px"
            marginRight="6px"
            transition="0.6s all ease"
          >
            <Image width="100%" src={!checked2 ? OpGreyIcon : OpIcon} className="icon" />
          </Box>
          <Box
            width={isAllChecked ? '40px' : '72px'}
            height={isAllChecked ? '40px' : '72px'}
            marginLeft="6px"
            marginRight="6px"
            transition="0.6s all ease"
          >
            <Image width="100%" src={!checked3 ? AAVEGreyIcon : AAVEIcon} className="icon" />
          </Box>
        </Box>
        <Box
          color={!isAllChecked ? 'black' : 'rgba(0, 0, 0, 0.42)'}
          pointerEvents={!isAllChecked ? 'all' : 'none'}
        >
          <Box>
            <Box lineHeight="20px" marginBottom="18px">
              <Box display="flex" alignItems="center" onClick={(e) => setChecked1(!checked1)}>
                <Box marginRight="12px">
                  {(checked1 || isAllChecked) ? <CheckedIcon isAllChecked={isAllChecked} /> : <UncheckedIcon />}
                </Box>
                <Box>I'm gonna send USDC, not other assets</Box>
              </Box>
            </Box>
          </Box>
          <Box lineHeight="20px" marginBottom="18px">
            <Box display="flex" alignItems="center" onClick={(e) => setChecked2(!checked2)}>
              <Box marginRight="12px">
                {(checked2 || isAllChecked) ? <CheckedIcon isAllChecked={isAllChecked} /> : <UncheckedIcon />}
              </Box>
              <Box>The network is OP Mainnet, not any other chain</Box>
            </Box>
          </Box>
          <Box lineHeight="20px" marginBottom="18px">
            <Box display="flex" alignItems="center" onClick={(e) => setChecked3(!checked3)}>
              <Box marginRight="12px">
                {(checked3 || isAllChecked) ? <CheckedIcon isAllChecked={isAllChecked} /> : <UncheckedIcon />}
              </Box>
              <Box>After deposit, my fund will auto-saved into AAVE protocol</Box>
            </Box>
          </Box>
        </Box>
        <Box
          opacity={isAllChecked ? 1 : 0}
          height={isAllChecked ? 'fit-content' : '0px'}
          pointerEvents={isAllChecked ? 'all' : 'none'}
          transition="0.6s all ease"
          marginBottom="auto"
        >
          <Box
            width="100%"
            borderTop="1px solid rgba(0, 0, 0, 0.1)"
            paddingTop="36px"
            marginTop="30px"
            marginBottom="40px"
          >
            <Box fontWeight="700" background="#F1F1F1" borderRadius="12px" padding="15px 16px">
              {selectedAddress}
            </Box>
            <Box width="100%" display="flex" alignItems="center" justifyContent="space-between" marginTop="17px">
              <Box width="calc(100% - 50px)">
                <Button size="xl" type="black" width="100%" height="42px" onClick={() => doCopy(selectedAddress)}>
                  Copy address
                </Button>
              </Box>
              <Box cursor="pointer" onClick={onOpen}>
                <ScanIcon />
              </Box>
            </Box>
            <Box fontSize="12px" fontWeight="500" color="#5E5E5E" marginTop="26px">
              This is your Soul Wallet address on <Text as="span" fontWeight="700">OP Mainnet</Text> to transfer assets directly into your account and
              save into protocol. You can always copy it on homepage.
            </Box>
          </Box>
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="20px" marginLeft="30px" marginRight="30px" padding="30px">
          {/* <ModalCloseButton /> */}
          <ModalBody>
            <Box marginBottom="24px">
              <ReceiveCode address={selectedAddress} onSet={setQrcodeSrc}  />
            </Box>
            <Box textAlign={'center'}>
              <Button size="xl" type="black" width="224px" onClick={()=> shareFile(qrcodeSrc)}>
                Share
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
