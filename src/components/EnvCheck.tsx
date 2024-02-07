/**
 * Check user's current environment
 */

import { useEffect, useState } from 'react';
import { isNativeMethod } from '@/lib/tools';
import { Alert, AlertIcon, AlertProps, AlertTitle, Flex } from '@chakra-ui/react';
import Button from './Button';
import { useSettingStore } from '@/store/setting';

const EnvAlert = ({ children, ...restProps }: AlertProps) => {
  return (
    <Alert
      pos={'absolute'}
      bottom="24px"
      left={'0'}
      right={'0'}
      m="auto"
      w="50%"
      rounded={'full'}
      status="warning"
      justifyContent={'space-between'}
      {...restProps}
    >
      {children}
    </Alert>
  );
};

export default function EnvCheck({ children }: any) {
  const { ignoreWebauthnOverride, setIgnoreWebauthnOverride } = useSettingStore();
  const [isWebauthnNative, setIsWebauthnNative] = useState(true);
  const [isFirefox, setIsFirefox] = useState(false);
  const checkNativeMethod = async () => {
    setIsWebauthnNative(isNativeMethod(window.navigator.credentials.create));
  };

  const checkIsFirefox = () => {
    setIsFirefox(navigator.userAgent.indexOf('Firefox') !== -1);
  };

  useEffect(() => {
    checkNativeMethod();
    checkIsFirefox();
  }, []);

  return (
    <>
      {!isWebauthnNative && !ignoreWebauthnOverride && (
        <EnvAlert status="warning" justifyContent={'space-between'}>
          <Flex>
            <AlertIcon />
            <AlertTitle>Your passkey has been overridden by plugins.</AlertTitle>
          </Flex>
          <Button
            py="2"
            onClick={() => {
              setIgnoreWebauthnOverride(true);
            }}
          >
            I understand the risk
          </Button>
        </EnvAlert>
      )}
      {isFirefox && (
        <EnvAlert status="warning" justifyContent={'space-between'}>
          <Flex>
            <AlertIcon />
            <AlertTitle>Your are using firefox which is not supported yet.</AlertTitle>
          </Flex>
        </EnvAlert>
      )}
      {children}
    </>
  );
}
