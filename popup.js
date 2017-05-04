const popup = {
  checked (message) {
    document.getElementById(`checked`).innerHTML = `Last Checked: ${message.checked ? message.checked.split(`(`)[0].trim() : `Never`}`;
  }, 
  
  studies (message) {
    let html = ``;
    
    if (Object.keys(message.studies).length === 0) {
      html = `<div class="text-center">No Studies Available</div>`;
    }
    else {
      for (let key in message.studies) {
        const study = message.studies[key];
        html +=
          `<div class="card card-inverse bg-primary">
            <h6 class="card-header">
              <a href="https://www.prolific.ac/studies/${study.id}" target="_blank" class="text-white">${study.name}</a>
            </h6>
            <div class="card-block">
              <table class="w-100">
                <tr>
                  <td class="w-50">
                    <b>Hosted By:</b> ${study._researcher_name}
                  </td>
                  <td class="w-50">
                    <b>Available Places:</b> ${study.places_remaining}/${study.total_available_places}
                  </td>
                </tr>
                <tr>
                  <td class="w-50">
                    <b>Reward:</b> £${(study.reward / 10000).toFixed(2)} $${(study.reward / 10000 * message.exchangeRate).toFixed(2)}
                  </td>
                  <td class="w-50">
                    <b>Time Allowed:</b> ${study.maximum_allowed_time} minutes
                  </td>
                </tr>
                <tr>
                  <td class="w-50">
                    <b>Reward /hr:</b> £${study.average_reward_per_hour.toFixed(2)}/hr $${(study.average_reward_per_hour * message.exchangeRate).toFixed(2)}/hr
                  </td>
                  <td class="w-50">
                    <b>Completion Time:</b> ${study.average_time_taken} minutes
                  </td>
                </tr>
              </table>
            </div>
          </div>`
        ;
      }
    }
        
    document.getElementById(`studies`).innerHTML = html;
  },
  
  balance (message) {
    document.getElementById(`balance`).innerHTML = `Pend: £${message.balance.pend ? message.balance.pend.toFixed(2) : `null`} • Avail: £${message.balance.avail ? message.balance.avail.toFixed(2) : `null`}`;
  }
};

document.addEventListener(`DOMContentLoaded`, event => {
  chrome.storage.local.get(`options`, data => {
    if (data.options) {
      const interval = document.getElementById(`interval`);
      const announce = document.getElementById(`announce`);
      
      interval.value = data.options.interval;
      announce.checked = data.options.announce;
      
      if (data.options.announce === false) {
        announce.parentElement.className = announce.parentElement.className.replace(`btn-primary`, `btn-secondary`);
      }
    }
  });
  
  chrome.runtime.onMessage.addListener(request => {
    if (request.type === `sendStudies`) {
      popup.checked(request.message);
      popup.studies(request.message);
    }
    if (request.type === `balance`) {
      console.log(request.message);
      popup.balance(request.message);
    }
  });
  
  chrome.runtime.sendMessage({
    type: `askStudies`
  });
  
  chrome.runtime.sendMessage({
    type: `askBalance`
  });
});

document.addEventListener(`change`, event => {
  const interval = document.getElementById(`interval`);
  const announce = document.getElementById(`announce`);
    
  if (announce.checked === true && announce.parentElement.className.match(`btn-secondary`)) {
    announce.parentElement.className = announce.parentElement.className.replace(`btn-secondary`, `btn-primary`);
  }
  else if (announce.checked === false && announce.parentElement.className.match(`btn-primary`)) {
    announce.parentElement.className = announce.parentElement.className.replace(`btn-primary`, `btn-secondary`);
  }
  
  chrome.storage.local.set({
    options: {
      interval: interval.value,
      announce: announce.checked
    }
  });
});