import { toShortAddress } from '@/lib/tools';
import { useSignerStore } from '@/store/signer';
import { Menu, MenuButton, MenuItem, MenuList, Box, Text, Image, Flex, FlexProps } from '@chakra-ui/react';
import { SignkeyType } from '@soulwallet/sdk';
import DropdownSelect from '../DropdownSelect';
import IconChecked from '@/assets/icons/signer-checked.svg';
import IconUnchecked from '@/assets/icons/signer-unchecked.svg';

const SignerItem = ({ title, checked, ...restProps }: { title: string; checked: boolean } & FlexProps) => {
  return (
    <Flex justify={'space-between'} w="100%" gap="3" {...restProps}>
      <Flex align={'center'} gap="2">
        <Box w="10" h="10" bg="#EFEFEF" rounded="full" />
        <Box>
          <Text fontWeight={'700'} mb="2px">
            {title}
          </Text>
          <Flex>
            <Text>{/* {toShortAddress()} */}</Text>
          </Flex>
        </Box>
      </Flex>
      <Image src={checked ? IconChecked : IconUnchecked} />
    </Flex>
  );
};
export default function SignerSelect() {
  const { getSelectedKeyType, signerId, setSignerId, eoas, credentials } = useSignerStore();

  return (
    <Menu>
      <MenuButton>
        <DropdownSelect>
          <Text>
            {getSelectedKeyType() === SignkeyType.EOA
              ? `Wallet(${toShortAddress(signerId)})`
              : `Passkey(${toShortAddress(signerId)})`}
          </Text>
        </DropdownSelect>
      </MenuButton>
      <MenuList p="4">
        <Text fontWeight={'700'} mb="5" lineHeight={'1'}>
          EOA wallet
        </Text>
        {eoas.map((item) => (
          <MenuItem p="0" _hover={{ bg: 'none' }}>
            <SignerItem title={toShortAddress(item)} checked={signerId === item} onClick={() => setSignerId(item)} />
          </MenuItem>
        ))}

        {eoas.length && credentials.length && <Box bg="rgba(0, 0, 0, 0.05)" h="1px" my="5" />}

        <Text fontWeight={'700'} mb="5" lineHeight={'1'}>
          Passkey
        </Text>

        {credentials.map((item: any) => (
          <MenuItem p="0" _hover={{ bg: 'none' }}>
            <SignerItem title={item.name} checked={signerId === item.id} onClick={() => setSignerId(item.id)} />
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
