import { browser, Tabs, WebRequest } from 'webextension-polyfill-ts';

import { fetchProlificStudies } from '../functions/fetchProlificStudies';
import { openProlificStudy } from '../functions/openProlificStudy';
import { configureStore } from '../store';
import { prolificStudiesUpdate, prolificErrorUpdate } from '../store/prolific/actions';
import { sessionLastChecked } from '../store/session/action';
import { prolificStudiesUpdateMiddleware } from '../store/prolificStudiesUpdateMiddleware';
import { settingsAlertSoundMiddleware } from '../store/settingsAlertSoundMiddleware';

const store = configureStore(prolificStudiesUpdateMiddleware, settingsAlertSoundMiddleware);

let authHeader: WebRequest.HttpHeadersItemType;
let authTab: Tabs.Tab & { loggedOut?: boolean };
let timeout = window.setTimeout(main);

async function openAuthTab() {
  authHeader = null;
  authTab = await browser.tabs.create({ url: 'https://app.prolific.co/', active: false });
}

async function main() {
  clearTimeout(timeout);
  const state = store.getState();

  if (authHeader) {
    try {
      const response = await fetchProlificStudies();

      if (response.results) {
        store.dispatch(prolificStudiesUpdate(response.results));
        store.dispatch(sessionLastChecked());
        browser.browserAction.setBadgeText({ text: response.results.length ? response.results.length.toString() : '' });
        browser.browserAction.setBadgeBackgroundColor({ color: 'red' });
      }

      if (response.error) {
        if (response.error.status === 401) {
          store.dispatch(prolificErrorUpdate(response.error.status));
          browser.browserAction.setBadgeText({ text: '!' });
          browser.browserAction.setBadgeBackgroundColor({ color: 'red' });
          openAuthTab();
        } else {
          store.dispatch(prolificStudiesUpdate([]));
          browser.browserAction.setBadgeText({ text: 'ERR' });
          browser.browserAction.setBadgeBackgroundColor({ color: 'black' });
        }
      }
    } catch (error) {
      store.dispatch(prolificStudiesUpdate([]));
      browser.browserAction.setBadgeText({ text: 'ERR' });
      browser.browserAction.setBadgeBackgroundColor({ color: 'black' });
      window.console.error('fetchProlificStudies error', error);
    }
  } else if (!authTab) {
    openAuthTab();
  }

  timeout = window.setTimeout(main, state.settings.check_interval * 1000);
}

browser.notifications.onClicked.addListener((notificationId) => {
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

// Parse and save the Authorization header from any Prolific request.
browser.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    const foundAuthHeader = details.requestHeaders.find((header) => header.name === 'Authorization');

    if (foundAuthHeader) {
      authHeader = foundAuthHeader;

      if (authTab && authTab.id === details.tabId && !authTab.loggedOut) {
        main();
        authTab = null;
        browser.tabs.remove(details.tabId);
      }
    }

    return {};
  },
  {
    urls: ['https://*.prolific.co/*'],
  },
  ['blocking', 'requestHeaders'],
);

// Add the auth header to any reqeuest from the background to the studies API.
browser.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    if (authHeader && details.tabId === -1 && details.method === 'GET') {
      return {
        requestHeaders: [...details.requestHeaders, authHeader],
      };
    }

    return {};
  },
  {
    urls: ['https://www.prolific.co/api/v1/studies/*'],
  },
  ['blocking', 'requestHeaders'],
);
