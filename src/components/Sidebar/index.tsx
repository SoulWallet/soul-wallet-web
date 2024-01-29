import { Box, Flex, Image, Button, Text, FlexProps, Tooltip } from '@chakra-ui/react';
import { sidebarLinks } from '@/config/constants';
import { Link, useLocation } from 'react-router-dom';
import useWalletContext from '@/context/hooks/useWalletContext';
import IconGuide from '@/assets/icons/guide.svg';
import IconClaim from '@/assets/icons/claim.svg';
import IconFeedback from '@/assets/icons/feedback.svg';
import Footer from '../Footer';
import { guideList } from '@/data';
import { useSettingStore } from '@/store/setting';
import { useState } from 'react';

const ExtraLink = ({ children, ...restProps }: FlexProps) => {
  return (
    <Flex whiteSpace={'nowrap'} align={'center'} pos={'relative'} gap="2" cursor={'pointer'} {...restProps}>
      {children}
    </Flex>
  );
};

export default function Sidebar() {
  const location = useLocation();
  const { finishedSteps } = useSettingStore();
  const { showClaimAssets, showTestGuide, showFeedback } = useWalletContext();
  const [navHoverIndex, setNavHoverIndex] = useState(-1);
  const pathname = location.pathname;

  return (
    <Flex flexDir={'column'} justify={'space-between'} m="6" mr="0">
      <Flex flexDir={'column'} gap="28px">
        {sidebarLinks.map((link, index) => {
          const isActive = link.href === pathname || index === navHoverIndex;
          return (
            <Tooltip label={link.isComing ? 'Coming Soon' : null}>
              <Flex
                onMouseEnter={() => setNavHoverIndex(index)}
                onMouseLeave={() => setNavHoverIndex(-1)}
                {...(link.isComing ? {} : { as: Link, to: link.href, cursor: 'pointer' })}
                gap="2"
                align={'center'}
              >
                <Image w="6" src={isActive ? link.iconActive : link.icon} />
                <Text
                  fontWeight={isActive ? '700' : '600'}
                  color={isActive ? 'brand.purple' : 'brand.black'}
                  fontSize={'16px'}
                  className="title"
                >
                  {link.title}
                </Text>
              </Flex>
            </Tooltip>
          );
        })}
      </Flex>

      <Flex flexDir={'column'} gap="8">
        <Flex flexDir={'column'} gap="6" fontSize={'14px'} color="#383838">
          <ExtraLink onClick={() => showTestGuide()}>
            <Image src={IconGuide} />
            <Text>Test guide</Text>
            <Box
              bg="brand.white"
              py="2px"
              px="8px"
              lineHeight={'1'}
              rounded="100px"
              color="brand.black"
              fontWeight={'600'}
              whiteSpace={'nowrap'}
              fontSize={'12px'}
            >
              {finishedSteps.length}/{guideList.length} Done
            </Box>
          </ExtraLink>
          <ExtraLink onClick={() => showClaimAssets()}>
            <Image src={IconClaim} />
            <Box pos={'relative'}>
              <Text>Claim test tokens</Text>
              <Box bg="#ff2e79" w="6px" h="6px" rounded={'full'} pos="absolute" right={'-8px'} top="2px" />
            </Box>
          </ExtraLink>
          <ExtraLink onClick={() => showFeedback()}>
            <Image src={IconFeedback} />
            <Text>Feedback</Text>
          </ExtraLink>
        </Flex>
        <Footer />
      </Flex>
    </Flex>
  );
}
