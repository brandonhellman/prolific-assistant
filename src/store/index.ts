import { applyMiddleware, createStore, combineReducers, Middleware } from 'redux';
import { createLogger } from 'redux-logger';
import { createMigrate, persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { wrapStore } from 'webext-redux';

import { prolificReducer } from './prolific/reducers';
import { sessionReducer } from './session/reducers';
import { settingsReducer } from './settings/reducers';

const logger = createLogger();

const persistMigrate = {
  2: (state: any) => {
    return {
      ...state,
      settings: {
        ...state.settings,
        desktop_notifications: true,
      },
    };
  },
};

const persistConfig = {
  key: 'settings',
  storage: storage,
  migrate: createMigrate(persistMigrate),
  whitelist: ['settings'],
  version: 2,
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
