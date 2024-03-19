import IconDashboard from '@/assets/icons/sidebar/dashboard.svg';
import IconDashboardActive from '@/assets/icons/sidebar/dashboard-active.svg';
import IconAssets from '@/assets/icons/sidebar/assets.svg';
import IconAssetsActive from '@/assets/icons/sidebar/assets-active.svg';
import IconActivity from '@/assets/icons/sidebar/activity.svg';
import IconActivityActive from '@/assets/icons/sidebar/activity-active.svg';
import IconDapps from '@/assets/icons/sidebar/dapps.svg';
import IconDappsActive from '@/assets/icons/sidebar/dapps-active.svg';
import IconSettings from '@/assets/icons/sidebar/settings.svg';
import IconSettingsActive from '@/assets/icons/sidebar/settings-active.svg';

export const sidebarLinks = [
  {
    title: 'Dashboard',
    href: "/dashboard",
    icon: IconDashboard,
    iconActive: IconDashboardActive,
    isComing: false,
  },
  {
    title: 'Assets',
    href: "/asset",
    icon: IconAssets,
    iconActive: IconAssetsActive,
    isComing: false,
  },
  {
    title: 'Activity',
    href: "/activity",
    icon: IconActivity,
    iconActive: IconActivityActive,
    isComing: false,
  },
  {
    title: 'Dapps',
    href: "/dapps",
    icon: IconDapps,
    iconActive: IconDappsActive,
    isComing: true,
  },
  {
    title: 'Settings',
    href: "/security",
    icon: IconSettings,
    iconActive: IconSettingsActive,
    isComing: false,
  },
];


export const passkeyTooltipText = "A passkey is a FIDO credential stored on your computer or phone, and it is used to unlock your online accounts. The passkey makes signing in more secure."

export const sponsorMockSignature = '0xaf2a5bcc4c10b5289946daaa87caa467f3abadcc0000006201000065f2af9f000065f2bdaf0000000000000000000000000000000000000000a1da5b66f8c211583e706136bee9ab6f1ff43878b885620a8a16b0af5d52cf2c29ffdaf22944306a12f06fdcc41f11ff0f964160ce1f35140d039000301c345d1b'

export const mockPaymasterData = '0x0000000000000000000000000000000000000000000000000000000065f7e81e0000000000000000000000000000000000000000000000000000000000000000c8c1e4b029a76fc92119914dd1d9e6cf3a610b53c9913b1448ddfffb8c2af7cd18ad1ae71e18f98c9baf33a8468aca9cc4d9b0e92803b8cb7e22bd596d406b811c'