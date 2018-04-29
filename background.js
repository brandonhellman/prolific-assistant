let timeout;
const notified = [];

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

function extractStudies(text) {
  const doc = new DOMParser().parseFromString(text, `text/html`);

  const studies = [...doc.querySelectorAll(`h3 > a[href^="/studies/"]`)].reduce(
    (accumulator, element) => {
      const study = element.closest(`.row`);
      const props = [...study.querySelectorAll(`li`)].map(el =>
        el.textContent
          .split(`:`)[1]
          .replace(/\s\s+/, ``)
          .trim()
      );

      const id = element.pathname.replace(`/studies/`, ``);

      Object.assign(accumulator, {
        [id]: {
          href: `https://www.prolific.ac/${element.pathname}`,
          title: element.textContent,
          hostedBy: props[0],
          reward: props[1],
          avgRewardPerHour: props[2],
          availablePlaces: props[3],
          maximumAllowedTime: props[4],
          avgCompletionTime: props[5]
        }
      });

      return accumulator;
    },
    {}
  );
  return studies;
}

function getStudies() {
  return new Promise(async (resolve, reject) => {
    const response = await fetch(`https://www.prolific.ac/studies`, {
      credentials: `include`
    });

    if (response.ok) {
      const text = await response.text();
      const studies = extractStudies(text);

      resolve(studies);
    } else {
      reject(new Error(`${response.status} - ${response.statusText}`));
    }
  });
}

function notification(study) {
  chrome.notifications.create(study.href, {
    type: `list`,
    title: study.title,
    message: ``,
    iconUrl: `/prolific.png`,
    items: [
      {
        title: `Hosted By`,
        message: study.hostedBy
      },
      {
        title: `Reward`,
        message: `${study.reward} | Avg. ${study.avgRewardPerHour}`
      },
      {
        title: `Time`,
        message: `${study.maximumAllowedTime} | Avg. ${study.avgCompletionTime}`
      },
      {
        title: `Places`,
        message: study.availablePlaces
      }
    ],
    buttons: [{ title: `Open` }]
  });
}

async function announceStudies(studies) {
  let needToAnnounce = false;

  Object.keys(studies).forEach(id => {
    if (!notified.includes(id)) {
      const study = studies[id];

      notification(study);
      notified.push(id);
      needToAnnounce = true;
    }
  });

  if (needToAnnounce) {
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
  window.open(notificationId);
  chrome.notifications.clear(notificationId);
});

timeout = setTimeout(prolific, 10000);
