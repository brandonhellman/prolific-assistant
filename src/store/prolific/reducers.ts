import produce from 'immer';

import { ProlificState, ProlificActionTypes, PROLIFIC_ERROR_UPDATE, PROLIFIC_STUDIES_UPDATE } from './types';

const initialState: ProlificState = {
  error: undefined,
  studies: [],
};

export function prolificReducer(state = initialState, action: ProlificActionTypes) {
  return produce(state, (draftState) => {
    switch (action.type) {
      case PROLIFIC_ERROR_UPDATE:
        draftState.error = action.payload;
        draftState.studies = [];
        break;
      case PROLIFIC_STUDIES_UPDATE:
        draftState.error = undefined;
        draftState.studies = action.payload;
        break;
    }
  });
}
