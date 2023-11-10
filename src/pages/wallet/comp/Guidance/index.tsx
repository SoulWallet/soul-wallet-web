import React, { useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import Button from '@/components/Button';

const steps = [
  {
    title: 'Begin with Tokens!',
    desc: `Grab some test tokens to explore the features and capabilities we offer.`,
    button: <Button px="6" py="10px" fontWeight={"800"}>Claim</Button>,
  },
];

export default function Guidance() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex];
  return (
    <Flex  px="6" h="120px" gap="6" bg="#fff" rounded="20px" align={"center"} justify={"space-between"}>
      <Flex flexDir={"column"} gap="1">
        <Text fontSize={'18px'} fontWeight={'800'} lineHeight={"24px"}>
          {currentStep.title}
        </Text>
        <Text fontWeight="600" lineHeight={"18px"}>{currentStep.desc}</Text>
      </Flex>
      {currentStep.button}
    </Flex>
  );
}
