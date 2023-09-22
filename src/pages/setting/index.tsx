import { Image } from '@chakra-ui/react';
import IconSupport from '@/assets/icons/support.svg';
import IconChevronRight from '@/assets/icons/chevron-right.svg';
import { Navbar } from '@/components/Navbar';
import config from '@/config';
import { Box, Text, Flex, Link } from '@chakra-ui/react';
import PageTitle from '@/components/PageTitle';
import SettingFooter from './comp/SettingFooter';
import MobileContainer from '@/components/MobileContainer';

const SettingBox = ({ children, ...restProps }: any) => (
  <Flex
    align={'center'}
    bg="#fff"
    _hover={{ bg: '#e8e8e8' }}
    transition={'all 0.2s ease-in-out'}
    cursor={'pointer'}
    fontWeight={'800'}
    justify={'space-between'}
    py="10px"
    px="4"
    rounded="20px"
    {...restProps}
  >
    {children}
  </Flex>
);

const SettingLeft = ({ icon, title }: any) => (
  <Flex gap="1" align={'center'}>
    <Image src={icon} w="28px" h="28px" />
    <Text>{title}</Text>
  </Flex>
);

const SettingMainpage = () => {
  return (
    <Box px="5" pt="6">
      <Navbar backUrl="wallet" />
      <PageTitle mb="6">Plugin settings</PageTitle>
      <Flex gap="2" flexDir={'column'}>
        <SettingBox>
          <SettingLeft icon={IconSupport} title={'Support'} />
          <Image src={IconChevronRight} w="6" h="6" />
        </SettingBox>
      </Flex>
      <Flex justify={'center'} align="center" gap="15px" mt="6" mb="3">
        {config.socials.map((item: any, idx: number) => (
          <a href={item.link} key={idx} target="_blank">
            <Image src={item.icon} h="20px" />
          </a>
        ))}
      </Flex>

      <Flex justify={'center'} align="center" gap="2" fontWeight={'200'} fontSize={'12.5px'}>
        <Link isExternal fontWeight={'200'}>
          Privacy Policy
        </Link>
        <Text>|</Text>
        <Link isExternal fontWeight={'200'}>
          Terms Of Services
        </Link>
      </Flex>
    </Box>
  );
};

export default function Setting() {
  return (
    <MobileContainer>
      <SettingMainpage />
      <SettingFooter />
    </MobileContainer>
  );
}
