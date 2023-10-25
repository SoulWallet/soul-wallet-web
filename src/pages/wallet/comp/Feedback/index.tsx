import { useState } from 'react';
import { Textarea, Image, Text, Box, useToast } from '@chakra-ui/react';
import HomeCard from '../HomeCard';
import IconPlus from '@/assets/icons/dapp-plus.svg';
import api from '@/lib/api';
import Button from '@/components/Button';
export default function Feedback() {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const doSubmit = async () => {
    setLoading(true);
    const res = await api.operation.feedback({
      body: value,
    });
    if (true) {
      setValue('');
      toast({
        title: 'Feedback submitted',
        status: 'success',
      });
    }
    setLoading(false);
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
          {/* <Box
            border="1px dashed #000"
            _hover={{ bg: '#fafafa' }}
            cursor={'pointer'}
            display={'flex'}
            gap="2"
            py="6"
            rounded="20px"
            alignItems={'center'}
            justifyContent={'center'}
            mb="3"
          >
            <Image src={IconPlus} w="28px" />
            <Text fontWeight={'600'} color="#brand.gray">
              Attach media (optional)
            </Text>
          </Box> */}
          <Button loading={loading} onClick={doSubmit} fontSize="20px" fontWeight={'800'} w="100%" py="4">
            Submit
          </Button>
        </>
      )}
    </HomeCard>
  );
}
