import { Box } from '@chakra-ui/react';

export default function GreySection({ leftPart, rightPart, ...props }: any) {
  return (
    <Box
      width="100%"
      bg="#EDEDED"
      borderRadius="20px"
      padding="45px"
      display="flex"
      alignItems="flex-start"
      justifyContent="space-around"
      margin="0 auto"
      flexDirection={{ base: 'column', md: 'row' }}
      {...props}
    >
      <Box width={{ base: '100%', md: '40%' }} paddingRight={{ base: '0', md: '30px' }}>
        {leftPart}
      </Box>
      <Box width={{ base: '100%', md: '60%' }} marginTop={{ base: '20px', md: '0' }}>
        {rightPart}
      </Box>
    </Box>
  );
}
