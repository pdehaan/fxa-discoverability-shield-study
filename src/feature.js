/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "(feature)" }]*/

const DEFAULT_AVATAR = 0;
const UNVERIFIED_AVATAR = 1;
const USER_AVATAR = 2;

const STANDARD_AVATARS = {
  [DEFAULT_AVATAR]: "icons/avatar.svg",
  [UNVERIFIED_AVATAR]: "icons/avatar_confirm.svg",
};

/**  Example Feature module for a Shield Study.
 *
 *  UI:
 *  - during INSTALL only, show a notification bar with 2 buttons:
 *    - "Thanks".  Accepts the study (optional)
 *    - "I don't want this".  Uninstalls the study.
 *
 *  Firefox code:
 *  - Implements the 'introduction' to the 'button choice' study, via notification bar.
 *
 *  Demonstrates `studyUtils` API:
 *
 *  - `telemetry` to instrument "shown", "accept", and "leave-study" events.
 *  - `endStudy` to send a custom study ending.
 *
 **/
class Feature {
  constructor() {}
  /** A Demonstration feature.
   *
   *  - variation: study info about particular client study variation
   *  - reason: string of background.js install/startup/shutdown reason
   *
   */
  configure(studyInfo) {
    const feature = this;
    const { variation, isFirstRun } = studyInfo;

    // Initiate our browser action
    new FxABrowserFeature(variation);

    // perform something only during first run
    if (isFirstRun) {
      // TODO: What should we do on first run
    }
  }

  /* good practice to have the literal 'sending' be wrapped up */
  sendTelemetry(stringStringMap) {
    browser.study.sendTelemetry(stringStringMap);
  }

  /**
   * Called at end of study, and if the user disables the study or it gets uninstalled by other means.
   */
  async cleanup() {}
}

class FxABrowserFeature {
  /**
   * - set image, text, click handler (telemetry)
   */
  constructor(variation) {
    browser.browserAction.setTitle({ title: "Firefox Account" });

    browser.fxa.listen();

    this.updateState();

    browser.fxa.onUpdate.addListener(() => {
      this.updateState();
    });
  }

  async updateState() {
    // The stored sessionToken will always be the source of truth when checking
    // account state.
    const user = await browser.fxa.getSignedInUser();
    if (user) {
      if (user.verified) {
        this.verifiedUser(user);
      } else {
        this.unverifiedUser();
      }
    } else {
      this.noUser();
    }
  }

  noUser() {
    this.standardAvatar(DEFAULT_AVATAR);
    browser.browserAction.setPopup({ popup: "popup/sign_in/sign_in.html" });
  }

  standardAvatar(id) {
    this._avatarUrl = null;
    if (this._avatar !== id) {
      this._avatar = id;
      browser.browserAction.setIcon({ path: STANDARD_AVATARS[id] });
    }
  }

  unverifiedUser() {
    this.standardAvatar(UNVERIFIED_AVATAR);
    browser.browserAction.setPopup({ popup: "popup/unverified/unverified.html" });
  }

  verifiedUser(user) {
    if (user.avatarDefault) {
      this.standardAvatar(DEFAULT_AVATAR);
    } else {
      this.userAvatar(user.avatar);
    }

    browser.browserAction.setPopup({ popup: "popup/menu/menu.html" });
  }

  userAvatar(url) {
    if (this._avatar === USER_AVATAR && this._avatarUrl === url) {
      return;
    }

    this._avatar = USER_AVATAR;
    this._avatarUrl = url;

    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = function() {
      const canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;

      const ctx = canvas.getContext("2d");

      // Create a circular avatar
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2, 0, 2 * Math.PI);
      ctx.clip();

      ctx.drawImage(this, 0, 0);

      const imageData = ctx.getImageData(0, 0, 200, 200);

      browser.browserAction.setIcon({ imageData });
    };
    img.src = url;
  }
}

window.feature = new Feature();
