import { useState, forwardRef, useImperativeHandle, useEffect, Ref } from 'react';
import { useToast, Text, Box, Image, } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import Button from '../Button';
import TxModal from '../TxModal';
import SkipModal from '@/components/SkipModal';
import IconLastStep from '@/assets/icons/last-step.svg';

const SetGuardianHintModal = (_: unknown, ref: Ref<any>) => {
  const [isSkipOpen, setIsSkipOpen] = useState(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [promiseInfo, setPromiseInfo] = useState<any>({});

  useImperativeHandle(ref, () => ({
    async show() {
      setVisible(true);
      return new Promise((resolve, reject) => {
        setPromiseInfo({
          resolve,
          reject,
        });
      });
    },
  }));

  const onClose = async () => {
    setVisible(false);
    promiseInfo.reject('User close');
  };

  return (
    <div ref={ref}>
      <TxModal
        visible={visible}
        width={{ base: '90%', lg: '404px' }}
        onClose={onClose}
        bodyStyle={{ py: '9', px: '42px' }}
      >
        <Box textAlign="center">
          <Image mx="auto" src={IconLastStep} mb="18px" w="64px" h="64px" />
          <Text fontSize={'20px'} mb="2" fontWeight={'800'} lineHeight={'1.6'} letterSpacing={'-0.4px'}>
            One last step
          </Text>
          <Text fontSize={'14px'} fontWeight={'500'} mb="18px">
            Setup guardians to finish your wallet creation! Setup now for a{' '}
            <Text as="span" fontWeight={'700'}>
              $0 gas fee
            </Text>
            . Effective immediately!
          </Text>
          <Link to="/security/guardian" onClick={onClose}>
            <Button
              py="16px"
              fontSize={'18px'}
              lineHeight={'1'}
              fontWeight={'700'}
              color="#fff"
              gap="2"
              mb="6"
              w="100%"
            >
              Setup guardians
            </Button>
          </Link>
          <Text fontSize={'18px'} onClick={() => setIsSkipOpen(true)} cursor={'pointer'} fontWeight={'700'}>
            Later
          </Text>
        </Box>

        <SkipModal
          isOpen={isSkipOpen}
          onClose={() => {
            setIsSkipOpen(false);
            onClose();
          }}
        />
      </TxModal>
    </div>
  );
};

export default forwardRef(SetGuardianHintModal);
