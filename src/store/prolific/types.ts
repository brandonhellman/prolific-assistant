export interface ProlificState {
  error: number;
  studies: ProlificStudy[];
}

export const PROLIFIC_ERROR_UPDATE = 'PROLIFIC_ERROR_UPDATE';
export const PROLIFIC_STUDIES_UPDATE = 'PROLIFIC_STUDIES_UPDATE';

export interface ProlificErrorUpdateAction {
  type: typeof PROLIFIC_ERROR_UPDATE;
  payload: number;
}

export interface ProlificStudiesUpdateAction {
  type: typeof PROLIFIC_STUDIES_UPDATE;
  payload: ProlificStudy[];
}

export type ProlificActionTypes = ProlificErrorUpdateAction | ProlificStudiesUpdateAction;
