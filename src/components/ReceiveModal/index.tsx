import { useState, useImperativeHandle, forwardRef, Ref } from 'react';
import { Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/react';
import Receive from '../Receive';

function ReceiveModal(_: any, ref: Ref<any>) {
  const [visible, setVisible] = useState(false);
  const [promiseInfo, setPromiseInfo] = useState<any>({});

  const onClose = async () => {
    setVisible(false);
    promiseInfo.reject('User close');
  };

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
  return (
    <Modal isOpen={visible} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW={{ base: '90%', lg: '640px' }}>
        <ModalHeader>
          <Text fontWeight={'700'} fontSize={'20px'}>
            Receive
          </Text>

          <ModalCloseButton />
        </ModalHeader>
        <ModalBody pb={{ base: 4, lg: 12 }} px={{ base: 3, lg: 12 }}>
          <Receive />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default forwardRef(ReceiveModal);
