import { AppState } from '..';

export function selectSettings(state: AppState) {
  return state.settings;
}
