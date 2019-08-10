import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

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
          Last checked: {last_checked ? moment(last_checked).format('LTS') : 'Never'}
        </Nav.Item>
      </Nav>
    </Navbar>
  );
}
