import React from 'react';
import { useSelector } from 'react-redux';
import Tab from 'react-bootstrap/Tab';

import { selectSettings } from '../store/settings/selectors';

export function SettingsPane() {
  const settings = useSelector(selectSettings);

  return <Tab.Pane eventKey="settings">settings</Tab.Pane>;
}
