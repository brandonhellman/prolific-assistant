import { browser } from 'webextension-polyfill-ts';
import { Middleware } from 'redux';

import { centsToGBP } from '../functions/centsToGBP';
import { playAlertSound } from '../functions/playAlertSound';

import { AppState } from '.';
import { PROLIFIC_STUDIES_UPDATE } from './prolific/types';

const seen: ProlificStudy['id'][] = [];

export const prolificStudiesUpdateMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  if (action.type === PROLIFIC_STUDIES_UPDATE) {
    const state: AppState = store.getState();
    const studies: ProlificStudy[] = action.payload;

    const newStudies = studies.reduce((acc: ProlificStudy[], study) => {
      if (!seen.includes(study.id)) {
        seen.push(study.id);

        if (state.settings.desktop_notifications) {
          browser.notifications.create(study.id, {
            type: 'list',
            title: study.name,
            message: '',
            iconUrl: 'icon.png',
            items: [
              {
                title: 'Hosted By',
                message: study.researcher.name,
              },
              {
                title: 'Reward',
                message: `${centsToGBP(study.reward)} | Avg. ${centsToGBP(study.average_reward_per_hour)}`,
              },
              {
                title: 'Places',
                message: `${study.total_available_places - study.places_taken}`,
              },
            ],
          });
        }

        return [...acc, study];
      }

      return acc;
    }, []);

    if (newStudies.length) {
      playAlertSound(state);
    }
  }

  return result;
};
