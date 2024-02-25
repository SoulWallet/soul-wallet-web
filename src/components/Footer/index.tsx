import { Flex, FlexProps, Image, Link, Text } from '@chakra-ui/react';
import packageJson from '../../../package.json';
import config from '@/config';

export default function Footer({ ...restProps }: FlexProps) {
  return (
    <Flex flexDir={'column'} gap="2" fontSize={'12px'} fontWeight={'400'} {...restProps}>
      <Text color={'rgba(0,0,0,.5)'} whiteSpace={'nowrap'}>
        Version: Alpha {packageJson.version}
      </Text>
      <Flex gap="3" align={'center'}>
        {config.socials.map((item, idx) => (
          <Link
            href={item.link}
            target="_blank"
            key={idx}
            _hover={{
              '> .icon': {
                display: 'none',
              },
              '> .icon-activated': {
                display: 'block',
              },
            }}
          >
            <Image w="5" h="5" src={item.icon} className="icon" />
            <Image w="5" h="5" src={item.iconActivated} display={'none'} className="icon-activated" />
          </Link>
        ))}
      </Flex>
    </Flex>
  );
}
