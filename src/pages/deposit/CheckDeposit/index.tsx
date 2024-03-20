import React, { useState, useCallback, useEffect } from 'react';
import { Box, Image, Checkbox, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure } from '@chakra-ui/react';
import Header from '@/components/mobile/Header'
import Button from '@/components/mobile/Button'
import ScanIcon from '@/components/Icons/mobile/Scan'
import NextIcon from '@/components/Icons/mobile/Next'
import useWallet from '@/hooks/useWallet';
import usePasskey from '@/hooks/usePasskey';
import { useNavigate } from 'react-router-dom';
import USDCIcon from '@/assets/mobile/usdc.png'
import USDCGreyIcon from '@/assets/mobile/usdc_grey.png'

export default function CheckDeposit({ onPrev, onNext }: any) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [checked1, setChecked1] = useState(false)
  const [checked2, setChecked2] = useState(false)
  const [checked3, setChecked3] = useState(false)
  const isAllChecked = checked1 && checked2 && checked3

  return (
    <Box width="100%" height="100%" position="relative">
      <Header
        title="Deposit"
        showBackButton
        onBack={onPrev}
        marginTop="18px"
      />
      <Box padding="30px" marginBottom="144px">
        <Box width="100%" fontSize="30px" fontWeight="700" textAlign="center" lineHeight="36px">
          Prior to deposit, please verify
        </Box>
        <Box
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          marginTop={isAllChecked ? '20px' : '122px'}
          marginBottom={isAllChecked ? '20px' : '95px'}
          transition="0.6s all ease"
        >
          <Box
            width={isAllChecked ? '40px' : '61px'}
            height={isAllChecked ? '40px' : '61px'}
            marginLeft="6px"
            marginRight="6px"
            transition="0.6s all ease"
          >
            <Image src={USDCGreyIcon} className="icon" />
          </Box>
          <Box
            width={isAllChecked ? '40px' : '61px'}
            height={isAllChecked ? '40px' : '61px'}
            marginLeft="6px"
            marginRight="6px"
            transition="0.6s all ease"
          >
            <Image src={USDCGreyIcon} className="icon" />
          </Box>
          <Box
            width={isAllChecked ? '40px' : '61px'}
            height={isAllChecked ? '40px' : '61px'}
            marginLeft="6px"
            marginRight="6px"
            transition="0.6s all ease"
          >
            <Image src={USDCGreyIcon} className="icon" />
          </Box>
        </Box>
        <Box>
          <Box>
            <Box marginBottom="4px">
              <Checkbox
                defaultChecked={false}
                onChange={(e) => setChecked1(e.target.checked)}
              >
                I'm gonna send USDC, not other assets
              </Checkbox>
            </Box>
          </Box>
          <Box marginBottom="4px">
            <Checkbox
              defaultChecked={false}
              alignItems="flex-start"
              onChange={(e) => setChecked2(e.target.checked)}
            >
              The network is Arbitrum, not any other chain
            </Checkbox>
          </Box>
          <Box marginBottom="4px">
            <Checkbox
              defaultChecked={false}
              alignItems="flex-start"
              onChange={(e) => setChecked3(e.target.checked)}
            >
              After deposit, my fund will auto-saved into AAVE protocol
            </Checkbox>
          </Box>
        </Box>
        <Box opacity={isAllChecked ? 1 : 0} pointerEvents={isAllChecked ? 'all' : 'none'} transition="0.6s all ease" marginBottom="auto">
          <Box
            width="100%"
            borderTop="1px solid rgba(0, 0, 0, 0.1)"
            paddingTop="36px"
            marginTop="30px"
            marginBottom="40px"
          >
            <Box fontWeight="700" background="#F1F1F1" borderRadius="12px" padding="15px 16px">0xcea21s19hjka28379xsd2xxasd1212111</Box>
            <Box width="100%" display="flex" alignItems="center" justifyContent="space-between" marginTop="17px">
              <Box width="calc(100% - 50px)">
                <Button size="xl" type="blue" width="100%">Copy address</Button>
              </Box>
              <Box cursor="pointer" onClick={onOpen}><ScanIcon /></Box>
            </Box>
            <Box fontSize="12px" fontWeight="700" color="#5E5E5E" marginTop="26px">
              This is your Soul Wallet address on Arbitrum network to transfer assets directly into your account and save into protocol. You can always copy it on homepage.
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        position="fixed"
        bottom="0"
        opacity={isAllChecked ? 1 : 0}
        pointerEvents={isAllChecked ? 'all' : 'none'}
        width="100%"
        paddingTop="20px"
        paddingBottom="60px"
        background="white"
      >
        <Box display="flex" alignItems="center" justifyContent="center" marginBottom="24px">
          <Box width="8px" height="8px" marginLeft="4px" marginRight="4px" borderRadius="8px" background="black" />
          <Box width="8px" height="8px" marginLeft="4px" marginRight="4px" borderRadius="8px" background="#D9D9D9" />
          <Box width="8px" height="8px" marginLeft="4px" marginRight="4px" borderRadius="8px" background="#D9D9D9" />
          <Box width="8px" height="8px" marginLeft="4px" marginRight="4px" borderRadius="8px" background="#D9D9D9" />
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Box fontWeight="700" fontSize="18px" cursor="pointer" onClick={onNext}>What’s next</Box>
          <Box><NextIcon /></Box>
        </Box>
      </Box>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent
          borderRadius="20px"
          marginLeft="30px"
          marginRight="30px"
          padding="30px"
        >
          {/* <ModalCloseButton /> */}
          <ModalBody>
            <Box
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              marginBottom="32px"
            >
              <Box width="224px" height="224px" background="#d9d9d9">

              </Box>
            </Box>
            <Box marginTop="14px">
              <Button size="xl" type="blue" width="100%">Share</Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
