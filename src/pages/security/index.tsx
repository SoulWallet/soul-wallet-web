import { Outlet } from 'react-router-dom';
import DashboardLayout from '@/components/Layouts/DashboardLayout';

export default function Security() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
