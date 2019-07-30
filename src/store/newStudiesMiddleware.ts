import { Middleware } from 'redux';

import { centsToEuro } from '../functions/centsToEuro';
import { AppState } from '../store';
import { PROLIFIC_STUDIES_UPDATE } from '../store/prolific/types';

const seen: ProlificStudy['id'][] = [];

export const newStudiesMiddleware: Middleware = (store) => (next) => (action) => {
  if (action.type === PROLIFIC_STUDIES_UPDATE) {
    const state: AppState = store.getState();
    const studies: ProlificStudy[] = action.payload;

    const newStudies = studies.reduce((acc: ProlificStudy[], study) => {
      if (!seen.includes(study.id)) {
        seen.push(study.id);

        chrome.notifications.create(study.id, {
          type: 'list',
          title: study.name,
          message: '',
          iconUrl: 'assets/icon.png',
          items: [
            {
              title: 'Hosted By',
              message: study.researcher.name,
            },
            {
              title: 'Reward',
              message: `${centsToEuro(study.reward)} | Avg. ${centsToEuro(study.average_reward_per_hour)}`,
            },
            {
              title: 'Places',
              message: `${study.total_available_places - study.places_taken}`,
            },
          ],
          buttons: [{ title: 'Open' }],
        });

        return [...acc, study];
      }

      return acc;
    }, []);

    if (newStudies.length) {
      switch (state.settings.alert_sound) {
        case 'none':
          break;
        case 'sweet-alert-1':
        case 'sweet-alert-2':
        case 'sweet-alert-3':
        case 'sweet-alert-4':
        case 'sweet-alert-5':
          const audio = new Audio(`/assets/audio/${state.settings.alert_sound}.wav`);
          audio.play();
          break;
        case 'voice':
          chrome.tts.speak('New studies available on Prolific.', {
            enqueue: true,
            voiceName: 'Google US English',
          });
          break;
      }
    }
  }

  return next(action);
};
