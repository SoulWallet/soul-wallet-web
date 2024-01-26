import { extendTheme, defineStyleConfig } from '@chakra-ui/react';

const inputTheme = defineStyleConfig({
  baseStyle: {
    field: {
      borderRadius: '12px',
    },
  },
});

const linkTheme = defineStyleConfig({
  baseStyle: {
    _hover: {
      textDecoration: 'none',
    },
    _focusVisible: {
      boxShadow: 'none',
    },
  },
});

const menuTheme = defineStyleConfig({
  baseStyle: {
    list: {
      borderRadius: '16px',
      boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
      overflow: 'hidden',
    },
    divider: {
      my: 1,
      borderColor: '#E6E6E6',
      mx: 3,
    },
  },
});

const modalTheme = defineStyleConfig({
  baseStyle: {
    dialog: {
      borderRadius: '20px',
      bg: 'brand.white',
    },
  },
});

const tooltipTheme = defineStyleConfig({
  baseStyle: {
    py: '3',
    px: '4',
    fontSize: '12px',
    lineHeight: '16px',
    borderRadius: '12px',
    bg: 'brand.black',
    color: 'brand.white',
  },
});

const theme = extendTheme({
  fonts: {
    body: `'Nunito', sans-serif`,
  },
  colors: {
    appBg: '#F7F7F7',
    danger: '#E83D26',
    brand: {
      red: '#FF2E79',
      redDarken: '#d8507f',
      black: '#000',
      white: '#fff',
      green: '#0CB700',
      greenDarken: '#1b3507',
      gray: '#898989',
      purple: '#6A52EF',
    },
  },
  breakpoints: {
    sm: '320px',
    md: '768px',
    lg: '960px',
    xl: '1200px',
  },
  components: {
    Menu: menuTheme,
    Input: inputTheme,
    Modal: modalTheme,
    Link: linkTheme,
    Tooltip: tooltipTheme,
    Switch: {
      baseStyle: {
        thumb: {
          boxShadow:
            '0px 2.612903118133545px 0.8709677457809448px 0px rgba(0, 0, 0, 0.06), 0px 2.612903118133545px 6.967741966247559px 0px rgba(0, 0, 0, 0.15), 0px 0px 0px 0.8709677457809448px rgba(0, 0, 0, 0.04)',
        },
      },
      sizes: {
        lg: {
          track: {
            p: '3px',
          },
        },
      },
    },
  },
});

export default theme;
