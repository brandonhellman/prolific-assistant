import produce from 'immer';

import {
  SettingsState,
  SettingsActionTypes,
  SETTING_ALERT_SOUND,
  SETTING_ALERT_VOLUME,
  SETTING_CHECK_INTERVAL,
} from './types';

const initialState: SettingsState = {
  alert_sound: 'voice',
  alert_volume: 100,
  check_interval: 60,
};

export function settingsReducer(state = initialState, action: SettingsActionTypes) {
  return produce(state, (draftState) => {
    switch (action.type) {
      case SETTING_ALERT_SOUND:
        draftState.alert_sound = action.payload;
        break;
      case SETTING_ALERT_VOLUME:
        draftState.alert_volume = action.payload;
        break;
      case SETTING_CHECK_INTERVAL:
        draftState.check_interval = action.payload;
        break;
    }
  });
}
