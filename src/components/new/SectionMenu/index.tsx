import { Box } from '@chakra-ui/react';

export function SectionMenu({ children, ...restProps }: any) {
  return (
    <Box
      display="flex"
      {...restProps}
    >
      {children}
    </Box>
  );
}

export function SectionMenuItem({ children, isActive, ...restProps }: any) {
  return (
    <Box
      fontFamily="Nunito"
      fontWeight="800"
      fontSize="20px"
      marginRight="24px"
      cursor="pointer"
      color={isActive ? 'black' : '#898989'}
      {...restProps}
    >
      {children}
    </Box>
  );
}
