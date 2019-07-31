import produce from 'immer';

import { SessionState, SessionActionTypes, SESSION_LAST_CHECKED } from './types';

const initialState: SessionState = {
  last_checked: 0,
};

export function sessionReducer(state = initialState, action: SessionActionTypes) {
  return produce(state, (draftState) => {
    switch (action.type) {
      case SESSION_LAST_CHECKED:
        draftState.last_checked = action.payload;
        break;
    }
  });
}
