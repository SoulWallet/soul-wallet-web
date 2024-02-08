import { Flex, Text, Box, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
// import IconChevronRight from '@/assets/icons/chevron-right.svg';

export const ExternalLink = ({ title, to }: any) => {
  return (
    <Flex as={Link} to={to}>
      <Text color="#5B606D" fontWeight={'600'}>
        {title}
      </Text>
      {/* <Image w="5" src={IconChevronRight} /> */}
    </Flex>
  );
};

export default function HomeCard({ title, external, h, wrapperZIndex, titleProps, children, ...restProps }: any) {
  return (
    <Box h={h} zIndex={wrapperZIndex}>
      <Flex align="center" justify={'space-between'}>
        <Text fontSize={{ base: '20px', lg: '28px' }} fontWeight={'800'} color="brand.black" {...titleProps}>
          {title}
        </Text>
        {external}
      </Flex>
      <Box h="1px" bg="rgba(0,0,0,.5)" opacity={0.2} mt="4" />
      <Box {...restProps} pos="relative" pt={{base: "15px", lg: "30px"}}>
        {/* <Box overflowY={'auto'} h="100%" w="100%"> */}
        {children}
        {/* </Box> */}
      </Box>
    </Box>
  );
}
