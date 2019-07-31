import { AppState } from '..';

export function selectProlific(state: AppState) {
  return state.prolific;
}

export function selectProlificStudies(state: AppState) {
  return selectProlific(state).studies;
}
