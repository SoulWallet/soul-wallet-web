import { useState } from 'react';
import Passkey from './Passkey';
import Guardian from './Guardian';

export default function Security() {
  const [activeSection, setActiveSection] = useState<string>('guardian');

  return (
    <>
      {activeSection === 'guardian' && <Guardian setActiveSection={setActiveSection} />}
      {activeSection === 'passkey' && <Passkey setActiveSection={setActiveSection} />}
    </>
  );
}
