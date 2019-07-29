import * as React from 'react';
import * as ReactDom from 'react-dom';

import { Hello } from '../components/Hello';

ReactDom.render(<Hello from="popup.tsx" />, document.getElementById('root'));
