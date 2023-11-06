/**
 * Check user's current environment
 */

import { useEffect } from 'react';
import { getNativeCredentialCreateMethod } from '@/lib/tools';



export default function EnvCheck({ children }: any) {
  // useNativeMethod('navigator.credentials.create')
  // useNativeMethod('alert')
  const checkNativeMethod = async () => {
    const nativeCredentialCreateMethod = getNativeCredentialCreateMethod();
    console.log('credentialCreate', nativeCredentialCreateMethod.toString(), window.navigator.credentials.create);
    console.log('is equal', nativeCredentialCreateMethod === window.navigator.credentials.create);
  };

  Function.prototype.toString = () => {
    return 'function() { /* [native code] */ }'
  }

  useEffect(() => {
    checkNativeMethod();

    console.log('111', checkNativeMethod.toString())

    // Array.prototype.push.toString = ()=>{
    //   return 'good job'
    // }
  }, []);

  return children;
}
