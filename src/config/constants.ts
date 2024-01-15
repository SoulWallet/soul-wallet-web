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
  },
  {
    title: 'Assets',
    href: "/assets",
    icon: IconAssets,
    iconActive: IconAssetsActive,
  },
  {
    title: 'Activity',
    href: "/activity",
    icon: IconActivity,
    iconActive: IconActivityActive,
  },
  {
    title: 'Dapps',
    href: "/dapps",
    icon: IconDapps,
    iconActive: IconDappsActive,
  },
  {
    title: 'Settings',
    href: "/settings",
    icon: IconSettings,
    iconActive: IconSettingsActive,
  },
];