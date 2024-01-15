import { Box, Flex, Image, Button, Text } from '@chakra-ui/react';
import { sidebarLinks } from '@/config/constants';
import { Link, useLocation } from 'react-router-dom';
import Footer from '../Footer';

export default function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <Flex flexDir={'column'} justify={'space-between'} m="6" mr="0">
      <Flex flexDir={'column'} gap="28px">
        {sidebarLinks.map((link, index) => {
          const isActive = link.href === pathname;
          return (
            <Flex as={Link} to={link.href} gap="2" align={'center'} cursor={'pointer'}>
              <Image w="6" src={isActive ? link.iconActive : link.icon} />
              <Text
                fontWeight={isActive ? '700' : '600'}
                color={isActive ? 'brand.purple' : 'brand.black'}
                fontSize={'16px'}
                className="title"
              >
                {link.title}
              </Text>
            </Flex>
          );
        })}
      </Flex>

      <Flex flexDir={'column'} gap="8">
        <Footer />
      </Flex>
    </Flex>
  );
}
