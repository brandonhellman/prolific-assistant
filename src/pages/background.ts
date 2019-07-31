import { fetchProlificStudies } from '../functions/fetchProlificStudies';
import { openProlificStudy } from '../functions/openProlificStudy';
import { configureStore } from '../store';
import { newStudiesMiddleware } from '../store/newStudiesMiddleware';
import { prolificStudiesUpdate } from '../store/prolific/actions';
import { sessionLastChecked } from '../store/session/action';

const store = configureStore(newStudiesMiddleware);

let authTab: chrome.tabs.Tab & { loggedOut?: boolean };
let headers: chrome.webRequest.HttpHeader[];
let timeout = setTimeout(main);

function openAuthTab() {
  chrome.tabs.create({ url: 'https://app.prolific.co/', active: false }, (tab) => {
    authTab = tab;
  });
}

async function main() {
  clearTimeout(timeout);
  const state = store.getState();

  if (headers) {
    try {
      const studies = await fetchProlificStudies();
      store.dispatch(prolificStudiesUpdate(studies));
      store.dispatch(sessionLastChecked());
      chrome.browserAction.setBadgeText({ text: studies.length ? studies.length.toString() : '' });
      chrome.browserAction.setBadgeBackgroundColor({ color: 'red' });
    } catch (error) {
      store.dispatch(prolificStudiesUpdate([]));
      chrome.browserAction.setBadgeText({ text: '!' });
      chrome.browserAction.setBadgeBackgroundColor({ color: 'black' });
      window.console.error('fetchProlificStudies error', error);
    }
  } else if (!authTab) {
    openAuthTab();
  }

  timeout = setTimeout(main, state.settings.check_interval * 1000);
}

chrome.notifications.onButtonClicked.addListener((notificationId) => {
  chrome.notifications.clear(notificationId);
  openProlificStudy(notificationId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (authTab && authTab.id == tabId && !authTab.loggedOut) {
    if (changeInfo.status == 'complete') {
      console.log('chrome.tabs.onUpdated', tabId, tab, authTab);
      if (tab.url === 'https://app.prolific.co/login') {
        authTab.loggedOut = true;
        chrome.tabs.highlight({ windowId: tab.windowId, tabs: tab.index });
      }
    }
  }
});

chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    const hasAuthHeader = details.requestHeaders.some((header) => header.name === 'Authorization');

    if (hasAuthHeader) {
      headers = details.requestHeaders;

      if (authTab && authTab.id === details.tabId && !authTab.loggedOut) {
        main();
        authTab = null;
        chrome.tabs.remove(details.tabId);
      }
    }

    if (details.tabId === -1 && details.url.includes('https://www.prolific.co/api/v1/studies/')) {
      if (details.method === 'GET') {
        if (headers) {
          return { requestHeaders: headers };
        }
      }
    }

    return {};
  },
  {
    urls: ['https://*.prolific.co/*'],
  },
  ['blocking', 'requestHeaders'],
);
