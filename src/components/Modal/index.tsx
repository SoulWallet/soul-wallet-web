import {
  Modal as CModal,
  Text,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
} from '@chakra-ui/react';

export default function Modal({ title, visible, onClose, width, children }: any) {
  return (
    visible && (
      <CModal isOpen={visible} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW={{ base: '90%', lg: '640px', ...width }}>
          <ModalHeader>
            <Text fontWeight={'700'} fontSize={'20px'}>
              {title}
            </Text>
          </ModalHeader>
          <ModalCloseButton top="15px" />
          <ModalBody pb={{ base: 4 }} px={{ base: 3, lg: 8 }}>
            {children}
          </ModalBody>
        </ModalContent>
      </CModal>
    )
  );
}
