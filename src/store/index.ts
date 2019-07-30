import { applyMiddleware, createStore, combineReducers, Middleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { wrapStore } from 'webext-redux';

import { prolificReducer } from './prolific/reducers';
import { settingsReducer } from './settings/reducers';

const persistConfig = {
  key: 'settings',
  storage: storage,
  whitelist: ['settings'],
  version: 1,
};

const rootReducer = combineReducers({
  prolific: prolificReducer,
  settings: settingsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export type AppState = ReturnType<typeof rootReducer>;

export default function configureStore(...middlewares: Middleware[]) {
  const store = createStore(persistedReducer, applyMiddleware(...middlewares));
  persistStore(store);
  wrapStore(store);
  return store;
}
