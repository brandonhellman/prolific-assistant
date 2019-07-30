import { fetchProlificStudies } from '../functions/fetchProlificStudies';
import { configureStore } from '../store';
import { newStudiesMiddleware } from '../store/newStudiesMiddleware';
import { prolificStudiesUpdate } from '../store/prolific/actions';

const store = configureStore(newStudiesMiddleware);

let headers: chrome.webRequest.HttpHeader[];
let timeout = setTimeout(main);

async function main() {
  clearTimeout(timeout);
  const state = store.getState();

  try {
    const studies = await fetchProlificStudies();
    store.dispatch(prolificStudiesUpdate(studies));
    chrome.browserAction.setBadgeText({ text: studies.length ? studies.length.toString() : '' });
    chrome.browserAction.setBadgeBackgroundColor({ color: 'red' });
  } catch (error) {
    store.dispatch(prolificStudiesUpdate([]));
    chrome.browserAction.setBadgeText({ text: '!' });
    chrome.browserAction.setBadgeBackgroundColor({ color: 'black' });
    window.console.error(error);
  }

  timeout = setTimeout(main, state.settings.check_interval * 1000);
}

chrome.notifications.onButtonClicked.addListener((notificationId) => {
  window.open(`https://app.prolific.co/studies/${notificationId}`);
  chrome.notifications.clear(notificationId);
});

chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    const hasAuthHeader = details.requestHeaders.some((header) => header.name === 'Authorization');

    if (hasAuthHeader) {
      headers = details.requestHeaders;
    }

    if (details.tabId === -1 && details.url.includes('https://www.prolific.co/api/v1/studies/')) {
      if (details.method === 'GET') {
        if (headers) {
          return { requestHeaders: headers };
        }

        return { cancel: true };
      }
    }

    return {};
  },
  {
    urls: ['https://*.prolific.co/*'],
  },
  ['blocking', 'requestHeaders'],
);
