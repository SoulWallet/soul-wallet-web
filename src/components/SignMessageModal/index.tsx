import { useState, forwardRef, useImperativeHandle, useEffect, Ref } from 'react';
import { Text, useToast } from '@chakra-ui/react';
import SignMessage from './comp/SignMessage';
import TxModal from '../TxModal';

const SignMessageModal = (_: unknown, ref: Ref<any>) => {
  const [visible, setVisible] = useState(false);
  const [origin, setOrigin] = useState('');
  const [signType, setSignType] = useState('');
  const [promiseInfo, setPromiseInfo] = useState<any>({});
  const [guardiansInfo, setGuardiansInfo] = useState();
  const [messageToSign, setMessageToSign] = useState('');
  const toast = useToast();

  useImperativeHandle(ref, () => ({
    async show(message: string, _signType: string, _guardiansInfo: any) {
      setVisible(true);
      // setOrigin(origin);
      setMessageToSign(message);
      setSignType(_signType);
      setGuardiansInfo(_guardiansInfo);
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
    promiseInfo.reject('User reject');
  };

  const onSign = async (signature: string) => {
    setVisible(false);
    toast({
      title: 'Signed message',
      status: 'success',
    });
    promiseInfo.resolve(signature);
  };

  return (
    <div ref={ref}>
      <TxModal visible={visible} onClose={onClose} title="Confirm Message">
        <SignMessage
          messageToSign={messageToSign}
          signType={signType}
          onSign={onSign}
          origin={origin}
          guardiansInfo={guardiansInfo}
        />
        {/* <Text
          color="danger"
          fontSize="20px"
          fontWeight={'800'}
          textAlign={'center'}
          cursor={'pointer'}
          onClick={onClose}
          mt="5"
          lineHeight={'1'}
        >
          Cancel
        </Text> */}
      </TxModal>
    </div>
  );
};

export default forwardRef(SignMessageModal);
