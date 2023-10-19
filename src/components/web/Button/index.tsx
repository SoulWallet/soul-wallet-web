import React from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import { Image } from '@chakra-ui/react';
import IconLoading from '@/assets/loading.gif';
import { Box } from '@chakra-ui/react';

// TODO: error & retry
type ButtonType = 'default' | 'primary' | 'disabled' | 'error' | 'reject' | 'link'; // may add 'dash', 'text', 'link', etc. later

interface IProps extends Omit<ButtonProps, 'type'> {
  children: React.ReactNode;
  type?: ButtonType;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  href?: string;
  _styles?: any;
  LeftIcon?: any;
}

export default function RoundButton({
  onClick,
  children,
  loading,
  disabled,
  type = 'default',
  href,
  _styles,
  LeftIcon,
  _hover,
  ...restProps
}: IProps) {
  const doClick = () => {
    if (!loading && !disabled) {
      if (onClick) onClick();
    }
  };

  const moreProps: any = {};

  if (!disabled) {
    moreProps.href = href;
  }
  console.log('disabled', disabled);
  console.log('loading', loading);

  return (
    <Button
      {...moreProps}
      {...restProps}
      onClick={onClick}
      borderRadius="16px"
      height="50px"
      fontSize="20px"
      fontWeight="800"
      _hover={_hover || { background: '#000' }}
      _disabled={{ opacity: '0.7', cursor: 'not-allowed' }}
      isDisabled={disabled}
      bg="brand.black"
      color="white"
      {..._styles}
    >
      {loading && <Image height="20px" width="20px" marginRight="8px" src={IconLoading} />}
      <Box marginRight="4px">{LeftIcon}</Box>
      {children}
    </Button>
  );
}
