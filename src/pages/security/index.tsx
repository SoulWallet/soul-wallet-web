import { useState } from 'react';
import Passkey from './Passkey';
import Guardian from './Guardian';
import DashboardLayout from '@/components/Layouts/DashboardLayout';

export default function Security() {
  const [activeSection, setActiveSection] = useState<string>('guardian');
  return (
    <DashboardLayout>
      {activeSection === 'guardian' && <Guardian setActiveSection={setActiveSection} />}
      {activeSection === 'passkey' && <Passkey setActiveSection={setActiveSection} />}
    </DashboardLayout>
  );
}
