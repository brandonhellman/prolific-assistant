export interface ProlificState {
  studies: ProlificStudy[];
}

export const PROLIFIC_STUDIES_UPDATE = 'PROLIFIC_STUDIES_UPDATE';

export interface ProlificStudiesUpdateAction {
  type: typeof PROLIFIC_STUDIES_UPDATE;
  payload: ProlificStudy[];
}

export type ProlificActionTypes = ProlificStudiesUpdateAction;
