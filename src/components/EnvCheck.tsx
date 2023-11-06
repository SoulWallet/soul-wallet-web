/**
 * Check user's current environment
 */

import { useEffect, useState } from 'react';
import { isNativeMethod } from '@/lib/tools';
import { Alert, AlertIcon, AlertTitle, Flex } from '@chakra-ui/react';
import Button from './Button';
import { useSettingStore } from '@/store/setting';

export default function EnvCheck({ children }: any) {
  const { ignoreWebauthnOverride, setIgnoreWebauthnOverride } = useSettingStore();
  const [isWebauthnNative, setIsWebauthnNative] = useState(true);
  const checkNativeMethod = async () => {
    setIsWebauthnNative(isNativeMethod(window.navigator.credentials.create));
  };

  useEffect(() => {
    checkNativeMethod();
  }, []);

  return (
    <>
      {!isWebauthnNative && !ignoreWebauthnOverride && (
        <Alert status="warning" justifyContent={'space-between'}>
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
        </Alert>
      )}
      {children}
    </>
  );
}
