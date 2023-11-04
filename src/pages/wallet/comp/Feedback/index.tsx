import { useState } from 'react';
import { Textarea, Image, Text, Box, useToast, Input as CInput } from '@chakra-ui/react';
import HomeCard from '../HomeCard';
import IconPlus from '@/assets/icons/dapp-plus.svg';
import api from '@/lib/api';
import Button from '@/components/Button';
import Uploader from '@/components/Uploader';

const Input = ({ ...restProps }: any) => {
  return <CInput bg="#f5f5f5" rounded="20px" border="none" py="4" {...restProps} />;
};

export default function Feedback() {
  const [value, setValue] = useState('');
  const [fileList, setFileList] = useState<any>([]);
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const doSubmit = async () => {
    setLoading(true);
    const res = await api.operation.feedback({
      body: value,
      contact,
      address,
      fileKeys: fileList.map((item: any) => item.fileKey),
    });
    console.log('subscribe res', res);
    if (true) {
      setValue('');
      toast({
        title: 'Feedback submitted',
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

  return (
    <HomeCard title={'Feedback'}>
      <Textarea
        placeholder={`Let us know how we can help. 
Suggest features you want to include
For bugs, include steps to reproduce.
Share your contact for follow-up`}
        border="none"
        _placeholder={{ color: 'brand.gray' }}
        bg="#f5f5f5"
        h="140px"
        rounded="16px"
        py="3"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        mb="3"
      />
      {value && (
        <>
          <Uploader onUploaded={onUploaded} mb="3">
            <Box
              border="1px dashed #000"
              _hover={{ bg: '#fafafa' }}
              cursor={'pointer'}
              display={'flex'}
              gap="2"
              py="6"
              rounded="20px"
              alignItems={'center'}
              justifyContent={'center'}
            >
              <Image src={IconPlus} w="28px" />
              <Text fontWeight={'600'} color="#brand.gray">
                Attach media (optional)
              </Text>
            </Box>
          </Uploader>

          {fileList && fileList.length > 0 && (
            <Box
              border="1px dashed #000"
              _hover={{ bg: '#fafafa' }}
              cursor={'pointer'}
              display={'flex'}
              gap="2"
              py="2"
              px="4"
              rounded="20px"
              alignItems={'center'}
              mb="3"
            >
              {fileList.map((item: any) => (
                <Image h="16" src={item.accessUrl} key={item.fileKey} />
              ))}
            </Box>
          )}

          <Input
            mb="3"
            h="52px"
            placeholder="Your contact (optional)"
            value={contact}
            onChange={(e: any) => setContact(e.target.value)}
          />
          <Input
            mb="3"
            h="52px"
            placeholder="Your walelt address (optional)"
            value={address}
            onChange={(e: any) => setAddress(e.target.value)}
          />
          <Button loading={loading} onClick={doSubmit} fontSize="20px" fontWeight={'800'} w="100%" py="4">
            Submit
          </Button>
        </>
      )}
    </HomeCard>
  );
}
