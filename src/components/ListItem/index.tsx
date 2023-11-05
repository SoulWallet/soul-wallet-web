import { Flex, Text, Tooltip } from '@chakra-ui/react';
import { Image } from '@chakra-ui/react';

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
  titleDesc: string;
  amount: string;
  amountDesc: string;
  onClick?: () => void;
}

export default function ListItem({ icon, title, titleDesc, onClick, amount, amountDesc, idx }: IListItem) {
  return (
    <Flex
      onClick={onClick}
      justify={'space-between'}
      align={'center'}
      // py="3"
      cursor={'pointer'}
      pt={idx === 0 ? '0px' : ''}
      transition={'all'}
      _hover={{ transform: 'scale(0.99)' }}
    >
      <Flex gap="3" align={'center'}>
        <Image src={icon} w="38px" h="38px" />
        <Flex flexDir={'column'} gap="1">
          <Text fontWeight={'800'} textTransform={'capitalize'}>
            {title}
          </Text>
          <Text fontWeight={'600'}>{titleDesc}</Text>
        </Flex>
      </Flex>
      <Flex gap="1" align="center">
        <Text display="span" fontWeight={'800'}>
          {amount}
        </Text>
        <Flex display="span" fontWeight={'600'} color="#898989">
          <TruncateString str={amountDesc} num={6} />
        </Flex>
      </Flex>
    </Flex>
  );
}
