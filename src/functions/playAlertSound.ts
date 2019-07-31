import { AppState } from '../store';

export function playAlertSound(state: AppState) {
  switch (state.settings.alert_sound) {
    case 'none':
      break;
    case 'sweet-alert-1':
    case 'sweet-alert-2':
    case 'sweet-alert-3':
    case 'sweet-alert-4':
    case 'sweet-alert-5':
      const audio = new Audio(`/assets/audio/${state.settings.alert_sound}.wav`);
      audio.volume = state.settings.alert_volume / 100;
      audio.play();
      break;
    case 'voice':
      chrome.tts.speak('New studies available on Prolific.', {
        enqueue: true,
        voiceName: 'Google US English',
        volume: state.settings.alert_volume / 100,
      });
      break;
  }
}
