import { AppState } from '..';

export function selectSession(state: AppState) {
  return state.session;
}

export function selectSessionLastChecked(state: AppState) {
  return selectSession(state).last_checked;
}
