import { Flex, Text, Tooltip, Box } from '@chakra-ui/react';
import { Image } from '@chakra-ui/react';
import { motion } from 'framer-motion';

export const TruncateString = ({ str, num }: any) => {
  if (str.length > num) {
    return (
      <Flex>
        <Tooltip label={str}>{str.substring(0, num)}</Tooltip>
        <Text>...</Text>
      </Flex>
    );
  }
  return <Text>{str}</Text>;
};

interface IListItem {
  idx: number;
  icon: any;
  title: string;
  // titleDesc: string;
  amount: string;
  lineColor: string;
  // amountDesc: string;
  onClick?: () => void;
}

export default function ListItem({ icon, title, onClick, amount, idx, lineColor }: IListItem) {
  return (
    <Flex
      onClick={onClick}
      justify={'space-between'}
      align={'center'}
      cursor={'pointer'}
      pt={idx === 0 ? '0px' : ''}
      transition={'all'}
    >
      <Flex w="33%" gap="2" align={'center'}>
        {/* <ImageIcon src={icon} /> */}
        <Image src={icon} w="32px" h="32px" />
        <Box lineHeight={'1.25'}>
          <Text fontWeight={'800'} mb="2px" textTransform={'capitalize'}>
            {title}
          </Text>
          <Text fontSize={'12px'}>$2309.12</Text>
        </Box>
      </Flex>

      <Box w="33%" lineHeight={'1.25'} textAlign={'right'} pr="64px">
        <Text fontWeight={'800'} mb="2px" textTransform={'capitalize'}>
          {amount}
        </Text>
        <Text fontSize={'12px'}>$2309.12</Text>
      </Box>

      <Flex w="33%" gap="3" align="center">
        <Box bg="#d9d9d9" rounded={'8px'} overflow={'hidden'} h="6px" pos="relative" w="150px">
          <Box
            as={motion.div}
            bg={lineColor}
            pos="absolute"
            h="6px"
            initial={{ width: '0' }}
            animate={{ width: '40%' }}
          />
        </Box>
        <Text fontSize={'12px'}>40%</Text>
        {/* <Flex display="span" fontWeight={'600'} color="#898989">
          <TruncateString str={amountDesc} num={6} />
        </Flex> */}
      </Flex>
    </Flex>
  );
}
