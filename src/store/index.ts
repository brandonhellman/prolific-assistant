import { createStore, combineReducers } from 'redux';

import { prolificReducer } from './prolific/reducers';
import { settingsReducer } from './settings/reducers';

const rootReducer = combineReducers({
  prolific: prolificReducer,
  settings: settingsReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default function configureStore() {
  const store = createStore(rootReducer);
  return store;
}
