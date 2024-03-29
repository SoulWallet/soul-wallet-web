import { useState } from 'react';
import { Textarea, Image, Text, Box, useToast, Flex } from '@chakra-ui/react';
import IconPlus from '@/assets/icons/dapp-plus.svg';
import Input from '@/components/Input';
import api from '@/lib/api';
import Button from '@/components/Button';
import Uploader from '@/components/Uploader';
import { useAddressStore } from '@/store/address';

export default function Feedback({ onCancel }: { onCancel: () => void }) {
  const [value, setValue] = useState('');
  const [fileList, setFileList] = useState<any>([]);
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const { selectedAddress } = useAddressStore();

  const toast = useToast();
  const doSubmit = async () => {
    if (!value) {
      toast({
        title: 'Please enter your feedback',
        status: 'error',
      });
      return;
    }
    setLoading(true);
    const res = await api.operation.feedback({
      body: value,
      contact,
      address: selectedAddress,
      fileKeys: fileList.map((item: any) => item.fileKey),
    });
    console.log('subscribe res', res);
    if (true) {
      setValue('');
      setFileList([]);
      onCancel();
      toast({
        title: 'We received your feedback. Thank you!',
        status: 'success',
      });
    }
    setLoading(false);
  };

  const onUploaded = (file: any) => {
    setFileList((prev: any) => {
      return [...prev, file];
    });
  };

  const removeFromFiles = (index: number) => {
    setFileList((prev: any) => {
      prev.splice(index, 1);
      console.log('prev is', prev);
      return [...prev];
    });
  };

  return (
    <Box>
      <Textarea
        placeholder={`Please feel free to provide any feedback, or report bugs :)`}
        boxShadow={'none !important'}
        border="none"
        _placeholder={{ color: 'brand.gray' }}
        bg="#f9f9f9"
        h="140px"
        rounded="16px"
        py="3"
        px="4"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        mb="18px"
      />
      <Uploader onUploaded={onUploaded} mb="18px">
        <Box
          border="1px dashed rgba(0, 0, 0, 0.30)"
          _hover={{ bg: '#fafafa' }}
          cursor={'pointer'}
          display={'flex'}
          gap="1"
          py="14px"
          rounded="20px"
          alignItems={'center'}
          justifyContent={'center'}
        >
          <Image src={IconPlus} w="20px" />
          <Text fontWeight={'600'} fontSize={'14px'} color="rgba(0, 0, 0, 0.60)">
            Attach media (optional)
          </Text>
        </Box>
      </Uploader>

      {fileList && fileList.length > 0 && (
        <Box
          border="1px dashed #000"
          _hover={{ bg: '#fafafa' }}
          display={'flex'}
          gap="2"
          py="2"
          px="4"
          rounded="20px"
          alignItems={'center'}
          mb="3"
        >
          {fileList.map((item: any, idx: number) => (
            <Box key={item.fileKey} pos="relative" _hover={{ '& > .delete-modal': { display: 'flex' } }}>
              <Box
                onClick={() => removeFromFiles(idx)}
                className="delete-modal"
                pos={'absolute'}
                top="0"
                right="0"
                bottom="0"
                left="0"
                bg="rgba(30,30,30,.4)"
                zIndex={'100'}
                display={'none'}
                alignItems={'center'}
                justifyContent={'center'}
                cursor={'pointer'}
              >
                <Text color="#fff">Delete</Text>
              </Box>
              {item.fileType.startsWith('video') && <video style={{ height: '64px' }} src={item.accessUrl} />}
              {item.fileType.startsWith('image') && <Image h="16" src={item.accessUrl} />}
            </Box>
          ))}
        </Box>
      )}

      <Input
        mb="18px"
        h="52px"
        placeholder="Your contact (optional)"
        value={contact}
        bg="#f9f9f9"
        rounded="20px"
        border="none !important"
        py="4"
        onChange={(e: any) => setContact(e.target.value)}
      />

      <Flex justify={'flex-end'} mb="3">
        <Button loading={loading} onClick={doSubmit} disabled={!value} fontSize="18px" fontWeight={'700'} py="3" px="6">
          Submit
        </Button>
      </Flex>
    </Box>
  );
}
