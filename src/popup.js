'use strict';

import './popup.css';

(function () {
  // We will make use of Storage API to get and store `count` value
  // More information on Storage API can we found at
  // https://developer.chrome.com/extensions/storage

  // To get storage access, we have to mention it in `permissions` property of manifest.json file
  // More information on Permissions can we found at
  // https://developer.chrome.com/extensions/declare_permissions
  const KamiKyokuStorage = {
    get: cb => {
      chrome.storage.sync.get(['data'], result => {
        cb(result.data);
      });
    },
    set: (value, cb) => {
      chrome.storage.sync.set(
        {
          data: {
            webHookAddress: value.webHookAddress,
            userName: value.userName
          },
        },
        () => {
          cb();
        }
      );
    },
  };

  function setupCounter() {
    KamiKyokuStorage.get((data) => {
      console.log(data)
      document.getElementById("WebHookAddress").value = data.webHookAddress;
      document.getElementById("UserName").value = data.userName;
    })
    document.getElementById('saveBtn').addEventListener('click', () => {
      console.log("save")
      update();
    });
  }

  function update() {
    let webHookAddress = document.getElementById("WebHookAddress").value;
    let userName = document.getElementById("UserName").value;
    KamiKyokuStorage.set({ webHookAddress, userName }, () => { });
  }

  function restore() {
    // Restore count value
    KamiKyokuStorage.get(data => {
      if (typeof data === 'undefined') {
        // Set counter value as 0
        KamiKyokuStorage.set({ webHookAddress: "", userName: "" }, () => { });
      }
      setupCounter();
    });
  }

  document.addEventListener('DOMContentLoaded', restore);

  // Communicate with background file by sending a message
  chrome.runtime.sendMessage(
    {
      type: 'GREETINGS',
      payload: {
        message: 'Hello, my name is Pop. I am from Popup.',
      },
    },
    response => {
      console.log(response.message + "...");
    }
  );
})();
