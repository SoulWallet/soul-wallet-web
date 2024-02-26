import { toShortAddress } from '@/lib/tools';
import { ICredentialItem, useSignerStore } from '@/store/signer';
import { Menu, MenuButton, MenuItem, MenuList, Box, Text, Image, Flex, FlexProps, Tooltip } from '@chakra-ui/react';
import { SignkeyType } from '@soulwallet/sdk';
import DropdownSelect from '../DropdownSelect';
import IconChecked from '@/assets/icons/signer-checked.svg';
import IconUnchecked from '@/assets/icons/signer-unchecked.svg';
import IconWallet from '@/assets/icons/signer-wallet.svg';
import IconPasskey from '@/assets/icons/signer-passkey.svg';

const SignerItem = ({
  title,
  checked,
  type,
  ...restProps
}: { title: string; checked: boolean; type: 'wallet' | 'passkey' } & FlexProps) => {
  return (
    <Flex justify={'space-between'} w="100%" gap="3" {...restProps}>
      <Flex align={'center'} gap="2">
        <Flex align={'center'} justify={'center'} w="10" h="10" bg="#EFEFEF" rounded="full">
          <Image src={type === 'wallet' ? IconWallet : IconPasskey} />
        </Flex>
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
export default function SignerSelect({ onChange }: { onChange?: () => void }) {
  const { getSelectedKeyType, signerId, setSignerId, eoas, credentials } = useSignerStore();

  const onSelect = (_signerId: string, _signerType: any) => {
    if (onChange) {
      onChange();
    }
    setSignerId(_signerId);
  };

  const availableCredentials = credentials.filter((item: ICredentialItem) => item.id);

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
        {eoas.length > 0 ? (
          <>
            <Text fontWeight={'700'} mb="5" lineHeight={'1'}>
              EOA wallet
            </Text>
            {eoas.map((item) => (
              <MenuItem p="0" bg="none !important" key={item}>
                <SignerItem
                  title={toShortAddress(item)}
                  checked={signerId === item}
                  onClick={() => onSelect(item, SignkeyType.EOA)}
                  type="wallet"
                />
              </MenuItem>
            ))}
          </>
        ) : null}

        {eoas.length && availableCredentials.length ? <Box bg="rgba(0, 0, 0, 0.05)" h="1px" my="5" /> : null}

        {availableCredentials.length > 0 ? (
          <>
            <Text fontWeight={'700'} mb="5" lineHeight={'1'}>
              Passkey
            </Text>
            {availableCredentials.map((item: any) => (
              <MenuItem p="0" bg="none !important" key={item.id}>
                <SignerItem
                  title={item.name}
                  checked={signerId === item.id}
                  onClick={() => onSelect(item.id, item.algorithm === 'ES256' ? SignkeyType.P256 : SignkeyType.RS256)}
                  type="passkey"
                />
              </MenuItem>
            ))}
          </>
        ) : null}
      </MenuList>
    </Menu>
  );
}
