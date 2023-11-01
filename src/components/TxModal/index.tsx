import { Modal, ModalOverlay, ModalContent, ModalBody, ModalHeader, ModalCloseButton } from '@chakra-ui/react';

export default function TxModal({ title, visible, onClose, children }: any) {
  return (
    visible && (
      <Modal isOpen={true} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#ededed" maxW={{ base: '90%', lg: '520px' }}>
          <ModalHeader fontWeight={'800'} textAlign={'center'} borderBottom={'1px solid #d7d7d7'}>
            {title}
          </ModalHeader>
          <ModalCloseButton top="14px" />
          <ModalBody pb={{base: 4, lg: 12}} px={{base: 3, lg: 12}}>
            {children}
          </ModalBody>
        </ModalContent>
      </Modal>
    )
  );
}
