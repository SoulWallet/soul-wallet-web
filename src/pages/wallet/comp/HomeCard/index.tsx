import { Flex, Text, Box, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import IconChevronRight from '@/assets/icons/chevron-right.svg';

export const ExternalLink = ({ title, to }: any) => {
  return (
    <Flex as={Link} to={to} gap="1">
      <Text fontWeight={'800'}>{title}</Text>
      <Image w="5" src={IconChevronRight} />
    </Flex>
  );
};

export default function HomeCard({ title, external, contentHeight, titleProps, children, ...restProps }: any) {
  return (
    <Box>
      <Flex align="center" justify={'space-between'} mb="4px">
        <Text fontSize={{ base: '24px', lg: '32px' }} fontWeight={'800'} color="#000" {...titleProps}>
          {title}
        </Text>
        {external}
      </Flex>
      <Box
        h={{ lg: contentHeight }}
        overflowY={'auto'}
        bg="#fff"
        rounded="20px"
        p={{ base: 3, lg: 6 }}
        fontSize={'14px'}
        lineHeight={'1'}
        {...restProps}
      >
        {children}
      </Box>
    </Box>
  );
}
