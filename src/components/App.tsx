import React, { useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';

import { Header } from '../containers/Header';
import { StudiesPane } from '../containers/StudiesPane';
import { SettingsPane } from '../containers/SettingsPane';

export function App() {
  const [key, setKey] = useState('studies');

  function onSelect(k: string) {
    setKey(k);
  }

  return (
    <Tab.Container activeKey={key} onSelect={onSelect}>
      <Header />

      <Tab.Content style={{ flex: 1 }}>
        <StudiesPane />
        <SettingsPane />
      </Tab.Content>

      <Nav className="w-100" style={{ bottom: 0 }} variant="pills">
        <Nav.Item className="text-center w-50">
          <Nav.Link eventKey="studies">Studies</Nav.Link>
        </Nav.Item>
        <Nav.Item className="text-center w-50">
          <Nav.Link eventKey="settings">Settings</Nav.Link>
        </Nav.Item>
      </Nav>
    </Tab.Container>
  );
}
