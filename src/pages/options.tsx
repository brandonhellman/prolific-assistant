import React from 'react';
import ReactDom from 'react-dom';

import { Hello } from '../components/Hello';

ReactDom.render(<Hello from="options.tsx" />, document.getElementById('root'));
