import React, { useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Tab from 'react-bootstrap/Tab';

import { StudiesPane } from '../containers/StudiesPane';
import { SettingsPane } from '../containers/SettingsPane';

export function App() {
  const [key, setKey] = useState('studies');

  function onSelect(k: string) {
    setKey(k);
  }

  return (
    <Tab.Container activeKey={key} onSelect={onSelect}>
      <Navbar bg="primary" variant="dark">
        <Nav className="mr-auto">
          <Nav.Link href="https://app.prolific.co/studies" target="_blank">
            Studies
          </Nav.Link>
          <Nav.Link href="https://app.prolific.co/account" target="_blank">
            Account
          </Nav.Link>
        </Nav>
        <Nav>
          <Nav.Item className="text-light">Last checked: some time</Nav.Item>
        </Nav>
      </Navbar>

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
