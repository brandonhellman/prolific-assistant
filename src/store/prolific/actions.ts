import { ProlificStudiesUpdateAction, PROLIFIC_STUDIES_UPDATE } from './types';

export function prolificStudiesUpdate(payload: ProlificStudiesUpdateAction['payload']): ProlificStudiesUpdateAction {
  return {
    type: PROLIFIC_STUDIES_UPDATE,
    payload,
  };
}
