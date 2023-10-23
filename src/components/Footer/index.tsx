import { Flex, Image, Link, Text } from '@chakra-ui/react';
import packageJson from '../../../package.json';
import config from '@/config';

export default function Footer() {
  return (
    <Flex
      justify={'flex-end'}
      align={'center'}
      mt="16"
      py="6"
      gap="4"
      fontSize={'12px'}
      fontWeight={'300'}
      fontFamily={'Martian'}
    >
      <Text>Beta {packageJson.version}</Text>
      <Flex gap="2" align={'center'}>
        {config.socials.map((item) => (
          <Link href={item.link} target="_blank">
            <Image src={item.icon} />
          </Link>
        ))}
      </Flex>
    </Flex>
  );
}
