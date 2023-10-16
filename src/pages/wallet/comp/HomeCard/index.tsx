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

export default function HomeCard({ title, external, contentHeight, children }: any) {
  return (
    <>
      <Flex align="center" justify={'space-between'} mb="4px">
        <Text fontSize={'32px'} fontWeight={'800'} color="#000">
          {title}
        </Text>
        {external}
      </Flex>
      <Box h={contentHeight} overflowY={'auto'} bg="#fff" rounded="20px" p="6" fontSize={'14px'} lineHeight={'1'}>
        {children}
      </Box>
    </>
  );
}
