let headers;
let timeout;
const notified = [];

const toMoney = n => (n / 100).toFixed(2);

function setBadge(studies) {
  const count = Object.keys(studies).length;
  const text = count > 0 ? count.toString() : ``;
  chrome.browserAction.setBadgeText({ text });
  chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
}

function setChecked() {
  chrome.storage.local.set({ checked: new Date().toTimeString() });
}

function setStudies(studies) {
  chrome.storage.local.set({ studies });
}

function getStorage(key) {
  return new Promise(async (resolve, reject) => {
    chrome.storage.local.get(key, items => {
      const value = items[key];

      if (value) {
        resolve(items[key]);
      } else {
        reject(new Error(`No Value for the key: ${key}`));
      }
    });
  });
}

function getStudies() {
  return new Promise(async (resolve, reject) => {
    const response = await fetch(
      `https://www.prolific.ac/api/v1/studies/?current=1`,
      {
        credentials: `include`
      }
    );

    if (response.ok) {
      const json = await response.json();
      resolve(json.results);
    } else {
      reject(new Error(`${response.status} - ${response.statusText}`));
    }
  });
}

function notification(study) {
  chrome.notifications.create(study.id, {
    type: `list`,
    title: study.name,
    message: ``,
    iconUrl: `/prolific.png`,
    items: [
      {
        title: `Hosted By`,
        message: study.researcher.name
      },
      {
        title: `Reward`,
        message: `${toMoney(study.reward)} | Avg. ${toMoney(
          study.average_reward_per_hour
        )}`
      },
      {
        title: `Places`,
        message: `${study.total_available_places - study.places_taken}`
      }
    ],
    buttons: [{ title: `Open` }]
  });
}

async function announceStudies(studies) {
  const needAnnouncing = studies.filter(o => !notified.includes(o.id));

  if (needAnnouncing.length) {
    needAnnouncing.forEach(o => {
      notified.push(o.id);
      notification(o);
    });

    const options = await getStorage(`options`);

    if (options.announce) {
      chrome.tts.speak(`New studies availale on Prolific.`, {
        enqueue: true,
        voiceName: `Google US English`
      });
    }
  }
}

function getInterval() {
  return new Promise(async resolve => {
    const options = await getStorage(`options`);
    const { interval } = options;
    const milliseconds = interval >= 60 ? interval * 1000 : 60000;

    resolve(milliseconds);
  });
}

async function prolific() {
  clearTimeout(timeout);

  try {
    const studies = await getStudies();
    setBadge(studies);
    setStudies(studies);
    announceStudies(studies);
    setChecked();
  } catch (error) {
    window.console.error(error);
  }

  timeout = setTimeout(prolific, await getInterval());
}

chrome.storage.local.get(null, items => {
  const { options } = items;

  if (
    !options ||
    !Object.prototype.hasOwnProperty.call(options, `announce`) ||
    !Object.prototype.hasOwnProperty.call(options, `interval`)
  ) {
    chrome.storage.local.set({ options: { announce: true, interval: 60 } });
  }

  chrome.storage.local.set({ studies: {} });
});

chrome.runtime.onMessage.addListener(request => {
  if (request.prolific) prolific();
});

chrome.notifications.onButtonClicked.addListener(notificationId => {
  window.open(`https://app.prolific.ac/studies/${notificationId}`);
  chrome.notifications.clear(notificationId);
});

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    const { method, requestHeaders } = details;
    const authorizationHeaderExists = requestHeaders.some(
      header => header.name === "Authorization"
    );

    if (authorizationHeaderExists) {
      headers = requestHeaders;
    } else if (headers && method === 'GET') {
      return { requestHeaders: headers };
    }
  },
  { urls: ["https://www.prolific.ac/api/v1/studies*"] },
  ["blocking", "requestHeaders"]
);


prolific();
