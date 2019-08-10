import {
  ProlificErrorUpdateAction,
  ProlificStudiesUpdateAction,
  PROLIFIC_ERROR_UPDATE,
  PROLIFIC_STUDIES_UPDATE,
} from './types';

export function prolificErrorUpdate(payload: ProlificErrorUpdateAction['payload']): ProlificErrorUpdateAction {
  return {
    type: PROLIFIC_ERROR_UPDATE,
    payload,
  };
}

export function prolificStudiesUpdate(payload: ProlificStudiesUpdateAction['payload']): ProlificStudiesUpdateAction {
  return {
    type: PROLIFIC_STUDIES_UPDATE,
    payload,
  };
}
