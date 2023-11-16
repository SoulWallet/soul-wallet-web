import { Flex, Grid, GridItem, Image, Text } from '@chakra-ui/react';
import { dappList } from '@/data';
import { Link } from 'react-router-dom';
import IconLink from '@/assets/icons/link.svg';
import IconBookmark from '@/assets/icons/bookmark.svg';
import IconPlus from '@/assets/icons/dapp-plus.svg';
import HomeCard from '@/pages/wallet/comp/HomeCard';

const DappItem = ({ item }: any) => {
  return (
    <GridItem
      as={Link}
      to={`/apps?appUrl=${encodeURIComponent(item.url)}`}
      px="5"
      py="4"
      bg="#fafafa"
      _hover={{ bg: '#ebebeb' }}
      transition={'all .3s'}
      rounded="20px"
      cursor={'pointer'}
      pos={'relative'}
    >
      <Flex gap="10px" pos="absolute" right="4" top="4">
        <Image src={IconLink} />
        <Image src={IconBookmark} />
      </Flex>
      <Image src={item.icon} h="52px" mb="1" />
      <Flex gap="5" align={'center'} mb="1">
        <Text fontWeight={'700'} fontSize={'16px'}>
          {item.title}
        </Text>
        <Text fontSize={'12px'} color="#fff" py="1" px="2" bg="#1c1c1e" rounded={'5px'}>
          {item.category}
        </Text>
      </Flex>
      <Text color="#898989" fontSize={'12px'} lineHeight={'20px'}>
        {item.desc}
      </Text>
    </GridItem>
  );
};

const AddDappItem = () => (
  <GridItem
    border="1px dashed #000"
    _hover={{ bg: '#fafafa' }}
    cursor={'pointer'}
    display={'flex'}
    flexDir={'column'}
    gap="3"
    p="4"
    rounded="20px"
    alignItems={'center'}
    justifyContent={'center'}
  >
    <Image src={IconPlus} />
    <Text fontWeight={'600'}>Pin more Dapps</Text>
  </GridItem>
);

export default function DappList() {
  return (
    <HomeCard title="Apps">
      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(3, 1fr)' }}
        rounded="20px"
        gap={{ base: 3, lg: 6 }}
        fontSize={'14px'}
        lineHeight={'1'}
      >
        {dappList.map((item, index) => (
          <DappItem key={index} item={item} />
        ))}
        {/* <AddDappItem /> */}
      </Grid>
    </HomeCard>
  );
}
