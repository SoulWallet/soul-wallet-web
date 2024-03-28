import { Box, Text, Image,} from '@chakra-ui/react';
import BackIcon from '@/components/Icons/mobile/Back'
import ImgLogo from '@/assets/logo.svg';

export default function Header({ title, onBack, showBackButton, showLogo, ...props }: any) {
  return (
    <Box
      height="62px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      background="white"
      position="relative"
      paddingTop="18px"
      {...props}
    >
      {showLogo && (
        <Box
          position="absolute"
          left="20px"
          top="0px"
          cursor="pointer"
          paddingTop="18px"
        >
          <Image src={ImgLogo} />
        </Box>
      )}
      {showBackButton && (
        <Box
          position="absolute"
          left="20px"
          top="0px"
          cursor="pointer"
          paddingTop="18px"
          onClick={onBack}
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <BackIcon />
        </Box>
      )}
      <Box fontSize="18px" fontWeight="700" color="black" lineHeight="24px">
        {title}
      </Box>
    </Box>
  );
}
