import { applyMiddleware, createStore, combineReducers, Middleware } from 'redux';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { wrapStore } from 'webext-redux';

import { prolificReducer } from './prolific/reducers';
import { sessionReducer } from './session/reducers';
import { settingsReducer } from './settings/reducers';

const logger = createLogger();

const persistConfig = {
  key: 'settings',
  storage: storage,
  whitelist: ['settings'],
  version: 1,
};

const rootReducer = combineReducers({
  prolific: prolificReducer,
  session: sessionReducer,
  settings: settingsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export type AppState = ReturnType<typeof rootReducer>;

export function configureStore(...middlewares: Middleware[]) {
  const store = createStore(persistedReducer, applyMiddleware(...middlewares, logger));
  persistStore(store);
  wrapStore(store);
  return store;
}
