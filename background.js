const exchange = {
  rate: null,
  
  check () {
    tools.xhr({
      method: `GET`,
      url: `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22GBPUSD%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`
    })
    .then(exchange.parse)
    .catch(error => {
      setTimeout(exchange.check, 1000);
    });
  },  
  
  parse (result) {
    const obj = JSON.parse(result);
    if (obj.query.results.rate.Rate) {
      exchange.rate = obj.query.results.rate.Rate;
    }
  }
};

const prolific = {
  checked: null, 
  
  timeout: null,
  
  studies: {},
  
  notified: [],
  
  available: [],
    
  check () {
    clearTimeout(prolific.timeout);
    
    tools.xhr({
      method: `GET`,
      url: `https://www.prolific.ac/studies`
    })
    .then(prolific.parse)
    .catch(error => {
      prolific.timeout = setTimeout(prolific.check, Number(options.interval) * 1000);
    });
    
    prolific.checked = new Date();
    console.log(prolific.checked);
  },
  
  parse (result) {
    const doc = document.implementation.createHTMLDocument().documentElement; doc.innerHTML = result;
    prolific.available = [];
    
    if (doc.querySelector(`.study`)) {
      for (let elem of doc.querySelectorAll(`.study`)) {
        const id = elem.id;
      
        tools.xhr({
          method: `GET`,
          url: `https://www.prolific.ac/api/studies/${id}`
        })
        .then(prolific.studyInfo)
        .catch(error => {
          if (!prolific.notified.includes(id)) {            
            tools.notification({
              url: `https://www.prolific.ac/studies/${id}`,
              body: [
                `Error retrieving information =(`,
                `${error}`
              ],
              title: `Study Found!`
            });
          }
        });
        
        prolific.available.push(id);
      }
    }
    
    chrome.browserAction.setBadgeBackgroundColor({
      color: [255, 0, 0, 255]
    });
    chrome.browserAction.setBadgeText({
      text: prolific.available.length > 0 ? prolific.available.length.toString() : ``
    });
    
    prolific.timeout = setTimeout(prolific.check, Number(options.interval) * 1000);
  },
  
  studyInfo (result) {
    const obj = JSON.parse(result);
    prolific.studies[obj.id] = obj;
    
    if (prolific.notified.includes(obj.id) === false) {
      tools.notification({
        url: `https://www.prolific.ac/studies/${obj.id}`,
        body: [
          `Reward: £${(obj.reward / 10000).toFixed(2)} - £${obj.average_reward_per_hour.toFixed(2)}/hr ${exchange.rate ? `• $${(obj.reward / 10000 * exchange.rate).toFixed(2)} - $${(obj.average_reward_per_hour * exchange.rate).toFixed(2)}/hr` : ``}`,
          `Takes ${obj.average_time_taken} minutes • Allowed ${obj.maximum_allowed_time} minutes`,
          `Available Places: ${obj.places_remaining}/${obj.total_available_places}`
        ],
        title: obj.name
      });
      
      prolific.notified.push(obj.id);
      
      if (options.announce === true) {
        chrome.tts.speak(`Proliffic Study Found!`, {
          enqueue: true,
          voiceName: `Google US English`
        });
      }
    }
  },
  
  sendStudies () {
    const obj = {
      studies: {},
      exchangeRate: exchange.rate
    };
    
    for (let i = 0; i < prolific.available.length; i ++) {
      const id = prolific.available[i];
      obj.studies[id] = prolific.studies[id];
    }
    
    chrome.runtime.sendMessage({
      type: `sendStudies`,
      message: obj
    });
  }
};

const tools = {
  xhr (obj) {
    return new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open(obj.method, obj.url);
      xhr.timeout = obj.timeout ? obj.timeout : 5000;
      xhr.responseType = obj.responseType ? obj.responseType : `text`;
      
      if (obj.headers) {
        for (let key in obj.headers) {
          xhr.setRequestHeader(key, obj.headers[key]);
        }
      }
      
      let formData = obj.formData ? obj.formData : null;
      if (formData && typeof formData === `object`) {
        formData = Object.keys(formData)
          .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(formData[key])}`)
          .join(`&`);
      }
      
      xhr.send(formData);
      
      xhr.onload = function () {
        if (this.status === 200) resolve(this.response);
        else reject(`${this.status} - ${this.statusText}`);
      };
      xhr.onerror = function () {
        reject(`${this.status} - ${this.statusText}`);
      };
      xhr.ontimeout = function () {
        reject(`${this.status} - ${this.statusText}`);
      };
    });
  }, 
  
  notification (obj) {
    const noti = new Notification(obj.title, {
      icon: `prolific.png`,
      body: obj.body.join(`\n`)
    });
    
    if (obj.timeout) {
      setTimeout(noti.close.bind(noti), obj.timeout);
    }
    
    if (obj.url) {
      noti.onclick = function () {
        window.open(obj.url);
        noti.close.bind(noti);
      };
    }
  }
};

let options;

chrome.storage.local.get(`options`, data => {
  options = data.options || {
    interval: 5000,
    announce: true
  };
});

chrome.storage.onChanged.addListener(changes => {
  if (changes.options) {
    options = changes.options.newValue;
    prolific.check();
  }
});

chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
  if (request.type === `askStudies`) {
    prolific.sendStudies();
  }
});

exchange.check();
prolific.timeout = setTimeout(prolific.check, 5000);