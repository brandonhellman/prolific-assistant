import { applyMiddleware, createStore, combineReducers, Middleware } from 'redux';

import { prolificReducer } from './prolific/reducers';
import { settingsReducer } from './settings/reducers';

const rootReducer = combineReducers({
  prolific: prolificReducer,
  settings: settingsReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default function configureStore(...middlewares: Middleware[]) {
  const store = createStore(rootReducer, applyMiddleware(...middlewares));
  return store;
}
