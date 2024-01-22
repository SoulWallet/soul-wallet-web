import { Input as CInput, InputProps } from '@chakra-ui/react';

export default function Input({ ...restProps }: InputProps) {
  return (
    <CInput
      border="1px solid #e4e4e4"
      _hover={{
        border: '1px solid #e4e4e4',
      }}
      _focusVisible={{
        border: '1px solid #e4e4e4',
      }}
      {...restProps}
    />
  );
}
