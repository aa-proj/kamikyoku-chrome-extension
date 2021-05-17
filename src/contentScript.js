'use strict';

// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

// Log `title` of current active web page
// const pageTitle = document.head.getElementsByTagName('title')[0].innerHTML;
// console.log(
//   `Page titl1e is: '${pageTitle}' - evaluated by Chrome extension's 'contentScript.js' file`
// );
setTimeout(() => {
  document.getElementById("flex").innerHTML += "<button id='kamiBtn'>神曲</button>"
  document.getElementById("kamiBtn").addEventListener("click", sendWH)
}, 2000)

function sendWH() {
  chrome.storage.sync.get(["data"], result => {
    let webHookAddress = result.data.webHookAddress;
    let userName = result.data.userName;
    const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/


    const xml = new XMLHttpRequest();
    xml.open("POST", webHookAddress, false);
    xml.setRequestHeader("content-type", "application/json;charset=UTF-8");
    xml.send(`{"content": "${"https://www.youtube.com/watch?v=" + location.href.match(regex)[7]}", "username": "${userName}"}`)
  })
}

// Communicate with background file by sending a message
chrome.runtime.sendMessage(
  {
    type: 'GREETINGS',
    payload: {
      message: 'Hello, my name is Con. I am from ContentScript.',
    },
  },
  response => {
    // console.log(response.message);
  }
);

// Listen for message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'COUNT') {
    // console.log(`Current count is ${request.payload.count}`);
  }

  // Send an empty response
  // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
  sendResponse({});
  return true;
});
