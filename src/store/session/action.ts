import { SessionLastCheckedAction, SESSION_LAST_CHECKED } from './types';

export function sessionLastChecked(): SessionLastCheckedAction {
  return {
    type: SESSION_LAST_CHECKED,
    payload: Date.now(),
  };
}
