import { Text, Box, Flex } from '@chakra-ui/react';
import Button from '../Button';
import TxModal from '../TxModal';

export default function AlertModal({ onConfirm, onCancel, text }: any) {
  return (
    <TxModal
      visible={true}
      width={{ base: '90%', lg: '400px' }}
      onClose={onCancel}
      bodyStyle={{ py: '6', px: '6' }}
      title="Unknown link"
    >
      <Box textAlign="center">
        <Text fontSize={'16px'} fontWeight={'600'} color="#f00">
          {text}
        </Text>
        <Flex align="center" mt="6" justify={'center'} gap="4">
          <Button py="3" px="4" fontWeight={'800'} bg="#fff" color="#000" _hover={{ bg: '#fff' }} onClick={onConfirm}>
            Confirm
          </Button>
          <Button py="3" px="4" fontWeight={'800'} color="#fff" onClick={onCancel}>
            Cancel
          </Button>
        </Flex>
      </Box>
    </TxModal>
  );
}
