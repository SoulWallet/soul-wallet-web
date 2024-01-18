import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Image } from '@chakra-ui/react';
import Button from '@/components/Button';
import { guideList } from '@/data';
import api from '@/lib/api';
import ImgArrowUp from '@/assets/icons/arrow-up.svg';
import { findMissingNumbers } from '@/lib/tools';
import { useSlotStore } from '@/store/slot';
// import { useAddressStore } from '@/store/address';
// import { findMissingNumbers } from '@/lib/tools';
import useTools from '@/hooks/useTools';
import { useSettingStore } from '@/store/setting';

export default function SetGuardianHint() {
  const { slotInfo } = useSlotStore();
  const { setFinishedSteps, finishedSteps } = useSettingStore();
  const { goGuideAction } = useTools();
  // todo, should remmeber this
  const [opened, setOpened] = useState(true);

  const checkSteps = async () => {
    const res = await api.operation.finishStep({
      slot: slotInfo.slot,
      steps: [],
    });

    setFinishedSteps(res.data.finishedSteps);
  };

  useEffect(() => {
    checkSteps();
  }, []);

  const missingSteps = findMissingNumbers([0, 1, 2, 3, 4, 5], finishedSteps);

  const currentStep = guideList[missingSteps[0]];

  if (!missingSteps.length) {
    return;
  }

  return (
    <Box
      px="6"
      // h="160px"
      pb="2px"
      w="380px"
      // mt="-16px"
      mt="-2"
      bg="#fff"
      border="1px solid #EAECF0"
      boxShadow={'0px 4px 60px 0px rgba(44, 53, 131, 0.08)'}
      roundedBottomLeft={'20px'}
      roundedBottomRight={'20px'}
    >
      {opened && (
        <>
          <Text fontSize={'18px'} fontWeight={'800'} lineHeight={'1.25'} mt="7" mb="3">
          {currentStep.title}
          </Text>
          <Flex align={'center'} justify={'space-between'} gap="8">
            <Text fontSize={'12px'} lineHeight={'1.5'}>
            {currentStep.desc}
            </Text>
            <Button
              boxSizing="content-box"
              px="5"
              py="2"
              fontWeight={'700'}
              fontSize={'12px'}
              onClick={() => {
                goGuideAction(currentStep.id);
              }}
              bg="brand.black"
              color="white"
              _hover={{ bg: 'brand.purple', color: 'white' }}
            >
               {currentStep.buttonText}
            </Button>
          </Flex>
        </>
      )}
      <Box textAlign={'center'} cursor={'pointer'} onClick={() => setOpened((prev) => !prev)}>
        <Image
          src={ImgArrowUp}
          transform={opened ? 'rotate(0deg)' : 'rotate(180deg)'}
          mt={opened ? 3 : 2}
          mx="auto"
          display={'block'}
        />
      </Box>
    </Box>
  );
}
