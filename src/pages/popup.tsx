import React from 'react';
import ReactDom from 'react-dom';

import { Hello } from '../components/Hello';

ReactDom.render(<Hello from="popup.tsx" />, document.getElementById('root'));
