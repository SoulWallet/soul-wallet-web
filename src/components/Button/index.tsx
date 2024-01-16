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
};

interface IProps extends Omit<ButtonProps, 'type'> {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'black' | 'white';
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
      _disabled={{ bg: '#898989', cursor: 'not-allowed' }}
      onClick={() => (canSign ? doClick() : null)}
      rounded={'30px'}
      lineHeight={'1'}
      isDisabled={disabled || !canSign}
      {...styles}
      {...moreProps}
      {...restProps}
    >
      {loading && <Image src={IconLoading} w="20px" h="20px" />}
      {children}
    </CButton>
  );
}
