import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import 'bootstrap/dist/css/bootstrap.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Tab from 'react-bootstrap/Tab';

import { selectSettings } from '../store/settings/selectors';
import { selectProlificStudies } from '../store/prolific/selectors';

export function App() {
  const settings = useSelector(selectSettings);
  const studies = useSelector(selectProlificStudies);
  const [key, setKey] = useState('studies');

  function onSelect(k: string) {
    setKey(k);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Tab.Container activeKey={key} onSelect={onSelect}>
        <Navbar bg="primary" variant="dark">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Studies</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="#home">Account</Nav.Link>
          </Nav>
        </Navbar>

        <Tab.Content style={{ flex: 1 }}>
          <Tab.Pane eventKey="studies">
            {studies.length ? (
              studies.map((study) => <div key={study.id}>study.id</div>)
            ) : (
              <div className="text-center">No studies available.</div>
            )}
          </Tab.Pane>
          <Tab.Pane eventKey="settings">settings</Tab.Pane>
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
    </div>
  );
}
