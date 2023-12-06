import React from 'react';
import { Box, Flex, Menu, MenuButton, Image, MenuItem, Text, MenuList, MenuDivider } from '@chakra-ui/react';
import useBrowser from '@/hooks/useBrowser';
import MenuIcon from '@/components/Icons/Menu';
import AssetIcon from '@/components/Icons/Asset';
import ActivityIcon from '@/components/Icons/Activity';
import LogoutIcon from '@/components/Icons/Logout';
import AppsIcon from '@/components/Icons/Apps';
import SecurityIcon from '@/components/Icons/Security';
import { toCapitalize } from '@/lib/tools';
import storage from '@/lib/storage';
import useTools from '@/hooks/useTools';

const getPageIcon = (type: string) => {
  if (type === 'asset') {
    return <AssetIcon />;
  } else if (type === 'activity') {
    return <ActivityIcon />;
  } else if (type === 'apps') {
    return <AppsIcon />;
  } else if (type === 'security') {
    return <SecurityIcon />;
  } else if (type === 'logout') {
    return <LogoutIcon />;
  }
};

export default function PageSelect() {
  const { navigate } = useBrowser();
  const { clearLogData } = useTools();

  const doLogout = () => {
    clearLogData();
    navigate('/launch');
  };

  return (
    <Menu>
      {() => (
        <>
          <MenuButton data-testid="btn-page-select">
            <Flex p="5px" rounded={'full'} cursor={'pointer'}>
              <MenuIcon />
            </Flex>
          </MenuButton>
          <MenuList
            width="264px"
            display="flex"
            paddingTop="0px"
            paddingBottom="20px"
            paddingRight="20px"
            flexWrap="wrap"
            boxSizing="border-box"
          >
            {['asset', 'activity', 'apps', 'security', 'logout'].map((item: any, idx: number) => {
              return (
                <MenuItem
                  key={item}
                  onClick={() => (item === 'logout' ? doLogout() : navigate(`/${item}`))}
                  width="60px"
                  height="60px"
                  borderRadius="16px"
                  bg="#EDEDED"
                  marginTop="20px"
                  marginLeft="20px"
                  boxSizing="border-box"
                  _hover={{ background: '#EDF2F7' }}
                >
                  <Flex w="100%" align={'center'} justify={'center'}>
                    <Flex align={'center'} direction="column" justify="center">
                      <Box>{getPageIcon(item)}</Box>
                      <Text data-testid={`text-pagename-${idx}`} fontSize="12px" fontWeight={'700'}>
                        {toCapitalize(item)}
                      </Text>
                    </Flex>
                  </Flex>
                </MenuItem>
              );
            })}
          </MenuList>
        </>
      )}
    </Menu>
  );
}
