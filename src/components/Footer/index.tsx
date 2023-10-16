import { Flex, Image, Menu, MenuButton, MenuItem, MenuList, MenuDivider, Text } from '@chakra-ui/react';
import React from 'react';
import IconHelp from '@/assets/icons/help.svg';
import IconPincer from '@/assets/icons/pincer.svg';
import IconChat from '@/assets/icons/chat.svg';
import IconTeam from '@/assets/icons/team.svg';
import packageJson from '../../../package.json';

const helpLinks = [
  {
    icon: IconPincer,
    title: 'Report bug',
  },
  {
    icon: IconChat,
    title: 'Feedback',
  },
  {
    icon: IconTeam,
    title: 'Talk to team',
  },
];

export default function Footer() {
  return (
    <Flex
      justify={'flex-end'}
      align={'center'}
      mt="16"
      py="6"
      gap="10px"
      fontSize={'12px'}
      fontWeight={'300'}
      fontFamily={'Martian'}
    >
      <Menu>
        <MenuButton _hover={{ bg: '#ededed' }} p="10px" rounded="full">
          <Image src={IconHelp} />
        </MenuButton>
        <MenuList>
          {helpLinks.map((item: any, idx: number) => {
            return (
              <React.Fragment key={idx}>
                {idx ? <MenuDivider /> : ''}
                <MenuItem key={item.address}>
                  <Flex w="100%" align={'center'} justify={'space-between'}>
                    <Flex align={'center'} gap="2">
                      <Image src={item.icon} w="5" />
                      <Text fontSize={'16px'} fontWeight={'700'} lineHeight={1}>
                        {item.title}
                      </Text>
                    </Flex>
                  </Flex>
                </MenuItem>
              </React.Fragment>
            );
          })}
        </MenuList>
      </Menu>
      <Text>Beta {packageJson.version}</Text>
    </Flex>
  );
}
