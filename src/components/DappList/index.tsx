import { Box, Flex, Grid, GridItem, Image, Text } from '@chakra-ui/react';
import { dappList } from '@/data';
import IconLink from '@/assets/icons/link.svg';
import IconBookmark from '@/assets/icons/bookmark.svg';
import IconPlus from '@/assets/icons/dapp-plus.svg';
const tabs = ['My Dapps', 'Explore more', 'Wallet connect'];

const DappItem = ({ item }: any) => {
  return (
    <GridItem
      px="5"
      py="4"
      bg="#fff"
      _hover={{ bg: '#fafafa' }}
      transition={'all .3s'}
      rounded="20px"
      cursor={'pointer'}
      pos={'relative'}
    >
      <Flex gap="10px" pos="absolute" right="4" top="4">
        <Image src={IconLink} />
        <Image src={IconBookmark} />
      </Flex>
      <Image src={item.icon} w="56px" mb="1" />
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
    rounded="20px"
    alignItems={'center'}
    justifyContent={'center'}
  >
    <Image src={IconPlus} />
  </GridItem>
);

export default function DappList() {
  return (
    <Box my="12">
      <Flex mb="6px" gap="4">
        {tabs.map((item, index) => (
          <Text key={index} fontSize={'18px'} fontWeight={'800'} color={index ? '#898989' : 'none'}>
            {item}
          </Text>
        ))}
      </Flex>
      <Grid
        bg="rgba(217, 217, 217, 0.32)"
        templateColumns={'repeat(4, 1fr)'}
        rounded="20px"
        p="6"
        gap="6"
        fontSize={'14px'}
        lineHeight={'1'}
      >
        {dappList.map((item, index) => (
          <DappItem key={index} item={item} />
        ))}
        <AddDappItem />
      </Grid>
    </Box>
  );
}
