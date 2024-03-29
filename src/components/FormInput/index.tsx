import { useState, forwardRef } from 'react';
import { Box, Text, Input, InputRightElement, Image, InputGroup } from '@chakra-ui/react';
import IconEyeOpen from '@/assets/icons/eye-open.svg';
import IconEyeClose from '@/assets/icons/eye-close.svg';

export default forwardRef(
  ({ label, value, isPassword, onChange, placeholder, disabled, autoFocus, onEnter, ...restProps }: any, ref: any) => {
    const [showPassword, setShowPassword] = useState(true);

    const onKeyDown = (e: any) => {
      const { keyCode } = e;
      if (keyCode === 13 && onEnter) {
        onEnter();
      }
    };

    return (
      <Box {...restProps}>
        <Text  fontSize="12px" fontWeight={'500'} mb="1" px="4">
          {label}
        </Text>
        <InputGroup rounded="20px" bg="#fff" py="3" px="4">
          <Input
            ref={ref}
            value={value}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            spellCheck={false}
            onChange={(e) => onChange(e.target.value)}
            variant={'unstyled'}
            _disabled={{ opacity: '1', cursor: 'not-allowed' }}
            fontWeight={'800'}
            autoFocus={autoFocus}
            color="#1e1e1e"
            disabled={disabled}
            _placeholder={{ color: '#898989', fontWeight: '600' }}
            type={isPassword && showPassword ? 'password' : 'text'}
          />
          {isPassword && (
            <InputRightElement display={'flex'} alignItems={'center'} h="full">
              <Image
                src={showPassword ? IconEyeClose : IconEyeOpen}
                w="6"
                h="6"
                mr={2}
                cursor={'pointer'}
                onClick={() => setShowPassword((prev) => !prev)}
              />
            </InputRightElement>
          )}
        </InputGroup>
      </Box>
    );
  },
);
