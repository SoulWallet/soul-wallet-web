import React, { useEffect, useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import Button from '@/components/Button';
import useWalletContext from '@/context/hooks/useWalletContext';
import { guideList } from '@/data';
import useBrowser from '@/hooks/useBrowser';
import api from '@/lib/api';
import { useSlotStore } from '@/store/slot';
import { useAddressStore } from '@/store/address';
import { findMissingNumbers } from '@/lib/tools';
import useTools from '@/hooks/useTools';
import { useSettingStore } from '@/store/setting';

export default function Guidance() {
  const { slotInfo } = useSlotStore();
  const { setFinishedSteps, finishedSteps } = useSettingStore();
  const { goGuideAction } = useTools();

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

  if (!missingSteps.length) {
    return;
  }

  const currentStep = guideList[missingSteps[0]];

  return (
    <Flex px="6" h="120px" gap="6" bg="#fff" rounded="20px" align={'center'} justify={'space-between'}>
      <Flex flexDir={'column'} gap="1">
        <Text fontSize={'18px'} fontWeight={'800'} lineHeight={'24px'}>
          {currentStep.title}
        </Text>
        <Text fontWeight="600" lineHeight={'18px'}>
          {currentStep.desc}
        </Text>
      </Flex>
      <Button
        boxSizing="content-box"
        px="6"
        py="10px"
        fontWeight={'800'}
        onClick={() => {
          goGuideAction(currentStep.id);
        }}
        bg="#6A52EF"
        color="white"
        _hover={{ bg: '#6A52EF', color: 'white' }}
      >
        {currentStep.buttonText}
      </Button>
    </Flex>
  );
}
