import { Modal, ModalOverlay, ModalContent, ModalBody, ModalHeader, ModalCloseButton } from '@chakra-ui/react';

export default function TxModal({ title, visible, foo, onClose, children }: any) {
  return (
    visible && (
      <Modal isOpen={true} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#ededed" maxW={'520px'}>
          <ModalHeader fontWeight={'800'} textAlign={'center'} borderBottom={'1px solid #d7d7d7'}>
            {title}
          </ModalHeader>
          <ModalCloseButton top="14px" />
          <ModalBody pb="12" px="12">
            {children}
          </ModalBody>
        </ModalContent>
      </Modal>
    )
  );
}
