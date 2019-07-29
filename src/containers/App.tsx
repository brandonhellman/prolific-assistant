import React from 'react';
import { useSelector } from 'react-redux';

import { selectSettings } from '../store/settings/selectors';

export function App() {
  const settings = useSelector(selectSettings);
  console.log(settings);
  return <div>App</div>;
}
