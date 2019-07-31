import { Middleware } from 'redux';

import { playAlertSound } from '../functions/playAlertSound';

import { AppState } from '.';
import { SETTING_ALERT_SOUND } from './settings/types';

export const settingsAlertSoundMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  if (action.type === SETTING_ALERT_SOUND) {
    const state: AppState = store.getState();
    playAlertSound(state);
  }

  return result;
};
