import { Flex, Grid, GridItem, Image, Text, Box } from '@chakra-ui/react';
import { dappList } from '@/data';
import { Link } from 'react-router-dom';
// import IconLink from '@/assets/icons/link.svg';
// import IconBookmark from '@/assets/icons/bookmark.svg';
// import IconPlus from '@/assets/icons/dapp-plus.svg';
import { ExternalLink } from '@/pages/dashboard/comp/HomeCard';
import HomeCard from '@/pages/dashboard/comp/HomeCard';

const DappItem = ({ item }: any) => {
  return (
    <GridItem
      as={Link}
      to={item.isExternal ? item.url : `/apps?appUrl=${encodeURIComponent(item.url)}`}
      target={item.isExternal ? '_blank' : '_self'}
      _hover={{ bg: 'rgba(0, 0, 0, 0.05)' }}
      transition={'all .3s'}
      rounded="12px"
      cursor={'pointer'}
      pos={'relative'}
      display={'flex'}
      gap="3"
      p="2"
      alignItems={'center'}
    >
      {/* <Flex gap="10px" pos="absolute" right="4" top="4">
        <Image src={IconLink} />
        <Image src={IconBookmark} />
      </Flex> */}
      <Image src={item.icon} h="60px" />
      <Box>
        <Text fontWeight={'700'} fontSize={'18px'} mb="2">
          {item.title}
        </Text>
        <Text fontWeight={'500'} fontSize={'12px'} lineHeight={'16px'}>
          {item.desc}
        </Text>
      </Box>
    </GridItem>
  );
};

// const AddDappItem = () => (
//   <GridItem
//     border="1px dashed #000"
//     _hover={{ bg: '#fafafa' }}
//     cursor={'pointer'}
//     display={'flex'}
//     flexDir={'column'}
//     gap="3"
//     p="4"
//     rounded="20px"
//     alignItems={'center'}
//     justifyContent={'center'}
//   >
//     <Image src={IconPlus} />
//     <Text fontWeight={'600'}>Pin more Dapps</Text>
//   </GridItem>
// );

export default function DappList() {
  return (
    <HomeCard
      h="210px"
      wrapperZIndex="50"
      title="Featured Dapps"
      external={<ExternalLink title="View more" to="/dapps" />}
    >
      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' }}
        rowGap={'24px'}
        columnGap={'64px'}
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
