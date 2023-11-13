import React, { useState, forwardRef, useImperativeHandle, useEffect, Ref } from 'react';
import { useToast, Text, Image, Box, Flex, Divider } from '@chakra-ui/react';
import TxModal from '../TxModal';
import IconChecked from '@/assets/icons/checked.svg';
import IconUnchecked from '@/assets/icons/unchecked.svg';

const guideList = [
  'Send and receive tokens.',
  'Change guardians.',
  'Execute a token swap on Uniswap.',
  'Deposit tokens into the Aave protocol to earn interest.',
  'Recover the wallet.',
];

const TestGuideModal = (_: unknown, ref: Ref<any>) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [promiseInfo, setPromiseInfo] = useState<any>({});

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

  const onClose = async () => {
    setVisible(false);
    promiseInfo.reject('User close');
  };

  return (
    <div ref={ref}>
      <TxModal
        bodyStyle={{
          pt: { base: 4 },
          pb: { base: 4 },
          px: { base: 4 },
        }}
        visible={visible}
        width={{ base: '90%', lg: '500px' }}
        onClose={onClose}
        title="Check list for your test"
      >
        <Flex flexDir="column">
          {guideList.map((item, idx: number) => (
            <React.Fragment key={idx}>
              {idx ? <Divider my="3" /> : ''}
              <Flex gap="2">
                <Image src={IconUnchecked} w="5" />
                <Text fontWeight={'800'} fontSize={'16px'}>
                  {idx + 1}. {item}
                </Text>
              </Flex>
            </React.Fragment>
          ))}
        </Flex>
      </TxModal>
    </div>
  );
};

export default forwardRef(TestGuideModal);
