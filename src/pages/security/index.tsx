import { useState } from 'react';
import Passkey from './Passkey';
import Guardian from './Guardian';

export default function Security() {
  const [activeSection, setActiveSection] = useState<string>('passkey');

  return (
    <Guardian setActiveSection={setActiveSection} />
  )

  return (
    <>
      {activeSection === 'passkey' && <Passkey setActiveSection={setActiveSection} />}
      {activeSection === 'guardian' && <Guardian setActiveSection={setActiveSection} />}
    </>
  );
}
