import React from 'react';
import { Button as CButton, ButtonProps, Image } from '@chakra-ui/react';
import IconLoading from '@/assets/loading.gif';
import useConfig from '@/hooks/useConfig';

const getSizeStyles = (size?: string) => {
  const baseStyles = {}

  if (!size) {
    return baseStyles
  }

  if (size === 'xl') {
    return {
      height: '48px',
      borderRadius: '48px',
      fontSize: '18px',
      fontWeight: '700',
      ...baseStyles,
    };
  } else if (size === 'lg') {
    return {
      height: '40px',
      borderRadius: '40px',
      fontSize: '16px',
      fontWeight: '700',
      ...baseStyles,
    };
  } else if (size === 'mid') {
    return {
      height: '36px',
      borderRadius: '36px',
      fontSize: '14px',
      fontWeight: '700',
      ...baseStyles,
    };
  } else if (size === 'sm') {
    return {
      height: '24px',
      borderRadius: '24px',
      fontSize: '12px',
      fontWeight: '700',
      ...baseStyles,
    };
  } else if (size === 'xs') {
    return {
      height: '18px',
      borderRadius: '18px',
      fontSize: '12px',
      ...baseStyles,
    };
  }
};

const buttonStyles = {
  black: {
    color: '#fff',
    bg: '#000',
    _hover: { bg: '#4E4E53' },
    _disabled:{ bg: '#B2B2B2'},
  },
  white: {
    color: '#000',
    bg: '#fff',
    _hover: { bg: '#eee' },
    _disabled: {color: "#B2B2B2"},
  },
  red:{
    color: "#fff",
    bg: "brand.red",
    _hover:{
      bg:"#FF689E"
    },
    _disabled:{
      bg: "#B2B2B2",
    }
  },
  purple: {
    color: 'brand.purple',
    bg: 'rgba(225, 220, 252, 0.80)',
    _hover: { bg: 'rgba(225, 220, 252, 1)' },
  },
};

interface IProps extends Omit<ButtonProps, 'type'> {
  children: React.ReactNode;
  onClick?: () => void;
  type?: keyof typeof buttonStyles;
  loading?: boolean;
  disabled?: boolean;
  checkCanSign?: boolean;
  href?: string;
  size?: string;
}

export default function Button({
  onClick,
  type,
  children,
  loading,
  disabled,
  href,
  checkCanSign,
  size,
  ...restProps
}: IProps) {
  const { selectedChainItem } = useConfig();
  // const [canSion, setCanSign] = useState(false);
  const styles = buttonStyles[type || 'black'];
  const sizeStyles = getSizeStyles(size)

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
      h="unset"
      transition={'all 0.2s ease-in-out'}
      _disabled={{ bg: '#898989', cursor: 'not-allowed', _hover: { bg: '#898989' } }}
      onClick={() => (canSign ? doClick() : null)}
      rounded={'30px'}
      lineHeight={'1'}
      isDisabled={disabled || !canSign}
      gap="2"
      {...styles}
      {...sizeStyles}
      {...moreProps}
      {...restProps}
    >
      {loading ? <Image src={IconLoading} w="18px" h="18px" /> : children}
      {/* {children} */}
    </CButton>
  );
}
