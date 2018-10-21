const toMoney = (n) => (n / 100).toFixed(2);

function displayChecked(checked) {
  document.getElementById('checked').textContent = `Last Checked: ${checked}`;
}

function displayOptions(options) {
  document.getElementById('announce').checked = options.announce;
  document.getElementById('interval').value = options.interval;
}

function studyHTML(study) {
  return `<div class="card mt-2">
    <div class="card-header p-0" style="line-height: 1;">
      <b><a href="https://app.prolific.ac/studies" target="_blank">${
        study.name
      }</a></b>
    </div>
    <div class="card-block" style="line-height: 1.25;">
      <table class="w-100 small">
        <tr>
          <td class="w-50">
            <b>Hosted By:</b> <span>${study.researcher.institution.name ||
              study.researcher.name}</span>
          </td>
          <td class="w-50">
            <b>Available Places:</b> <span>${study.total_available_places -
              study.places_taken}</span>
          </td>
        </tr>
        <tr>
          <td class="w-50">
            <b>Reward:</b> <span>${toMoney(study.reward)}</span>
          </td>
          <td class="w-50">
            <b>Reward /hr:</b> <span>${toMoney(
              study.average_reward_per_hour,
            )}</span>
          </td>
        </tr>
        <tr>
          <td class="w-50">
            <b>Completion Time:</b> <span>${
              study.estimated_completion_time
            } minutes</span>
          </td>
        </tr>
      </table>
    </div>
  </div>`;
}

function displayStudies(studies) {
  if (studies.length) {
    studies.forEach((o) => {
      document
        .getElementById('studies')
        .insertAdjacentHTML('beforeend', studyHTML(o));
    });
  } else {
    document
      .getElementById('studies')
      .insertAdjacentHTML(
        'beforeend',
        '<a href="https://app.prolific.ac/studies" target="_blank">No Studies</a>',
      );
  }
}

chrome.storage.local.get(null, (items) => {
  const { checked, options, studies } = items;

  // displayBalance();
  displayChecked(checked);
  displayOptions(options);
  displayStudies(studies);
});

document.addEventListener('change', () => {
  const interval = document.getElementById('interval').value;
  const announce = document.getElementById('announce').checked;

  chrome.storage.local.set({ options: { announce, interval } });
  chrome.runtime.sendMessage({ prolific: true });
});
