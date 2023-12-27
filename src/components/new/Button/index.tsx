import React from 'react';
import { Button as CButton, ButtonProps } from '@chakra-ui/react';
import { Image } from '@chakra-ui/react';
import IconLoading from '@/assets/loading.gif';
import BlackIconLoading from '@/assets/loading.svg';
import { Box } from '@chakra-ui/react';

const getStyles = (type: string = 'xl', theme: string = 'dark') => {
  const baseStyles = theme === 'dark' ? {
    background: '#000000',
    color: 'white',
    border: '1px solid #000000',
    boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)'
  } : {
    background: 'white',
    color: 'black',
    border: '1px solid #000000',
    boxShadow: '0px 1px 2px 0px rgba(208, 213, 221, 0.05)'
  }

  if (type === 'xl') {
    return {
      height: '48px',
      borderRadius: '48px',
      fontSize: '18px',
      fontWeight: '700',
      ...baseStyles
    }
  } else if (type === 'lg') {
    return {
      height: '40px',
      borderRadius: '40px',
      fontSize: '16px',
      fontWeight: '700',
      ...baseStyles
    }
  } else if (type === 'mid') {
    return {
      height: '36px',
      borderRadius: '36px',
      fontSize: '14px',
      fontWeight: '700',
      ...baseStyles
    }
  } else if (type === 'sm') {
    return {
      height: '24px',
      borderRadius: '24px',
      fontSize: '12px',
      fontWeight: '700',
      ...baseStyles
    }
  } else if (type === 'xs') {
    return {
      height: '18px',
      borderRadius: '18px',
      fontSize: '12px',
      ...baseStyles
    }
  }
}

export default function Button({
  onClick,
  children,
  loading,
  disabled,
  href,
  type,
  _styles,
  LeftIcon,
  _hover,
  loadingColor,
  ...restProps
}: any) {
  const doClick = () => {
    if (!loading && !disabled) {
      if (onClick) onClick();
    }
  };

  const moreProps: any = {};

  if (!disabled) {
    moreProps.href = href;
  }

  const theme = restProps.theme || 'dark'

  return (
    <CButton
      {...moreProps}
      {...restProps}
      onClick={onClick}
      _hover={_hover || (theme === 'dark' ? { background: 'black' } : { background: 'white' })}
      _disabled={{ opacity: '0.7', cursor: 'not-allowed' }}
      isDisabled={disabled}
      bg="brand.black"
      {...getStyles(type, theme)}
      {..._styles}
    >
      {loading && loadingColor !== 'dark' && <Image height="20px" width="20px" marginRight="8px" src={IconLoading} />}
      {loading && loadingColor === 'dark' && <Image height="20px" width="20px" marginRight="8px" src={BlackIconLoading} />}
      <Box marginRight="4px">{LeftIcon}</Box>
      {children}
    </CButton>
  );
}
