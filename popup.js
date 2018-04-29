function extractBalance(text) {
  const doc = new DOMParser().parseFromString(text, `text/html`);
  const available = doc.querySelector(
    `[title="You must have a minimum of £5 to request a payout."`
  );
  const pending = doc.querySelector(
    `[title="This is the amount of money that you may earn if responses awaiting reviews are approved."]`
  );

  return {
    available: available.textContent.match(/([0-9.]+)/)[0],
    pending: pending.textContent.match(/([0-9.]+)/)[0]
  };
}

function getBalance() {
  return new Promise(async (resolve, reject) => {
    const response = await fetch(
      `https://www.prolific.ac/participant/account`,
      {
        credentials: `include`
      }
    );

    if (response.url.includes(`https://www.prolific.ac/login`)) {
      reject(new Error(`Logged Out!`));
    } else if (response.ok) {
      const text = await response.text();
      const balance = extractBalance(text);

      resolve(balance);
    } else {
      reject(new Error(`${response.status} - ${response.statusText}`));
    }
  });
}

async function displayBalance() {
  const balanceEl = document.getElementById(`balance`);

  try {
    const balance = await getBalance();
    const { available, pending } = balance;

    balanceEl.textContent = `Pend: £${pending} • Avail: £${available}`;
  } catch (error) {
    balanceEl.textContent = error;
  }
}

function displayChecked(checked) {
  document.getElementById(`checked`).textContent = `Last Checked: ${checked}`;
}

function displayOptions(options) {
  document.getElementById(`announce`).checked = options.announce;
  document.getElementById(`interval`).value = options.interval;
}

function studyHTML(study) {
  const { href, title } = study;

  return `<div class="card mt-2">
    <div class="card-header p-0" style="line-height: 1;">
      <b><a href="${href}" target="_blank">${title}</a></b>
    </div>
    <div class="card-block" style="line-height: 1.25;">
      <table class="w-100 small">
        <tr>
          <td class="w-50">
            <b>Hosted By:</b> <span>${study.hostedBy}</span>
          </td>
          <td class="w-50">
            <b>Available Places:</b> <span>${study.availablePlaces}</span>
          </td>
        </tr>
        <tr>
          <td class="w-50">
            <b>Reward:</b> <span>${study.reward}</span>
          </td>
          <td class="w-50">
            <b>Time Allowed:</b> <span>${study.maximumAllowedTime}</span>
          </td>
        </tr>
        <tr>
          <td class="w-50">
            <b>Reward /hr:</b> <span>${study.avgRewardPerHour}</span>
          </td>
          <td class="w-50">
            <b>Completion Time:</b> <span>${study.avgCompletionTime}</span>
          </td>
        </tr>
      </table>
    </div>
  </div>`;
}

function displayStudies(studies) {
  const ids = Object.keys(studies);

  if (ids.length) {
    Object.keys(studies).forEach(id => {
      document
        .getElementById(`studies`)
        .insertAdjacentHTML(`beforeend`, studyHTML(studies[id]));
    });
  } else {
    document
      .getElementById(`studies`)
      .insertAdjacentHTML(
        `beforeend`,
        `<div class="text-center">No Studies</div>`
      );
  }
}

chrome.storage.local.get(null, items => {
  const { checked, options, studies } = items;

  displayBalance();
  displayChecked(checked);
  displayOptions(options);
  displayStudies(studies);
});

document.addEventListener(`change`, () => {
  const interval = document.getElementById(`interval`).value;
  const announce = document.getElementById(`announce`).checked;

  chrome.storage.local.set({ options: { announce, interval } });
  chrome.runtime.sendMessage({ prolific: true });
});
