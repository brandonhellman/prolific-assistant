import { browser } from 'webextension-polyfill-ts';

import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { selectSessionLastChecked } from '../store/session/selectors';

export function Header() {
  const last_checked = useSelector(selectSessionLastChecked);

  return (
    <Navbar bg="primary" variant="dark">
      <Nav className="mr-auto">
        <Nav.Link href="https://app.prolific.co/studies">Studies</Nav.Link>
        <Nav.Link href="https://app.prolific.co/account">Account</Nav.Link>
      </Nav>
      <Nav>
        <Nav.Item className="text-light">
          <OverlayTrigger placement="left" overlay={<Tooltip id="check-tooltip">Click to check for studies</Tooltip>}>
            <Button onClick={() => browser.runtime.sendMessage('check_for_studies')}>
              Last checked: {last_checked ? moment(last_checked).format('LTS') : 'Never'}
            </Button>
          </OverlayTrigger>
        </Nav.Item>
      </Nav>
    </Navbar>
  );
}
