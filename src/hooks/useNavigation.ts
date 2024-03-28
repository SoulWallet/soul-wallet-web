import React, { useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function useNavigation() {
  const [activeModal, setActiveModal] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const openModal = (activeModal: any) => {
    setActiveModal(activeModal)
    onOpen()
  }

  const closeModal = () => {
    setActiveModal(null)
    onClose()
  }

  return {
    isModalOpen: isOpen,
    activeModal,
    openModal,
    closeModal
  };
}
