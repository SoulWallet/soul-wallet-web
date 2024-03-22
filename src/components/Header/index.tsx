import { Box, Flex, Image, Button, Text } from '@chakra-ui/react';
import IconLogo from '@/assets/logo-all-v3.svg';
import IconExit from '@/assets/icons/exit.svg';
import { Link } from 'react-router-dom';
import { headerHeight } from '@/config';

export default function Header() {
  return (
    <Flex
      as="header"
      h={`${headerHeight}px`}
      px={{ base: '2', md: 5 }}
      bg="#fff"
      borderBottom={'1px solid #e6e6e6'}
      align="center"
      justify={'space-between'}
    >
      <Link to="/dashboard">
        <Image src={IconLogo} h={{base: "24px", sm: "32px", md: "44px"}} />
      </Link>
      <Flex gap="2" align={'center'}>
        <Flex
          // onClick={() => showLogout()}
          cursor={'pointer'}
          align={'center'}
          justify={'center'}
          w="42px"
          h="42px"
          rounded="full"
          bg="#F2F2F2"
        >
          <Image src={IconExit} />
        </Flex>
      </Flex>
    </Flex>
  );
}
