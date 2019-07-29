import { createStore, combineReducers } from 'redux';

import { settingsReducer } from './settings/reducers';

const rootReducer = combineReducers({
  settings: settingsReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default function configureStore() {
  const store = createStore(rootReducer);
  return store;
}
