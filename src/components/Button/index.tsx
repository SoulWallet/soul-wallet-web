import React from 'react';
import { Button as CButton, ButtonProps, Image } from '@chakra-ui/react';
import IconLoading from '@/assets/loading.gif';
import useConfig from '@/hooks/useConfig';

const buttonStyles = {
  black: {
    color: '#fff',
    bg: '#1c1c1e',
    _hover: { bg: '#4e4e54' },
  },
  white: {
    color: '#000',
    bg: '#fff',
    border: '1px solid #E0E0E0',
    _hover: { bg: '#f8f8f8' },
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
}

export default function Button({
  onClick,
  type,
  children,
  loading,
  disabled,
  href,
  checkCanSign,
  ...restProps
}: IProps) {
  const { selectedChainItem } = useConfig();
  // const [canSion, setCanSign] = useState(false);
  const styles = buttonStyles[type || 'black'];

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
      {...moreProps}
      {...restProps}
    >
      {loading ? <Image src={IconLoading} w="18px" h="18px" /> : children}
      {/* {children} */}
    </CButton>
  );
}
