import LogoIcon from '@/assets/logo-v3.svg';
import LogoText from '@/assets/logo-text-v3.svg';
import { Box } from '@chakra-ui/react';
import { Image } from '@chakra-ui/react';

export default function Logo({ direction }: any) {
  return (
    <Box display="flex" minHeight="100px" alignItems="center" flexDirection={direction || 'row'}>
      <Image width="70px" src={LogoIcon} alt="Logo" />
      <Image height="22px" src={LogoText} alt="Logo Text" margin="10px" />
    </Box>
  );
}
