import React from 'react';
import { Box, Flex, Menu, MenuButton, Image, MenuItem, Text, MenuList, MenuDivider } from '@chakra-ui/react';
import useWalletContext from '@/context/hooks/useWalletContext';
import IconGuide from '@/assets/icons/guide.svg';
import IconDollar from '@/assets/icons/dollar.svg';

export default function GuideButton() {
  const { showClaimAssets, showTestGuide } = useWalletContext();

  const links = [
    {
      icon: IconGuide,
      title: 'Test guide',
      onClick: showTestGuide,
    },
    {
      icon: IconDollar,
      title: 'Test tokens',
      onClick: showClaimAssets,
    },
  ];

  return (
    <Menu>
      {() => (
        <>
          <MenuButton data-testid="btn-guide">
            <Box bg="#f2f2f2" rounded="full" py="5px" px="3" cursor={'pointer'}>
              <Image src={IconGuide} />
            </Box>
          </MenuButton>
          <MenuList>
            {links.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx !== 0 && <MenuDivider />}
                <MenuItem onClick={item.onClick}>
                  <Flex align={'center'} gap="1" justify="space-between">
                    <Image src={item.icon} />
                    <Text fontSize={'16px'} fontWeight={'800'} color="#000">
                      {item.title}
                    </Text>
                  </Flex>
                </MenuItem>
              </React.Fragment>
            ))}
          </MenuList>
        </>
      )}
    </Menu>
  );
}
