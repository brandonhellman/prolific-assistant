import { browser, Tabs, WebRequest } from 'webextension-polyfill-ts';

import { fetchProlificStudies } from '../functions/fetchProlificStudies';
import { openProlificStudy } from '../functions/openProlificStudy';
import { configureStore } from '../store';
import { prolificStudiesUpdate } from '../store/prolific/actions';
import { sessionLastChecked } from '../store/session/action';
import { prolificStudiesUpdateMiddleware } from '../store/prolificStudiesUpdateMiddleware';
import { settingsAlertSoundMiddleware } from '../store/settingsAlertSoundMiddleware';

const store = configureStore(prolificStudiesUpdateMiddleware, settingsAlertSoundMiddleware);

let authTab: Tabs.Tab & { loggedOut?: boolean };
let headers: WebRequest.HttpHeaders;
let timeout = window.setTimeout(main);

async function openAuthTab() {
  const tab = await browser.tabs.create({ url: 'https://app.prolific.co/', active: false });
  authTab = tab;
}

async function main() {
  clearTimeout(timeout);
  const state = store.getState();

  if (headers) {
    try {
      const studies = await fetchProlificStudies();
      store.dispatch(prolificStudiesUpdate(studies));
      store.dispatch(sessionLastChecked());
      browser.browserAction.setBadgeText({ text: studies.length ? studies.length.toString() : '' });
      browser.browserAction.setBadgeBackgroundColor({ color: 'red' });
    } catch (error) {
      store.dispatch(prolificStudiesUpdate([]));
      browser.browserAction.setBadgeText({ text: '!' });
      browser.browserAction.setBadgeBackgroundColor({ color: 'black' });
      window.console.error('fetchProlificStudies error', error);
    }
  } else if (!authTab) {
    openAuthTab();
  }

  timeout = window.setTimeout(main, state.settings.check_interval * 1000);
}

browser.notifications.onButtonClicked.addListener((notificationId) => {
  browser.notifications.clear(notificationId);
  openProlificStudy(notificationId);
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (authTab && authTab.id == tabId && !authTab.loggedOut) {
    if (changeInfo.status == 'complete') {
      if (tab.url === 'https://app.prolific.co/login') {
        authTab.loggedOut = true;
        browser.tabs.highlight({ windowId: tab.windowId, tabs: tab.index });
      }
    }
  }
});

browser.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    const hasAuthHeader = details.requestHeaders.some((header) => header.name === 'Authorization');

    if (hasAuthHeader) {
      headers = details.requestHeaders;

      if (authTab && authTab.id === details.tabId && !authTab.loggedOut) {
        main();
        authTab = null;
        browser.tabs.remove(details.tabId);
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
