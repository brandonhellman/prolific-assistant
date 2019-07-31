import produce from 'immer';

import { ProlificState, ProlificActionTypes, PROLIFIC_STUDIES_UPDATE } from './types';

const initialState: ProlificState = {
  studies: [],
};

export function prolificReducer(state = initialState, action: ProlificActionTypes) {
  return produce(state, (draftState) => {
    switch (action.type) {
      case PROLIFIC_STUDIES_UPDATE:
        draftState.studies = action.payload;
        break;
    }
  });
}
