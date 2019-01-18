"use strict";

const ENTRYPOINT = "fxa_discoverability";
const SIGN_IN_LINK = `https://accounts.firefox.com/signin?action=email&service=sync&context=fx_desktop_v3&entrypoint=${ENTRYPOINT}`;
const CONNECT_ANOTHER_DEVICE = `https://accounts.firefox.com/connect_another_device?service=sync&context=fx_desktop_v3&entrypoint=${ENTRYPOINT}`;
const MANAGE_ACCOUNT = `https://accounts.firefox.com/settings?service=sync&context=fx_desktop_v3&entrypoint=${ENTRYPOINT}`;
const CHANGE_AVATAR = `https://accounts.firefox.com/settings/avatar/change?service=sync&context=fx_desktop_v3&entrypoint=${ENTRYPOINT}`;
const DEVICES_AND_APPS = `https://accounts.firefox.com/settings/clients?service=sync&context=fx_desktop_v3&entrypoint=${ENTRYPOINT}`;
const SEND_TAB_DEVICE = `https://support.mozilla.org/kb/send-tab-firefox-ios-your-computer?utm_source=${ENTRYPOINT}`;

const CLICK_HANDLERS = new Map([
  [ "sign-in-button", () => createNewTab(SIGN_IN_LINK) ],
  [ "manage-account-button", () => createNewTab(MANAGE_ACCOUNT) ],
  [ "sync-preferences-button", () => openSyncPreferences() ],
  [ "connect-another-device-button", () => createNewTab(CONNECT_ANOTHER_DEVICE) ],
  [ "avatar", () => createNewTab(CHANGE_AVATAR) ],
  [ "devices-apps-button", () => createNewTab(DEVICES_AND_APPS) ],
  [ "unverified-button", () => openSyncPreferences() ],
  [ "send-tab-button", () => createNewTab(SEND_TAB_DEVICE) ],
])

init();

async function init() {
  const user = await browser.fxa.getSignedInUser();

  if (user && user.verified) {
    setupAccountMenu(user);
  }

  CLICK_HANDLERS.forEach((handler, id) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("click", handler);
    }
  });
}

function setupAccountMenu(user) {
  if (user) {
    const emailElement = document.getElementById("email");
    if (emailElement) {
      emailElement.innerText = user.email;

      if (user.avatar) {
        document.getElementById("avatar").style.backgroundImage = `url("${user.avatar}")`;
      } else {
        document.getElementById("avatar").style.backgroundImage = `url("/icons/avatar.svg")`;
      }
    }
  }
}

function createNewTab(url) {
  // TODO Log some metrics
  browser.tabs.create({ url });
  window.close();
}

function openSyncPreferences() {
  browser.fxa.openSyncPreferences();
  window.close();
}
