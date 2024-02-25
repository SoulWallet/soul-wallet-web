import { useState, forwardRef, useImperativeHandle, useEffect, Ref } from 'react';
import { useToast, Text, Image, Box } from '@chakra-ui/react';
import Button from '../Button';
import TxModal from '../TxModal';
import useTools from '@/hooks/useTools';
import useBrowser from '@/hooks/useBrowser';
import IconExclamation from '@/assets/icons/exclamation.svg';

const LogoutModal = (_: unknown, ref: Ref<any>) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [redirectUrl, setRedirectUrl] = useState('');
  const [promiseInfo, setPromiseInfo] = useState<any>({});
  const { navigate } = useBrowser();
  const { clearLogData } = useTools();

  useImperativeHandle(ref, () => ({
    async show(_redirectUrl: string) {
      setRedirectUrl(_redirectUrl || '/auth');
      setVisible(true);
      return new Promise((resolve, reject) => {
        setPromiseInfo({
          resolve,
          reject,
        });
      });
    },
  }));

  const doLogout = () => {
    clearLogData();
    navigate(redirectUrl, { replace: true });
    onClose();
  };

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
          <Image src={IconExclamation} mx="auto" w="64px" h="64px" />
          <Text fontSize={'20px'} mb="2" fontWeight={'800'} lineHeight={'1.6'} letterSpacing={'-0.4px'}>
            Logout
          </Text>
          <Text fontSize={'14px'} fontWeight={'600'} mb="18px">
            Are you sure to logout the current account?
          </Text>
          <Button
            py="16px"
            onClick={doLogout}
            fontSize={'18px'}
            lineHeight={'1'}
            fontWeight={'700'}
            color="#fff"
            gap="2"
            mb="6"
            w="100%"
          >
            Confirm
          </Button>
          <Text fontSize={'18px'} onClick={onClose} cursor={'pointer'} fontWeight={'700'}>
            Cancel
          </Text>
        </Box>
      </TxModal>
    </div>
  );
};

export default forwardRef(LogoutModal);
