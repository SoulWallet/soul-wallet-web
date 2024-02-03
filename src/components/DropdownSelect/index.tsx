import IconChevronRight from '@/assets/icons/chevron-right.svg';
import { ReactNode } from 'react';
import { Menu, MenuButton, MenuItem, MenuList, Text, Image, Flex } from '@chakra-ui/react';

export default function DropdownSelect({ children }: { children: ReactNode }) {
  return (
    <Flex align={'center'} color="#000" fontSize={"14px"} fontWeight={"600"} py="1" gap="1" px="2" rounded={'20px'} bg="#EFEFEF">
      {children}
      <Image src={IconChevronRight} />
    </Flex>
  );
}
