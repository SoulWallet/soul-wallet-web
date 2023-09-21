import { Text, Grid, GridItem, useToast } from '@chakra-ui/react';
import { Image } from '@chakra-ui/react';
import useBrowser from '@/hooks/useBrowser';
import IconAddFunds from '@/assets/actions/add-funds.svg';
import IconSend from '@/assets/actions/send.svg';
import IconGuardians from '@/assets/actions/guardians.svg';
import Icon2FA from '@/assets/actions/2fa.svg';
import { ethers } from 'ethers';

const ActionItem = ({ icon, title, onClick }: any) => {
  return (
    <GridItem
      p="10px"
      bg="white"
      _hover={{ bg: '#eee' }}
      display={'flex'}
      gap="1"
      alignItems={'center'}
      justifyContent={'center'}
      rounded={'16px'}
      cursor={'pointer'}
      onClick={onClick}
    >
      <Image src={icon} w="28px" h="28px" />
      <Text fontWeight={'700'} fontSize="14px">
        {title}
      </Text>
    </GridItem>
  );
};

export default function Actions({ showSetGuardian }: any) {
  const { navigate } = useBrowser();
  const toast = useToast();
  return (
    <>
      <Grid templateColumns={'repeat(2, 1fr)'} gap="1" mt="4">
        <ActionItem title="Add funds" icon={IconAddFunds} onClick={() => navigate(`add-fund`)} />
        <ActionItem title="Send tokens" icon={IconSend} onClick={() => navigate(`send/${ethers.ZeroAddress}`)} />
        {!showSetGuardian && (
          <>
            <ActionItem title="Guardians" icon={IconGuardians} onClick={() => navigate(`edit-guardians`)} />
            <ActionItem
              title="Authenticate"
              icon={Icon2FA}
              onClick={() => toast({ title: 'Coming soon', status: 'info' })}
            />
          </>
        )}
      </Grid>
    </>
  );
}
