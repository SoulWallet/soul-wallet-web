import React, { useState } from 'react';
import { Button as CButton, ButtonProps, Image, useToast } from '@chakra-ui/react';
import IconLoading from '@/assets/loading.gif';
import useConfig from '@/hooks/useConfig';

interface IProps extends Omit<ButtonProps, 'type'> {
  children: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  checkCanSign?: boolean;
  href?: string;
}

export default function Button({ onClick, children, loading, disabled, href, checkCanSign, ...restProps }: IProps) {
  const { selectedChainItem } = useConfig();
  // const [canSion, setCanSign] = useState(false);
  const doClick = () => {
    if (!loading && !disabled && canSign && onClick) {
      onClick();
    }
  };

  const moreProps: any = {};

  if (!disabled) {
    moreProps.href = href;
  }

  const canSign = !selectedChainItem.recovering;

  return (
    <CButton
      color="#fff"
      bg="#1c1c1e"
      _hover={!disabled && { bg: '#4e4e54' }}
      h="unset"
      transition={'all 0.2s ease-in-out'}
      _disabled={{ bg: '#898989', cursor: 'not-allowed' }}
      onClick={() => canSign ? doClick() : null}
      rounded={'20px'}
      lineHeight={'1'}
      isDisabled={disabled || !canSign}
      {...moreProps}
      {...restProps}
    >
      {loading && <Image src={IconLoading} w="20px" h="20px"/>}
      {children}
    </CButton>
  );
}
