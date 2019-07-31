export interface SessionState {
  last_checked: number;
}

export const SESSION_LAST_CHECKED = 'SESSION_LAST_CHECKED';

export interface SessionLastCheckedAction {
  type: typeof SESSION_LAST_CHECKED;
  payload: SessionState['last_checked'];
}

export type SessionActionTypes = SessionLastCheckedAction;
