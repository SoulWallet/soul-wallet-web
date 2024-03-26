import IconInputLoading from '@/assets/input-loading.svg';
import { Image } from '@chakra-ui/react';

export default function InputLoading() {
  return <Image src={IconInputLoading} w="24px" h="24px" animation={'spin 1s ease infinite'} />;
}
