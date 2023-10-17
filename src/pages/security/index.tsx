import React, { useState } from 'react';
import Passkey from './Passkey';
import Guardian from './Guardian';

export default function Security() {
  const [activeSection, setActiveSection] = useState<string>('passkey');

  if (activeSection === 'passkey') {
    return (<Passkey setActiveSection={setActiveSection} />)
  } else if (activeSection === 'guardian') {
    return (<Guardian setActiveSection={setActiveSection} />)
  }
}
