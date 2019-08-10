import { AppState } from '../store';

import sweetAlert1 from '../audio/sweet-alert-1.wav';
import sweetAlert2 from '../audio/sweet-alert-2.wav';
import sweetAlert3 from '../audio/sweet-alert-3.wav';
import sweetAlert4 from '../audio/sweet-alert-4.wav';
import sweetAlert5 from '../audio/sweet-alert-5.wav';

function playFile(file: any, volume: number) {
  const audio = new Audio(file);
  audio.volume = volume / 100;
  audio.play();
}

export function playAlertSound(state: AppState) {
  switch (state.settings.alert_sound) {
    case 'none':
      break;
    case 'sweet-alert-1':
      playFile(sweetAlert1, state.settings.alert_volume);
      break;
    case 'sweet-alert-2':
      playFile(sweetAlert2, state.settings.alert_volume);
      break;
    case 'sweet-alert-3':
      playFile(sweetAlert3, state.settings.alert_volume);
      break;
    case 'sweet-alert-4':
      playFile(sweetAlert4, state.settings.alert_volume);
      break;
    case 'sweet-alert-5':
      playFile(sweetAlert5, state.settings.alert_volume);
      break;
    case 'voice':
      const speech = new SpeechSynthesisUtterance('New studies available on Prolific.');
      speech.volume = state.settings.alert_volume / 100;
      speechSynthesis.speak(speech);
      break;
  }
}
