import { browser, WebRequest } from 'webextension-scripts/polyfill';

import { fetchProlificStudies } from '../functions/fetchProlificStudies';
import { openProlificStudy } from '../functions/openProlificStudy';
import { configureStore } from '../store';
import { prolificStudiesUpdate, prolificErrorUpdate } from '../store/prolific/actions';
import { sessionLastChecked } from '../store/session/action';
import { prolificStudiesUpdateMiddleware } from '../store/prolificStudiesUpdateMiddleware';
import { settingsAlertSoundMiddleware } from '../store/settingsAlertSoundMiddleware';

const store = configureStore(prolificStudiesUpdateMiddleware, settingsAlertSoundMiddleware);

let authHeader: WebRequest.HttpHeadersItemType;
let timeout = window.setTimeout(main);

function updateResults(results: any[]) {
  store.dispatch(prolificStudiesUpdate(results));
  store.dispatch(sessionLastChecked());
  browser.browserAction.setBadgeText({ text: results.length ? results.length.toString() : '' });
}

async function main() {
  clearTimeout(timeout);
  const state = store.getState();

  if (authHeader) {
    try {
      const response = await fetchProlificStudies(authHeader);

      if (response.results) {
        updateResults(response.results)
        browser.browserAction.setBadgeBackgroundColor({ color: 'red' });
      }

      if (response.error) {
        if (response.error.status === 401) {
          store.dispatch(prolificErrorUpdate(401));
          browser.browserAction.setBadgeText({ text: '!' });
          browser.browserAction.setBadgeBackgroundColor({ color: 'red' });
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
  } else {
    store.dispatch(prolificErrorUpdate(401));
  }

  timeout = window.setTimeout(main, state.settings.check_interval * 1000);
}

browser.notifications.onClicked.addListener((notificationId) => {
  browser.notifications.clear(notificationId);
  openProlificStudy(notificationId);
});

function handleSignedOut() {
  authHeader = null
  updateResults([])
  store.dispatch(prolificErrorUpdate(401))
}

// Watch for url changes and handle sign out
browser.webNavigation.onCompleted.addListener(
  (details) => {
    handleSignedOut();
  },
  {
    url: [{ urlEquals: 'https://www.prolific.co/auth/accounts/login/'}],
  },
);

// Prolific is a single page app, so we need to watch
// the history state for changes too
browser.webNavigation.onHistoryStateUpdated.addListener(
  (details) => {
    handleSignedOut();
  },
  {
    url: [{ urlEquals: 'https://app.prolific.co/login'}],
  },
);

// Parse and save the Authorization header from any Prolific request.
browser.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    const foundAuthHeader = details.requestHeaders.find((header) => header.name === 'Authorization');


    if (foundAuthHeader) {
      if (foundAuthHeader.value === 'Bearer null') {
        return
      }

      let restart = false;

      if (!authHeader) {
        restart = true;
      }

      authHeader = foundAuthHeader;

      if (restart) {
        main();
      }
    }

    return {};
  },
  {
    urls: ['https://www.prolific.co/api/*'],
  },
  ['blocking', 'requestHeaders'],
);

browser.runtime.onMessage.addListener((message) => {
  if (message === 'check_for_studies') {
    main();
  }
});
