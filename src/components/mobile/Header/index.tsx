import { Box, Text } from '@chakra-ui/react';
import BackIcon from '@/components/Icons/mobile/Back'

export default function Header({ title, onBack, showBackButton }: any) {
  return (
    <Box
      height="44px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      marginTop="18px"
      background="white"
      position="relative"
    >
      {showBackButton && (
        <Box
          position="absolute"
          left="20px"
          top="calc(50% - 16px)"
          cursor="pointer"
          onClick={onBack}
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
