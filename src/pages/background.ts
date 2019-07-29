import { wrapStore } from 'webext-redux';

import configureStore from '../store';

const store = configureStore();

wrapStore(store);
