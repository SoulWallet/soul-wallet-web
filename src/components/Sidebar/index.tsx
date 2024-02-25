import { Box, Flex, Image, Button, Text, FlexProps, Tooltip } from '@chakra-ui/react';
import { sidebarLinks } from '@/config/constants';
import { Link, useLocation } from 'react-router-dom';
import useWalletContext from '@/context/hooks/useWalletContext';
import IconGuide from '@/assets/icons/guide.svg';
import IconGuideActive from '@/assets/icons/guide-active.svg';
import IconClaim from '@/assets/icons/claim.svg';
import IconClaimActive from '@/assets/icons/claim-active.svg';
import IconFeedback from '@/assets/icons/feedback.svg';
import IconFeedbackActive from '@/assets/icons/feedback-active.svg';
import Footer from '../Footer';
import { guideList } from '@/data';
import { useSettingStore } from '@/store/setting';
import { useState } from 'react';
import useTools from '@/hooks/useTools';

const ExtraLink = ({ children, ...restProps }: FlexProps) => {
  return (
    <Flex
      whiteSpace={'nowrap'}
      _hover={{ color: '#7F56D9' }}
      align={'center'}
      pos={'relative'}
      gap={{ base: 1, lg: 2 }}
      cursor={'pointer'}
      {...restProps}
    >
      {children}
    </Flex>
  );
};

export default function Sidebar() {
  const location = useLocation();
  const { finishedSteps } = useSettingStore();
  const { showClaimAssets, showTestGuide, showFeedback } = useWalletContext();
  const [navHoverIndex, setNavHoverIndex] = useState(-1);
  const [externalHoverIndex, setExternalHoverIndex] = useState(-1);
  const { checkInitialized } = useTools();
  const pathname = location.pathname;

  return (
    <Flex
      bg={{ base: '#fff', lg: 'unset' }}
      gap={{ base: 3, md: 4, lg: 0 }}
      p={{ base: '4', lg: '0' }}
      flexDir={'column'}
      justify={'space-between'}
      m={{ base: 0, lg: 6 }}
      mr="0"
    >
      <Flex flexDir={{ base: 'row', lg: 'column' }} gap={{ base: 2, md: 4, lg: '28px' }} flexWrap={'wrap'}>
        {sidebarLinks.map((link, index) => {
          const isActive = link.href === pathname || pathname.indexOf(link.href) !== -1 || index === navHoverIndex;
          return (
            <Tooltip label={link.isComing ? 'Coming Soon' : null} key={index}>
              <Flex
                onMouseEnter={() => setNavHoverIndex(index)}
                onMouseLeave={() => setNavHoverIndex(-1)}
                {...(link.isComing || !checkInitialized() ? {} : { as: Link, to: link.href, cursor: 'pointer' })}
                {...(checkInitialized() ? {} : { onClick: () => checkInitialized(true) })}
                gap={{ base: 1, lg: 2 }}
                align={'center'}
              >
                <Image
                  w={{ base: 3, md: 4, lg: 6 }}
                  h={{ base: 3, md: 4, lg: 6 }}
                  src={isActive ? link.iconActive : link.icon}
                />
                <Text
                  fontWeight={'600'}
                  color={isActive ? 'brand.purple' : 'brand.black'}
                  fontSize={{ base: '12px', md: '14px', lg: '16px' }}
                  className="title"
                >
                  {link.title}
                </Text>
              </Flex>
            </Tooltip>
          );
        })}
      </Flex>
      <Flex flexDir={{ base: 'row', lg: 'column' }} gap="8">
        <Flex
          flexDir={{ base: 'row', lg: 'column' }}
          gap={{ base: 2, md: 4, lg: 6 }}
          fontSize={{ base: '12px', md: '14px' }}
          fontWeight={{ base: 600, lg: 400 }}
          color="#383838"
        >
          <ExtraLink
            onMouseEnter={() => setExternalHoverIndex(0)}
            onMouseLeave={() => setExternalHoverIndex(-1)}
            onClick={() => (checkInitialized(true) ? showTestGuide() : null)}
          >
            <Image
              w={{ base: 3, md: 4, lg: 6 }}
              h={{ base: 3, md: 4, lg: 6 }}
              src={externalHoverIndex === 0 ? IconGuideActive : IconGuide}
            />
            <Text>Test guide</Text>
            <Box
              bg="brand.white"
              display={{ base: 'none', lg: 'block' }}
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
          <ExtraLink
            onMouseEnter={() => setExternalHoverIndex(1)}
            onMouseLeave={() => setExternalHoverIndex(-1)}
            onClick={() => (checkInitialized(true) ? showClaimAssets() : null)}
          >
            <Image
              w={{ base: 3, md: 4, lg: 6 }}
              h={{ base: 3, md: 4, lg: 6 }}
              src={externalHoverIndex === 1 ? IconClaimActive : IconClaim}
            />
            <Box pos={'relative'}>
              <Text>Claim test tokens</Text>
              <Box
                display={{ base: 'none', lg: 'block' }}
                bg="#ff2e79"
                w="6px"
                h="6px"
                rounded={'full'}
                pos="absolute"
                right={'-8px'}
                top="2px"
              />
            </Box>
          </ExtraLink>
          <ExtraLink
            onMouseEnter={() => setExternalHoverIndex(2)}
            onMouseLeave={() => setExternalHoverIndex(-1)}
            onClick={() => showFeedback()}
          >
            <Image
              h={{ base: 3, md: 4, lg: 6 }}
              w={{ base: 3, md: 4, lg: 6 }}
              src={externalHoverIndex === 2 ? IconFeedbackActive : IconFeedback}
            />
            <Text>Feedback</Text>
          </ExtraLink>
        </Flex>
        <Footer display={{ base: 'none', lg: 'flex' }} />
      </Flex>
    </Flex>
  );
}
